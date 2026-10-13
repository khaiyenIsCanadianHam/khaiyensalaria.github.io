"""Development-only browser checks. The website itself has no dependencies.

Run a server from the parent of this checkout, then:
  python3 tests/browser_checks.py
Requires Python Playwright and a system Chromium (or CHROMIUM_PATH).
API responses are intercepted: no inquiry emails are sent.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('PORTFOLIO_TEST_URL', 'http://127.0.0.1:8000/khaiyensalaria.github.io/')
HTML = (ROOT / 'index.html').read_text()
KEY = '00000000-0000-4000-8000-000000000000'
passed = []


def check(name, condition):
    assert condition, name
    passed.append(name)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
    page = browser.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE)
    check('one homepage h1', page.locator('h1').count() == 1)
    check('unconfigured delivery is blocked and explained', page.locator('#submit-inquiry').is_disabled() and 'not configured' in page.locator('#setup-notice').inner_text())
    page.locator('#next-step').click()
    check('invalid fields receive descriptions and focus', page.locator('#name').get_attribute('aria-invalid') == 'true' and page.evaluate('document.activeElement.id') == 'name' and 'name-error' in page.locator('#name').get_attribute('aria-describedby'))
    page.locator('#name').fill('Test Visitor')
    page.locator('#email').fill('visitor@example.com')
    page.locator('#name').press('Enter')
    check('Enter advances without sending', page.locator('[data-step="1"]').is_visible())
    page.locator('#project_type').select_option(label='E-commerce / Online Store')
    page.locator('#product_count').fill('25')
    page.locator('#project_type').select_option(label='Booking / Scheduling Website')
    check('irrelevant conditional fields disabled', page.locator('#product_count').is_disabled() and page.locator('#booking_details').is_visible())
    check('all conditional categories work', all(
        (page.locator('#project_type').select_option(label=label) is not None) and page.locator('#' + field).is_visible()
        for label, field in [('Existing Website Redesign', 'redesign_problems'), ('Custom Web Application', 'application_details'), ('Bug Fixes / Website Maintenance', 'maintenance_issue')]
    ))
    page.locator('#project_type').select_option(label='Booking / Scheduling Website')
    page.locator('#booking_details').fill('Consultations')
    page.locator('input[value="Contact Form"]').check()
    page.locator('input[value="Online Payments"]').check()
    page.locator('#next-step').click()
    page.locator('#message').fill('<script>not executed</script>\nA useful website.')
    page.locator('#next-step').click()
    check('review serializes features and excludes irrelevant answers', 'Contact Form, Online Payments' in page.locator('#inquiry-review').inner_text() and 'Approximate product count' not in page.locator('#inquiry-review').inner_text())
    check('review displays user text safely', page.locator('#inquiry-review script').count() == 0 and '<script>' in page.locator('#inquiry-review').inner_text())
    page.locator('#previous-step').click()
    check('back navigation preserves values', 'useful website' in page.locator('#message').input_value())
    for width in [320, 375, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        check(f'no overflow at {width}px', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    page.set_viewport_size({'width': 375, 'height': 812})
    page.locator('.menu-toggle').click()
    page.keyboard.press('Escape')
    check('mobile menu Escape restores focus', page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false' and page.evaluate("document.activeElement.classList.contains('menu-toggle')"))
    page.emulate_media(color_scheme='dark', reduced_motion='reduce')
    check('dark and reduced-motion preferences work', page.evaluate("getComputedStyle(document.body).backgroundColor === 'rgb(16, 22, 34)' && getComputedStyle(document.documentElement).scrollBehavior === 'auto'"))
    page.goto(BASE + '404.html')
    check('404 has valid homepage destination', page.locator('main a').get_attribute('href') == '/khaiyensalaria.github.io/')
    check('404 stylesheet loads', page.evaluate("getComputedStyle(document.body).backgroundColor === 'rgb(16, 22, 34)'"))
    page.close()

    native = browser.new_context(java_script_enabled=False)
    page = native.new_page()
    page.goto(BASE)
    check('no-JS fields and native submit available', page.locator('.form-step:visible').count() == 4 and page.locator('.native-submit button').is_enabled())
    check('native POST endpoint retained', page.locator('form').get_attribute('action') == 'https://api.web3forms.com/submit' and page.locator('form').get_attribute('method') == 'POST')
    check('no-JS navigation available', page.locator('#nav-links').is_visible())
    native.close()

    def prepared_page():
        page = browser.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.route(BASE, lambda route: route.fulfill(body=HTML.replace('[YOUR_WEB3FORMS_ACCESS_KEY]', KEY), content_type='text/html'))
        page.goto(BASE)
        page.locator('#name').fill('Test Visitor')
        page.locator('#email').fill('visitor@example.com')
        page.locator('#next-step').click()
        page.locator('#project_type').select_option(label='E-commerce / Online Store')
        page.locator('#product_count').fill('25')
        page.locator('#project_type').select_option(label='Custom Web Application')
        page.locator('#application_details').fill('A scheduling system')
        page.locator('input[value="Contact Form"]').check()
        page.locator('input[value="Online Payments"]').check()
        page.locator('#next-step').click()
        page.locator('#message').fill('An inquiry for automated testing, never sent.')
        page.locator('#next-step').click()
        page.locator('#privacy_acknowledgment').check()
        return page

    page = prepared_page()
    calls = []
    def success(route):
        calls.append(route.request.post_data)
        route.fulfill(status=200, content_type='application/json', body=json.dumps({'success': True}))
    page.route('https://api.web3forms.com/submit', success)
    page.locator('#submit-inquiry').click()
    page.wait_for_function("document.querySelector('#form-status').dataset.state === 'success'")
    check('confirmed success resets form and review', page.locator('#name').input_value() == '' and page.locator('#inquiry-review').inner_text() == '' and page.locator('[data-step="0"]').is_visible())
    check('payload contains one serialized features key', len(calls) == 1 and calls[0].count('name="requested_features"') == 1 and 'Contact Form, Online Payments' in calls[0])
    check('payload excludes irrelevant hidden answers', 'name="product_count"' not in calls[0] and 'name="application_details"' in calls[0])
    page.close()

    for name, response in [
        ('HTTP rejection', {'status': 400, 'content_type': 'application/json', 'body': '{"success":false}'}),
        ('API failure', {'status': 200, 'content_type': 'application/json', 'body': '{"success":false}'}),
        ('invalid JSON', {'status': 200, 'content_type': 'text/plain', 'body': 'Unexpected response'}),
        ('network error', None),
    ]:
        page = prepared_page()
        page.route('https://api.web3forms.com/submit', lambda route, request, response=response: route.fulfill(**response) if response else route.abort('failed'))
        page.locator('#submit-inquiry').click()
        page.wait_for_function("document.querySelector('#form-status').dataset.state === 'error'")
        check(f'{name} preserves data and allows retry', page.locator('#name').input_value() == 'Test Visitor' and page.locator('#submit-inquiry').is_enabled())
        page.close()

    page = prepared_page()
    # Compress only the application's timeout in this test; no production change.
    page.evaluate("""(() => { const original = window.setTimeout; window.setTimeout = (fn, ms, ...args) => original(fn, ms === 20000 ? 50 : ms, ...args); })()""")
    timed_out = []
    page.route('https://api.web3forms.com/submit', lambda route: timed_out.append(route))
    page.locator('#submit-inquiry').click()
    page.wait_for_function("document.querySelector('#form-status').dataset.state === 'error'")
    check('timeout preserves data and explains uncertain delivery', 'delivery is unconfirmed' in page.locator('#form-status').inner_text() and page.locator('#name').input_value() == 'Test Visitor')
    timed_out[0].abort()
    page.close()

    page = prepared_page()
    held = []
    page.route('https://api.web3forms.com/submit', lambda route: held.append(route))
    page.locator('#submit-inquiry').click()
    page.wait_for_function("document.querySelector('form').getAttribute('aria-busy') === 'true'")
    page.locator('form').evaluate('(form) => { form.requestSubmit(); form.requestSubmit(); }')
    check('duplicate submissions prevented while pending', len(held) == 1 and page.locator('#submit-inquiry').is_disabled() and page.locator('#previous-step').is_disabled())
    held[0].fulfill(status=200, content_type='application/json', body='{"success":true}')
    page.wait_for_function("document.querySelector('#form-status').dataset.state === 'success'")
    page.close()
    check('no JavaScript runtime errors', not errors)
    browser.close()

print(f'{len(passed)} browser checks passed. Web3Forms responses were mocked; no live delivery tested.')
for name in passed:
    print('PASS:', name)
