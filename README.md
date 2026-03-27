# MellowKraft Landing Page

Single-page narrative marketing site for MellowKraft, built with React + Vite and prepared for Cloudflare Pages hosting.

## Stack

- React + Vite
- GSAP + ScrollTrigger for cinematic sections
- Firebase Firestore for lead storage
- Firebase Analytics for CTA/form instrumentation
- Cloudflare Pages Functions for server-side validation + lead classification

## Environment setup

1. Copy `.env.example` to `.env`.
2. Fill all `VITE_FIREBASE_*` values from Firebase project settings.
3. Enable Firestore and deploy `firestore.rules`.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`
- SPA fallback: `public/_redirects` includes `/* /index.html 200` to support `/admin` direct URL loads

Deploy manually:

```bash
npm run pages:deploy
```

Preview deploy (non-production branch):

```bash
npm run pages:deploy:preview
```

Local preview with Pages runtime:

```bash
npm run build
npm run pages:dev
```

## Lead pipeline behavior

1. Contact form posts to `/api/lead-submit`.
2. Cloudflare Function validates payload, anti-bot checks, and classifies lead (`Hot`, `Warm`, `Cold`).
3. Client writes normalized payload + classification into Firestore collection `leads`.

## Admin panel

- Route: `/admin`
- Auth: Firebase Email/Password sign-in
- Access logic:
	- Allows users listed in `VITE_ADMIN_EMAILS`
	- Or users with Firebase custom claim `admin: true`
- Features included:
	- Real-time lead list
	- Lead detail view
	- Pipeline status update
	- Admin notes update
	- Click-to-call action for lead phone numbers

### Firestore rule expectation

- Public lead submissions are still allowed (`create` on `leads`).
- `read/update/delete` on `leads` are restricted to admin accounts.

Deploy updated rules after changes:

```bash
firebase deploy --only firestore:rules
```

## Notes

- `Monthly Sales` is a required numeric INR field for deterministic qualification.
- Firestore rules currently allow create-only on `leads` and block all reads/updates/deletes from clients.
