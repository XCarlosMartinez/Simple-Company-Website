# React Sanity Template

A starter workspace for projects with a Vite React frontend and a standalone Sanity Studio.

## Structure

```text
react-sanity-template/
  web/                  # Vite + React app
    src/sanity/         # Sanity client, image builder, and GROQ queries
  studio/               # Standalone Sanity Studio
    schemaTypes/
      documents/        # Document schemas
      objects/          # Reusable object schemas
      blocks/           # Portable Text and block schemas
```

## Setup

1. Install dependencies from the root:

   ```bash
   npm install
   ```

2. Copy the example env files:

   ```bash
   cp web/.env.example web/.env
   cp studio/.env.example studio/.env
   ```

3. Fill in your Sanity project ID and dataset in both env files.

4. Start either app:

   ```bash
   npm run dev:web
   npm run dev:studio
   ```

## Notes

- The Studio is standalone, which keeps Sanity builds and updates separate from the frontend.
- Frontend Sanity code lives in `web/src/sanity`.
- Studio schemas are grouped by documents, objects, and blocks so the template can grow cleanly.
- This folder intentionally does not include Git history or installed dependencies.
