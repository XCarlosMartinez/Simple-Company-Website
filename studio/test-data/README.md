# Project Test Data

This folder contains a seed script that creates 9 test `project` documents in Sanity. It also uploads generated placeholder images so the Projects page can be tested with a full 3-column grid.

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

The script is safe to run more than once. It finds test projects by slug and updates them instead of creating duplicates.
