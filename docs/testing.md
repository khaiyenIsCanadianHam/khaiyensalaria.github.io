# Validation and release checklist

## Executed in the cloud environment

- Chromium browser regression checks: **31 passed**, including widths 320/375/768/1024/1440 px, no horizontal overflow, required-field errors and focus, Enter progression, backward value preservation, all conditional categories, safe text-only review, a single serialized features key, irrelevant-answer exclusion, native no-JavaScript navigation/form, dark mode, reduced motion, 404 assets/home destination, and missing-key guidance.
- Submission tests intercepted the Web3Forms endpoint: confirmed-success reset (including clearing the hidden review), HTTP rejection, API `success: false`, malformed JSON, network failure, timeout, preserved data/retry, and prevention of duplicate requests while pending. **These are mocked API responses, not live delivery.**
- JavaScript syntax checked with the installed JavaScript runtime; no JavaScript runtime errors in the browser checks. No Node/npm runtime or tooling is needed by the website.
- Desktop and mobile screenshots reviewed for hierarchy, spacing, and responsive composition.
- axe-core 4.10.3 automated homepage accessibility audit: **zero reported violations in light and dark themes**, including WCAG A/AA tags through 2.2 and best-practice checks. Automated results do not establish complete WCAG compliance or replace screen-reader testing.
- All four form steps audited at mobile width in light and dark mode: **eight audits, zero reported violations**. The matching 404 page also had zero reported axe violations.
- Both HTML files parsed with an HTML5 parser without errors; unique IDs, internal anchors, and local asset targets checked. Sitemap XML parsed successfully.

The application has no build, dependency installation, or code-generation step. It can be served directly from the checkout. Publication and real email delivery require the settings/key described in README.

## Manual and live release checklist

These checks remain for final production review unless separately recorded below:

- [ ] Enable GitHub Pages on `main` → `/ (root)` and confirm the actual deployment URL.
- [ ] Check desktop, mobile, tablet, zoom/reflow, and long user-entered text on representative physical devices/browsers.
- [ ] Complete the whole site and all form steps using keyboard only, including visible focus, mobile menu, privacy notice, and error recovery.
- [ ] Test announcements and labels with NVDA/Firefox or VoiceOver/Safari; no focus traps or inaccessible hidden content.
- [ ] Review contrast in light, dark, high-contrast, and reduced-transparency settings. Recheck after changing the palette or adding images.
- [ ] Confirm reduced motion and touch-target comfort on a physical mobile device.
- [ ] Verify all navigation anchors, email, and professional profile destinations.
- [ ] Supply and verify real project/demo, research, certificate, and research-profile URLs. Missing links are currently omitted, not presented as working.
- [ ] Review required/optional validation and all conditional questions on the deployed page.
- [ ] Review four-step progress, Previous/Continue, safe summary, optional unanswered fields, and privacy acknowledgment.
- [ ] Configure the public Web3Forms key and verify a real success response and inbox receipt. Check readable fields, requested features, email reply-to, and sender/subject.
- [ ] Test native POST with JavaScript disabled using the configured key and verify email receipt.
- [ ] Verify failure/retry behavior in the production environment without discarding answers. Timeout delivery remains uncertain.
- [ ] Confirm Web3Forms' basic honeypot handling through their documented procedure; no paid spam-protection feature is assumed.
- [ ] Finalize the privacy retention period and ensure the notice matches actual processing.
- [ ] Run Lighthouse on the published site in light/dark where relevant; target ≥90 performance, accessibility, best practices, and SEO. **No Lighthouse scores are claimed.**
- [ ] Inspect metadata and social preview at the actual URL, and verify consistent canonical/Open Graph/Twitter/Person/sitemap addresses.
- [ ] Validate sitemap XML and robots location at the deployed address; submit sitemap in Search Console after verifying ownership.
- [ ] Check Person JSON-LD using Schema.org Validator; Google's Rich Results Test may report no supported rich-result type for Person, which is not a ranking guarantee or a schema failure.
- [ ] Visit a nonexistent nested path on GitHub Pages and confirm the matching 404, its CSS/favicon, and homepage link.
- [ ] Replace the photo placeholder with the supplied portrait, verify alt text and intrinsic dimensions, and rerun layout checks.

## Test runner

See `tests/browser_checks.py` and README for the local server path and optional development prerequisites. The runner never sends real inquiries. Mock keys and test email addresses are test fixtures, not usable credentials. If tests are run on a different machine, install the developer-only Python Playwright/browser prerequisites separately; production remains static and dependency-free.
