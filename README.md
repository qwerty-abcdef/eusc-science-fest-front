# Science Festival Registration — Frontend (testing build)

Plain functional React + Vite app. No styling effort put in — this is for testing
the registration flow against Supabase, not for the public-facing design.

## What it does
- Sign up / log in (Supabase Auth, email + password)
- First-time profile form (name, phone, email, institution)
- Solo events: enter a Cash App transaction ID to register
- Team events: create a team (get a shareable code) or join one with a code
- Shows registration/team status (pending / verified / rejected)

## Setup

1. Install dependencies:
   npm install

2. Copy `.env.example` to `.env` and fill in your Supabase project values
   (Project Settings > API in the Supabase dashboard):
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...

3. Make sure you've already run `schema.sql` in your Supabase SQL editor.

4. In Supabase, go to Authentication > Providers > Email, and if you want to
   skip email confirmation for faster local testing, turn off
   "Confirm email" (Authentication > Settings). Turn it back on before going live.

5. Run locally:
   npm run dev

## Deploying to GitHub Pages

1. Push this project to a GitHub repo.
2. In `vite.config.js`, set `base: '/your-repo-name/'` to match your repo name
   (already set to `/festival-frontend/` — change if your repo is named differently).
3. Build: `npm run build` (outputs to `dist/`)
4. Deploy the `dist/` folder to the `gh-pages` branch — easiest way:
   npm install -D gh-pages
   add to package.json scripts: "deploy": "gh-pages -d dist"
   npm run build && npm run deploy
5. In your repo's Settings > Pages, set the source to the `gh-pages` branch.

Note: `.env` is gitignored on purpose. When deploying, GitHub Pages serves a
static build, so the values from `.env` get baked in at build time — just make
sure `.env` exists locally (or is set in CI) before you run `npm run build`.

## Notes / known limitations (fine for testing, revisit before launch)
- No password reset flow yet.
- No "resubmit transaction ID" UI yet if a registration/team gets rejected
  (the DB allows it — see schema.sql — but there's no form for it here yet).
- No client-side validation beyond `required` fields.
- Styling is intentionally minimal.
