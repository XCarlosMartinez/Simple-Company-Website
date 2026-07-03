# Project Test Data

This folder contains a seed script that creates 9 test `project` documents in Sanity. It also uploads generated placeholder images so the Projects page can be tested with a full 3-column grid.

It also contains a seed script for the Services page singleton content.
It also contains a seed script for the About page singleton content.
It also contains a seed script for the Home page singleton content.

## Requirements

Set a Sanity write token before running the script:

```bash
SANITY_AUTH_TOKEN=your_write_token
```

The script reads your existing Studio/Web env files for the project ID and dataset:

- `studio/.env`
- `web/.env`

## Run

From the `studio` folder:

```bash
node test-data/seed-projects.mjs
```

To seed the Services page content:

```bash
node test-data/seed-services-page.mjs
```

To seed the About page content:

```bash
node test-data/seed-about-page.mjs
```

To seed the Home page content:

```bash
node test-data/seed-home-page.mjs
```

The scripts are safe to run more than once. Project test data is matched by slug, and singleton page content is replaced by the `servicesPage`, `aboutPage`, and `homePage` IDs.
