# Lakshmi Catering Services

A bilingual, mobile-first website for Lakshmi Catering Services in Chunchghatta, Bengaluru. The V1 site is a static React + TypeScript application with no backend or database.

## Run locally

Requirements: Node.js LTS and npm.

```sh
npm install
npm run dev
```

## Checks

```sh
npm run build
npm run lint
```

## Website features

- English and Kannada language switcher; the selected language is remembered in browser storage.
- Daily meals and bulk event catering enquiries.
- Homemade product information and the supplied premix prices.
- Bulk meal and event catering enquiries open a direct WhatsApp chat; product and group links open the supplied Lakshmi Catering Services group invite.
- Tap-to-call, directions and an embedded Google Maps search.
- Local copies of the supplied logo and photos in `public/images/`.
- Static SEO metadata and local-business structured data. A canonical URL, absolute social image URLs, sitemap and sitemap reference in `robots.txt` are generated when the site URL is configured.
- Optional GA4 event tracking for WhatsApp, phone, directions, daily catering, event catering, product and language actions.

The address, phone number, service radius, group invite and other shared business details are in `src/data/business.ts`.

## GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages after a push to `main`. Push the project to a GitHub repository, then enable **Settings → Pages → Build and deployment → GitHub Actions**.

Add `VITE_GA_MEASUREMENT_ID` as a repository Actions variable to enable GA4. The deployment workflow passes it to the production build; GA4 is not initialized when the variable is empty or invalid. Add `VITE_SITE_URL` and (for a verified custom domain) `VITE_CUSTOM_DOMAIN` as repository Actions variables when needed. The GitHub Pages repository URL is detected automatically when no site URL variable is set. The sitemap, canonical URL and absolute social image URL are generated at build time; local builds without a public URL deliberately omit them. A custom domain also requires configuring DNS and the GitHub Pages custom-domain setting. Verify the live site in Google Search Console separately.

See `.env.example` for the optional local build settings.
