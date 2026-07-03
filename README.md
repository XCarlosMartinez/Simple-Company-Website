# Simple Company Website

A production-ready company website built with a Vite React frontend, a standalone Sanity Studio, and Vercel API routes.

The site includes routed pages for Home, About Us, Services, Projects, and Contact Us. Page content is managed in Sanity, while the contact form uses a serverless API route prepared for Resend email delivery and Cloudflare Turnstile bot protection.

## Project Structure

```text
Simple Company Website/
  web/                  # Vite + React website
    api/                # Vercel serverless API routes
    src/                # React pages, components, and Sanity image helpers
  studio/               # Standalone Sanity Studio
    schemaTypes/        # Home, About, Services, and Project schemas
    test-data/          # Optional seed scripts for starter content
```

## Pages

- Home: Sanity-managed hero, service preview, featured projects, industries, and CTA.
- About Us: Sanity-managed company heading, image, subheading, and paragraph.
- Services: Sanity-managed services, industries, and past projects summary.
- Projects: Sanity-managed project grid with images and descriptions.
- Contact Us: Validated contact form with Resend and Turnstile support.

## Local Setup

Install dependencies from the root:

```bash
npm install
```

Run the website:

```bash
npm run dev:web
```

Run the Sanity Studio:

```bash
npm run dev:studio
```

## Environment Variables

The website expects Sanity configuration in `web/.env` and Studio configuration in `studio/.env`.

For the website and Vercel deployment:

```bash
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-07-02
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

For the Studio:

```bash
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE=
SANITY_STUDIO_API_VERSION=2026-07-02
```

For local seed scripts only:

```bash
SANITY_AUTH_TOKEN=
```

## Build Checks

Build the website:

```bash
npm run build:web
```

Build the Studio:

```bash
npm run build:studio
```

## Hosting

The website is prepared for Vercel. Use `web` as the frontend workspace and keep the API files in `web/api` available to Vercel as serverless functions.

Before hosting, add the website environment variables in Vercel. The public `VITE_` variables are used by the browser build, while Resend, Turnstile secret, and contact email variables must remain server-side only.

The Sanity Studio can be run locally during content editing or deployed separately with Sanity if desired.
