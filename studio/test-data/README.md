# Sanity Seed Data

This folder contains optional seed scripts for starter content and testing.

## Scripts

- `seed-home-page.mjs` creates or replaces the `homePage` singleton.
- `seed-about-page.mjs` creates or replaces the `aboutPage` singleton.
- `seed-services-page.mjs` creates or replaces the `servicesPage` singleton.
- `seed-projects.mjs` creates 9 test `project` documents and uploads generated placeholder images.

The singleton scripts are safe to run more than once because they use fixed document IDs: `homePage`, `aboutPage`, and `servicesPage`.

The project seed script is also safe to rerun. It matches test projects by slug and updates them instead of creating endless duplicates.

## Requirements

Run scripts from the `studio` folder. The scripts read Sanity project settings from:

- `studio/.env`
- `web/.env`

You also need a Sanity write token in the current terminal session.

PowerShell:

```powershell
$env:SANITY_AUTH_TOKEN="your_write_token"
```

Command Prompt:

```cmd
set SANITY_AUTH_TOKEN=your_write_token
```

If the project ID is not available in an env file, set it in the same terminal session:

PowerShell:

```powershell
$env:SANITY_STUDIO_PROJECT_ID="epkwq0nq"
```

Command Prompt:

```cmd
set SANITY_STUDIO_PROJECT_ID=epkwq0nq
```

## Run

From the `studio` folder:

```bash
node test-data/seed-home-page.mjs
node test-data/seed-about-page.mjs
node test-data/seed-services-page.mjs
node test-data/seed-projects.mjs
```

Run only the scripts you need. For example, if you only want starter Home page content, run:

```bash
node test-data/seed-home-page.mjs
```
