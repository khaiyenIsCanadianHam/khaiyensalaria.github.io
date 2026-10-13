# Khaiyen Salaria — personal portfolio

A static, dependency-free portfolio built with HTML, CSS, and vanilla JavaScript. Includes a four-step project inquiry, system light/dark themes, accessible navigation, SEO metadata, and a matching 404 page. No backend, database, analytics, npm, or build process is used.

## Run locally

From the parent of this checkout:

```sh
cd /workspace
python3 -m http.server 8000 --bind 127.0.0.1 --directory /workspace
```

The site path is `/khaiyensalaria.github.io/`. Serving the parent directory also reproduces the GitHub Pages project path used by `404.html`. For ordinary development you can instead serve the checkout directly; the homepage's relative assets work, but the 404 page expects the production project prefix. This is an internal development server, not a public deployment. Use the existing isolated checkout; no Git worktree is necessary.

## Source and design

- [index.html](index.html): content, metadata, Person JSON-LD, all form fields, and public Web3Forms key.
- [style.css](style.css): shared design tokens, responsive layouts, themes, and accessibility preferences.
- [script.js](script.js): navigation and progressively enhanced inquiry logic.
- [404.html](404.html), [robots.txt](robots.txt), [sitemap.xml](sitemap.xml), [favicon.svg](favicon.svg), and [assets/preview.png](assets/preview.png): deployment and discovery assets.
- [Design decisions](docs/design.md): interpretation of all fourteen supplied design documents, design summary, and accessibility/performance alternatives.
- [Validation report and manual checklist](docs/testing.md): executed checks and remaining verification.
- [Browser checks](tests/browser_checks.py): optional development-only tests; API delivery is mocked.

All website source is committed directly at the repository root so GitHub Pages can publish `/ (root)`. The brief's `portfolio/` directory represents the project itself, not an additional deployment subdirectory. Images are optional. The existing preview is an original text-only name card, not a portrait, project screenshot, or fabricated project.

## Unresolved content and configuration

No portfolio project URLs, research documents, certificates, or employment details were included in the supplied files. Their slots are explicitly marked and have no fake links, dates, accomplishments, or technology tags. Supply:

- `[TODO: INSERT PROFILE PHOTO]`: your portrait; you said this will arrive later.
- `[TODO: INSERT PROJECT 01]` through `04`: repository/README, category, description, problem, solution, technologies, features, supported status, and optional demo URLs/images. Supply demo URLs or state none. Descriptions should be 2–3 sentences based on the sources.
- `[TODO: INSERT RESEARCH INFORMATION]`: titles, years, categories, summaries, verified contributions, document/publication links, and whether the work was published. Do not equate unpublished academic work with peer review.
- `[TODO: INSERT CERTIFICATIONS]`: certificate names, issuing organizations, issue dates, optional credential IDs, and actual verification URLs/documents. Omit verification links if unavailable.
- `[TODO: INSERT VERIFIED PROFESSIONAL EXPERIENCE]`: roles, organizations, dates, responsibilities, and sources. Do not invent clients or employment history.
- `[TODO: INSERT INQUIRY RETENTION PERIOD AND ANY ADDITIONAL APPLICABLE PRIVACY DETAILS]`: a real retention policy and relevant privacy details; review the notice before collecting inquiries.
- `[YOUR_WEB3FORMS_ACCESS_KEY]`: a public Web3Forms form key for `khaiyenbusiness@gmail.com`. Delivery is deliberately disabled in the enhanced form until configured. Direct email remains available.
- `[GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]`: optional ownership verification. This placeholder is documented here only; no invalid verification meta tag is published.
- Optional research profile URL: omitted until a real profile is supplied.
- Official palette/font/logo assets if exact Euraolly styling is intended. The supplied files describe principles, but provide no concrete brand values or master artwork. This portfolio uses a provisional personal palette and `ks.` wordmark, not an official Euraolly logo.

**Production URL assumption:** The account is `khaiyenIsCanadianHam`, and the repository is `khaiyensalaria.github.io`. Because the repository does not match `<account>.github.io`, this is a **project site** at `https://khaiyeniscanadianham.github.io/khaiyensalaria.github.io/`. Canonical, Open Graph, Person schema, sitemap, and robots use that address consistently. It is a configured address, not evidence that GitHub Pages is already enabled. Confirm it in Settings → Pages before sharing. If the repository is renamed or a custom domain is configured, update every production URL and the absolute 404 asset/home paths together.

## GitHub Pages publication

1. These files belong in the existing `khaiyenIsCanadianHam/khaiyensalaria.github.io` repository. To use a root account site instead, the repository name must be `khaiyenIsCanadianHam.github.io`; changing to that name also requires the URL/path updates noted above.
2. Commit and push all source, documentation, tests, and assets to `main`.
3. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**.
4. Select **main** and **/ (root)**, then save. `.nojekyll` keeps this a plain static site.
5. Wait for GitHub's Pages deployment to finish and use the URL GitHub displays. Open the homepage, navigate every section, and visit a nonexistent nested path to test the custom 404.
6. For an optional custom domain, configure it in Pages, follow GitHub's DNS instructions for your domain provider, wait for certificate provisioning, and enable HTTPS. Update metadata, robots, sitemap, and 404 paths; retain any required `CNAME` file.
7. Verify all assets load, the canonical matches the published address, mobile layouts work, and a configured form produces a real email.

A Git push does not enable Pages or establish successful deployment. No Pages settings changes are performed by this implementation.

## Configure Web3Forms

1. Visit [Web3Forms](https://web3forms.com/) and create a free access key using the intended destination email, `khaiyenbusiness@gmail.com`.
2. Complete the destination-email verification flow provided by Web3Forms. Use the key returned for that email.
3. Replace `[YOUR_WEB3FORMS_ACCESS_KEY]` in the hidden `access_key` input in `index.html`. This is a **public form key**, intended for client-side use; never substitute a Gmail password, SMTP credential, or unrelated private API key. This single change enables the enhanced form. Native POST submission is retained for visitors without JavaScript.
4. Commit and push the change, wait for Pages deployment, and submit a test inquiry with clearly labeled test content.
5. Verify both the on-page confirmation and receipt in the destination inbox (including spam). Check reply-to is the visitor's `email`, requested features are readable, conditional answers are relevant, and all supplied fields arrive.
6. Test a submission with JavaScript disabled. Native POST navigates to Web3Forms' response rather than showing the inline confirmation. In this fallback, selected features are submitted under repeated `requested_features` fields; the JavaScript path normalizes them into one comma-separated field.
7. The hidden `botcheck` checkbox provides Web3Forms' basic honeypot protection. Confirm spam handling using Web3Forms' current documented test procedure. No paid CAPTCHA, uploads, webhook, or autoresponder is assumed.
8. If submissions fail, confirm the verified key, service status, HTTP response, and network connectivity; retry with test data or use direct email. Do not interpret HTTP 200 alone as success: the script also requires JSON `success: true`. Timeout means delivery is uncertain, and retrying could create another email. Never log personal form contents to diagnose issues.

The stable fields are `name`, `email`, `business_name`, `existing_website`, `project_type`, `project_goal`, `requested_features`, `estimated_budget`, `timeline`, and `message`. Conditional fields use descriptive names. The subject is **New Portfolio Project Inquiry** and the sender display name is **Portfolio Project Inquiries**. Web3Forms controls the actual email layout. No inquiry is saved to SQLite or a CRM.

## Replace and add assets

- **Profile:** supply `assets/images/profile.webp`, preferably about 800 × 1000 px (4:5), with an appropriate crop. Replace `.portrait-placeholder` with `<img class="profile-photo" src="assets/images/profile.webp" width="800" height="1000" alt="Khaiyen Alexander R. Salaria" fetchpriority="high">`. Adjust dimensions to the real image. Keep it eager above the fold.
- **Projects:** optional `assets/images/project-01.webp` through `project-04.webp`, preferably 1200 × 750 px with consistent landscape crops. Use actual project screenshots, intrinsic dimensions, meaningful alt text, and `loading="lazy"`. Remove each neutral CSS illustration when adding the corresponding real image.
- **Social preview:** `assets/preview.png` is 1200 × 630 px and already exists. Replace with an accurate branded preview if desired; keep Open Graph/Twitter URLs and dimensions consistent. Do not use nonexistent image references.
- **Favicon:** the included SVG is a personal `ks.` wordmark, rendered at any resolution.

## Maintain the portfolio

- **New project:** duplicate a project `<article>` in `#projects`, replace every pending field with verified content, add a meaningful category/status and technology list, and link to the actual repository and demo only when available. Link labels should identify the project; CSS-only placeholders are neutral visuals, not screenshots.
- **Biography and skills:** edit `#about` and the hero supporting copy. Add only supported skills. The current list is drawn from the supplied biography.
- **Research:** replace the pending entry in `#research` with one entry per supplied work. Include year, plain-language purpose, verified role, and available document links.
- **Certificates:** replace the pending entry in `#certifications`; show issuer and actual issue date, avoiding unnecessary personal identifiers.
- **Experience:** replace the pending details under About once verified roles are supplied.
- **Form options/budget ranges:** edit the corresponding `<select>` options and feature checkboxes directly in `index.html`. Budget ranges qualify scope; they are not fixed pricing packages. Changing a project category requires matching its `.conditional` `data-project` value. Add a field's name and human-readable label to `reviewLabels` in `script.js` to include it in review.
- **Destination email:** obtain/update the destination through Web3Forms' supported email/key settings, then replace the public key if required. Changing the visible email alone does not redirect Web3Forms. Update mailto links and failure text to match.
- **Privacy:** set a real retention period, keep the notice aligned with actual processing, and do not add unrelated marketing consent.
- **Metadata:** update title, description, canonical, Open Graph, Twitter, JSON-LD, sitemap, robots, and social preview together. Add a real Search Console verification meta tag only after receiving its code.
- **Styles:** edit tokens in `:root` and the dark theme together; preserve readable contrast, visible focus, and reduced-motion behavior.

## Checks

The site requires no dependency install. The optional browser regression suite requires Python Playwright and Chromium in your **development environment**, not in production. This cloud environment already provides them. With the server above running:

```sh
cd /workspace/khaiyensalaria.github.io
python3 tests/browser_checks.py
```

`CHROMIUM_PATH` and `PORTFOLIO_TEST_URL` can override the defaults. API responses are mocked, using only test data. See [docs/testing.md](docs/testing.md) for the executed results and remaining manual/live checks.
