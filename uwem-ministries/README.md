# Uwem Ministries International — website

A lightweight, responsive static website for Uwem Ministries International. The existing repository-root Faiv Media site has been left intact; this complete site lives in `uwem-ministries/` so it can be previewed and deployed independently.

## What it uses

- Semantic HTML, CSS and native JavaScript modules; no runtime framework or external JavaScript dependencies.
- `js/config.js` as the central configuration for verified contact links, social destinations, the Tally form, address and church schedules.
- Native `Intl` date/time formatting with the IANA `Africa/Lagos` zone for the weekly and monthly countdowns.
- Tally's hosted form for prayer requests and WhatsApp links for direct contact and community access.
- Compressed WebP ministry photography; source photographs are not modified beyond orientation, resizing and compression.

## Preview locally

From the repository root:

```sh
python3 -m http.server 4173 --bind 0.0.0.0 --directory uwem-ministries
```

Then open `http://localhost:4173` on the same machine. (For a hosted preview, serve this directory as the static document root.)

## Test the calendar logic

Node is only needed for the zero-dependency test suite; it is not needed to serve the deployed site.

```sh
cd uwem-ministries
npm test
```

The tests cover Sunday and Thursday before/after service time, Redemption Night before and after its first-Friday start, December-to-January rollover, leap-year February, and missing service-time handling.

## Configuration to review

Edit `js/config.js` to update:

- Contact numbers, email and website URL.
- The street address and Google Maps search destination.
- Official Facebook, Instagram, TikTok and YouTube links.
- The general WhatsApp contact number/message and community invite.
- The Tally prayer form and embed URLs.
- Sunday, Thursday and first-Friday service times.

The countdown uses the time in each service configuration and will not create a midnight countdown if a time is blank or invalid. Service times currently entered are Sunday 9:00 AM, Thursday 5:30 PM and first-Friday Redemption Night 9:00 PM (WAT), transcribed from the supplied ministry banner and social-information PDF. The banner also lists Monday Miracle & Power Night (10:00 PM–dawn) and Wednesday Fasting & Prayer (6:00 AM–12:00 noon). Please confirm the schedule remains current before publishing. The HTML includes these values as a no-JavaScript fallback, so update the three visible `.service-clock-label` values in `index.html` as well if the configured times change.

The address shown is “Aka–Obot Idim Road, by Ikot Odout U-turn, Uyo, Akwa Ibom State, Nigeria,” transcribed from `IMG-20261010-WA0008.jpg`. The supplied material did not include an official map listing or coordinates, so the “Open in Google Maps” action searches that text; the page does not embed an unverified map pin.

## Verified integrations and source notes

- The official social destinations, Tally form (`https://tally.so/r/o96vQP`) and WhatsApp community invite were transcribed from `Social Media li-WPS Office.pdf`.
- The ministry's KJV quotations in the Scripture section were checked against the King James Version text in the [aruljohn/Bible-kjv dataset](https://github.com/aruljohn/Bible-kjv) before implementation.
- The supplied social-links PDF lists its WhatsApp Business link as `+234 806 894 1773`; the project brief separately directs the floating, general-enquiry WhatsApp button to `+234 807 114 7348`. The site follows the brief for the floating button and displays both numbers as contact phones. Please confirm the correct WhatsApp destination with the ministry before launch.
- `Youths ministry .jpg`, `Women .jpg`, the church interiors, community photograph, devotional cover, Apostle photograph and official logo were selected from the supplied files. The available general church interior is used for Men's Fellowship rather than attributing another identifiable person to that ministry.
- No testimonies are published. No prayer request data or analytics are stored by this static site. The Tally form is external; submissions are handled under Tally's own service and the ministry's authorised process.

## Deploy with Cloudflare Pages

This is a static directory; no server-side PHP or API is required.

1. Create a Cloudflare Pages project connected to this Git repository.
2. Set **Root directory** to `uwem-ministries` and **Framework preset** to `None`.
3. Set the build command to `npm run test` (or leave it empty if you do not want deployment-time tests) and the build output directory to `.`.
4. Deploy. The app uses relative asset paths, so it works at the project root.
5. Configure `www.uwemministries.org` as the Pages custom domain only after the ministry confirms domain/DNS access. The `CNAME` file, canonical metadata and sitemap are already prepared for that hostname.

## Deploy with GitHub Pages

Because this project is intentionally kept in a subdirectory to preserve the unrelated root website, GitHub Pages cannot publish it by selecting the repository root. A manual workflow template is included at `deployment/github-pages.yml.example`.

1. In **Settings → Pages**, choose **GitHub Actions** as the source.
2. Copy the template to the repository root at `.github/workflows/deploy-uwem-pages.yml`.
3. Run **Deploy Uwem Ministries International site** manually from the Actions tab. The workflow runs `npm test` and uploads only `uwem-ministries/` as the Pages artifact.
4. Configure the custom domain only after the ministry confirms DNS access.

Publishing a new artifact replaces the content served by that repository's Pages site. The current repository root contains an unrelated Faiv Media site, so do not run this workflow against a Pages destination that must continue serving that site; use a separate repository/Pages project or confirm that replacement is intended. The provided canonical URL and `CNAME` assume `www.uwemministries.org`; do not claim the domain is live until DNS and hosting configuration are verified.
