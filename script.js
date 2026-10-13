"use strict";

(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav-links');
  if (menu && nav) {
    document.querySelector('.site-header').classList.add('enhanced-nav');
    menu.hidden = false;
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
    });
    const desktop = matchMedia('(min-width: 761px)');
    const adaptMenu = () => { menu.hidden = desktop.matches; closeMenu(); };
    desktop.addEventListener('change', adaptMenu);
    adaptMenu();
  }
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());
  // Make the privacy notice accessible when reached via a hash link.
  const revealPrivacy = () => {
    if (location.hash === '#privacy') { const notice = document.querySelector('#privacy'); if (notice) notice.open = true; }
  };
  window.addEventListener('hashchange', revealPrivacy);
  revealPrivacy();

  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form-step')];
  const previous = document.querySelector('#previous-step');
  const next = document.querySelector('#next-step');
  const submit = document.querySelector('#submit-inquiry');
  const status = document.querySelector('#form-status');
  const review = document.querySelector('#inquiry-review');
  const progress = document.querySelector('.form-progress');
  const type = form.elements.project_type;
  const conditional = [...form.querySelectorAll('.conditional')];
  const key = form.elements.access_key.value.trim();
  const configured = Boolean(key && !key.includes('[') && !key.includes('YOUR_'));
  let step = 0;
  let submitting = false;
  const labels = ['Contact Information', 'Project Requirements', 'Budget and Timeline', 'Review and Submit'];
  const reviewLabels = {
    name: 'Full name', email: 'Email', business_name: 'Business / organization', existing_website: 'Existing website',
    project_type: 'Project type', project_goal: 'Main goal', requested_features: 'Requested features',
    product_count: 'Approximate product count', online_checkout: 'Online checkout', redesign_problems: 'Problems to fix',
    booking_details: 'Appointments / reservations', application_details: 'Application requirements',
    maintenance_issue: 'Maintenance issue', live_impact: 'Live website affected', estimated_budget: 'Estimated budget',
    timeline: 'Preferred timeline', message: 'Project description'
  };
  form.classList.add('enhanced');
  // Validate only visible steps ourselves; native validation stays intact without JS.
  form.noValidate = true;
  progress.hidden = false;
  document.querySelector('.step-controls').hidden = false;
  document.querySelector('.native-submit').hidden = true;
  document.querySelector('#setup-notice').hidden = configured;
  if (!configured) document.querySelector('#setup-notice').textContent = 'Inquiry delivery is not configured yet. Please email me directly until the form is enabled.';

  const setStatus = (message, state = '') => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const updateConditional = () => {
    conditional.forEach(group => {
      const relevant = group.dataset.project === type.value;
      group.hidden = !relevant;
      group.querySelectorAll('input, select, textarea').forEach(input => { input.disabled = !relevant; });
    });
  };
  type.addEventListener('change', updateConditional);
  updateConditional();

  // FormData.set replaces all repeated checkbox keys with one human-readable value.
  const payload = () => {
    const data = new FormData(form);
    const features = [...form.querySelectorAll('input[name="requested_features"]:checked')].map(input => input.value);
    data.set('requested_features', features.join(', '));
    return data;
  };
  const buildReview = () => {
    const data = payload();
    review.replaceChildren();
    Object.entries(reviewLabels).forEach(([name, label]) => {
      if (!data.has(name)) return; // Disabled, irrelevant category fields are omitted.
      const value = String(data.get(name));
      if (!value && ['business_name', 'existing_website', 'product_count', 'online_checkout', 'redesign_problems', 'booking_details', 'application_details', 'maintenance_issue', 'live_impact'].includes(name)) return;
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value || 'Not provided'; // Never turn unprovided preferences into assumptions.
      review.append(dt, dd);
    });
  };
  const showStep = (value, focus = true) => {
    step = value;
    steps.forEach((fieldset, index) => { fieldset.hidden = index !== step; });
    previous.hidden = step === 0;
    next.hidden = step === steps.length - 1;
    submit.hidden = step !== steps.length - 1;
    submit.disabled = !configured || submitting;
    document.querySelector('#step-status').textContent = `Step ${step + 1} of ${steps.length} — ${labels[step]}`;
    document.querySelector('#step-progress').value = step + 1;
    progress.querySelectorAll('li').forEach((item, index) => {
      if (index === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
    if (step === 3) buildReview();
    if (focus) steps[step].querySelector('.step-heading').focus();
  };
  const clearError = input => {
    input.removeAttribute('aria-invalid');
    const errorId = `${input.id}-error`;
    document.getElementById(errorId)?.remove();
    const remaining = (input.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errorId);
    if (remaining.length) input.setAttribute('aria-describedby', remaining.join(' ')); else input.removeAttribute('aria-describedby');
  };
  const markError = input => {
    clearError(input);
    const message = document.createElement('p');
    message.id = `${input.id}-error`;
    message.className = 'field-error';
    message.textContent = input.validity.valueMissing ? 'Please complete this required field.' : input.validationMessage;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), message.id].filter(Boolean).join(' '));
    input.closest('.field, .privacy-check').insertAdjacentElement('afterend', message);
  };
  const validateStep = index => {
    const fields = [...steps[index].querySelectorAll('input, select, textarea')].filter(input => !input.disabled && input.willValidate);
    const invalid = fields.filter(input => !input.checkValidity());
    fields.forEach(input => input.validity.valid ? clearError(input) : markError(input));
    if (invalid.length) {
      showStep(index);
      invalid[0].focus();
      setStatus('Please check the indicated fields before continuing.', 'error');
      return false;
    }
    return true;
  };
  form.addEventListener('input', event => {
    if (event.target.id && event.target.validity?.valid) clearError(event.target);
  });
  next.addEventListener('click', () => { if (!submitting && validateStep(step)) { setStatus(''); showStep(step + 1); } });
  previous.addEventListener('click', () => { if (!submitting) { setStatus(''); showStep(step - 1); } });
  showStep(0, false);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    // Pressing Enter on an earlier step advances after validation, never sends.
    if (step < 3) { next.click(); return; }
    for (let index = 0; index < steps.length; index++) { if (!validateStep(index)) return; }
    if (!configured) { setStatus('Inquiry delivery is not configured. Please email khaiyenbusiness@gmail.com directly.', 'error'); return; }
    if (form.elements.botcheck.checked) { setStatus('Your inquiry could not be submitted. Please contact me by email.', 'error'); return; }
    const data = payload(); // Capture values before disabling controls.
    submitting = true;
    form.setAttribute('aria-busy', 'true');
    previous.disabled = next.disabled = submit.disabled = true;
    steps.forEach(fieldset => { fieldset.disabled = true; });
    submit.textContent = 'Submitting…';
    setStatus('Submitting your project inquiry…');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, { method: 'POST', body: data, signal: controller.signal, headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) throw new Error('Submission rejected');
      form.reset();
      review.replaceChildren();
      form.querySelectorAll('[aria-invalid]').forEach(clearError);
      updateConditional();
      showStep(0, false);
      setStatus("Your project inquiry has been submitted successfully. Thank you for your interest. I'll review your details and respond using the email address you provided.", 'success');
      status.focus();
    } catch (error) {
      setStatus(error.name === 'AbortError'
        ? 'Submission timed out and delivery is unconfirmed. Your answers are preserved. You may retry, but an earlier request could have arrived. You can also email khaiyenbusiness@gmail.com.'
        : 'Your inquiry could not be submitted. Your answers are preserved. Please retry or contact me directly at khaiyenbusiness@gmail.com.', 'error');
      status.focus();
    } finally {
      clearTimeout(timer);
      submitting = false;
      form.removeAttribute('aria-busy');
      steps.forEach(fieldset => { fieldset.disabled = false; });
      previous.disabled = next.disabled = false;
      submit.disabled = !configured;
      submit.textContent = 'Submit Project Inquiry';
    }
  });
})();
