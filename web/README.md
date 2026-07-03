# Web App

This workspace contains the Vite React website for Simple Company.

## What It Includes

- React Router page routing.
- Responsive navbar with a mobile popup menu.
- Sanity-powered Home, About Us, Services, and Projects pages.
- Contact form validation.
- Vercel API routes for Sanity content and contact form email delivery.
- In-memory client caching to reduce visible loading stutter when navigating between pages.

## Routes

- `/` - Home
- `/about-us` - About Us
- `/services` - Services
- `/projects` - Projects
- `/contact-us` - Contact Us

## API Routes

The files in `web/api` are used by Vercel and mirrored by Vite middleware during local development:

- `/api/home`
- `/api/about`
- `/api/services`
- `/api/projects`
- `/api/contact`

## Environment Variables

Set these in `web/.env` for local development and in Vercel for production:

```bash
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-07-02
```

Contact form email and captcha variables:

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

`VITE_TURNSTILE_SITE_KEY` is public and used by the browser. `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, and email values should only be set as server-side Vercel environment variables.

## Commands

From the project root:

```bash
npm run dev:web
npm run build:web
npm run lint:web
```

From this workspace:

```bash
npm run dev
npm run build
npm run lint
```

## Deployment Notes

Deploy the website to Vercel with the required environment variables configured. The Contact Us page will render without Turnstile configured, but production spam protection requires Cloudflare Turnstile site and secret keys.
