# Sanity Studio

This workspace contains the standalone Sanity Studio for managing the website content.

## Content Models

The Studio currently manages:

- `homePage` - Home page hero, preview section copy, display limits, and final CTA.
- `aboutPage` - About page company name, image, heading, and body copy.
- `servicesPage` - Services, industries, and past projects summary.
- `project` - Project title, slug, image, description, and sort order.

## Environment Variables

Set these in `studio/.env`:

```bash
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE=
SANITY_STUDIO_API_VERSION=2026-07-02
```

Seed scripts also require a write token in the current terminal session:

```bash
SANITY_AUTH_TOKEN=
```

## Commands

From the project root:

```bash
npm run dev:studio
npm run build:studio
```

From this workspace:

```bash
npm run dev
npm run build
npm run deploy
```

## Seed Data

Optional seed scripts live in `studio/test-data`. They can create starter content for the singleton pages and test projects for the Projects page.

See `studio/test-data/README.md` for the exact commands.

## Deployment Notes

The Studio can be used locally or deployed with Sanity using:

```bash
npm run deploy
```

The website can still be hosted on Vercel while the Studio is hosted separately by Sanity.
