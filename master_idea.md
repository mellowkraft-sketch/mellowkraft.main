# MellowKraft Master Idea

## 1) What this project is

MellowKraft is a React + Vite marketing website for a custom ecommerce engineering company.

The project has three major goals:

1. Explain the value proposition for brands that have outgrown Shopify.
2. Capture qualified leads through a structured form.
3. Give internal team members an admin dashboard to review and update lead pipeline status.

Core runtime stack:

- Frontend: React 19, Vite, GSAP, Tailwind utility support, custom CSS.
- Data/Auth: Firebase (Firestore + Auth + Analytics).
- Serverless endpoint: Cloudflare Pages Function at /api/lead-submit.
- Hosting/Deploy: Cloudflare Pages + Wrangler.

## 2) High-level architecture

Top-level folders and their roles:

- src: Main application code (public site + admin + logic + UI).
- functions/api: Cloudflare serverless function for lead validation/classification.
- public: Static files used directly at deploy time (redirects, robots, sitemap, static blog HTML).
- scripts: Build/ops scripts (SSR prerender and Google Search Console helper).
- root config files: Vite, Tailwind, ESLint, TypeScript, Wrangler.

Main runtime split:

- Public experience: src/App.jsx
- Admin dashboard: src/AdminApp.jsx

Route switch happens in src/main.jsx:

- If URL starts with /admin, render admin app.
- Else render public app.

## 3) Runtime flow (public website)

1. index.html boots src/main.jsx.
2. src/main.jsx decides App or AdminApp by path.
3. src/App.jsx renders section-based landing page.
4. Most page copy/data comes from src/content.js.
5. Heavy sections are lazy-loaded with React Suspense.
6. Scroll effects are initialized by src/animations/useScrollAnimations.js.
7. CTA and form events are tracked through src/lib/analytics.js.

Important public components:

- src/components/Navbar.jsx
- src/components/ComparisonScrollSection.jsx
- src/components/SolutionStackedCarousel.jsx
- src/components/PrototypeSection.jsx
- src/components/ContactForm.jsx
- src/components/ui/team-section-block-shadcnui.tsx

## 4) Lead capture and qualification flow

Lead flow (end-to-end):

1. User submits src/components/ContactForm.jsx.
2. Form is validated client-side via src/lib/leadSchema.js (Zod).
3. Payload is sent to /api/lead-submit.
4. functions/api/lead-submit.js validates again server-side and blocks honeypot bots.
5. Lead quality is scored by src/lib/leadClassifier.js.
6. Client writes full lead + classification metadata to Firestore leads collection.
7. UTM data is attached via src/lib/utm.js.

Why this design works:

- Double validation (client + server) reduces bad payloads.
- Lightweight scoring creates immediate sales priority.
- Firestore stores both raw input and qualification metadata for admin usage.

## 5) Admin dashboard flow

src/AdminApp.jsx responsibilities:

1. Firebase auth login (email/password).
2. Admin access check by:
   - VITE_ADMIN_EMAILS allowlist, or
   - Firebase custom claim admin=true.
3. Live lead feed from Firestore using onSnapshot.
4. Lead detail view, status changes, notes, and save back to Firestore.

Pipeline statuses currently used:

- new
- contacted
- qualified
- proposal-sent
- won
- lost

## 6) Build and deploy flow

Build command in package.json:

- vite build
- vite build --ssr src/entry-server.jsx --outDir dist/server
- node scripts/prerender.mjs

Prerender behavior:

- src/entry-server.jsx renders App to HTML string.
- scripts/prerender.mjs injects that HTML into dist/index.html root element.
- data-server-rendered attribute is added to support hydration in src/main.jsx.
- dist/server is removed after injection.

Deploy targets:

- Cloudflare Pages production/preview via Wrangler scripts.
- SPA fallback for route handling is defined in public/_redirects.

## 7) Data, content, and SEO assets

Data/content sources:

- src/content.js is the central content source for many sections.
- src/index.css defines most visual system tokens and section styles.

SEO assets:

- index.html has meta tags + JSON-LD schema blocks.
- public/robots.txt and public/sitemap.xml support crawl/indexing.
- public/blog and public/images/vs contain static SEO pages.

## 8) Safe deletions (high confidence)

These files/directories are currently not used by runtime code or are generated artifacts:

1. src/components/ui/container-scroll-demo.tsx
2. src/components/ui/team-section-demo.tsx
3. src/components/ui/demo.tsx
4. src/App.css
5. dist (generated build output; can always be regenerated)
6. .wrangler (local generated state/cache)
7. node_modules (dependency install folder; can be regenerated)

Security-sensitive cleanup:

8. mellowkraft-seo-683626e25846.json

Reason: this is a service-account credential file and should not remain in project root. Keep credentials outside repo and load from secure environment/secret storage.

## 9) Optional archive/move (only if you do not use them)

These are not runtime-critical, but may still hold planning/reference value:

1. COLORS.md
2. INDEX_LUXURY_RESEARCH.md
3. LUXURY_BRAND_COLOR_RESEARCH.md
4. LUXURY_COLOR_PALETTES.md
5. LUXURY_COLOR_PATTERNS_VISUAL.md
6. LUXURY_COLOR_QUICK_REFERENCE.md
7. LUXURY_COLOR_TOKENS.css
8. luxury_color_system.json
9. luxury-color-config.js

Recommendation: move them into a docs/archive folder instead of deleting if you may revisit brand palette research.

## 10) Files that need updates (priority order)

### Priority 1 (security and operational correctness)

1. mellowkraft-seo-683626e25846.json
   - Remove from project and rotate key if ever committed/shared.

2. firestore.rules
   - Confirm public create policy is intentional.
   - Consider stricter validation constraints server-side and in rules.

3. .env.example
   - Add clear notes for required vs optional vars.
   - Include admin setup expectations and local dev defaults.

### Priority 2 (content consistency and maintainability)

4. src/content.js
   - team export appears unused while team UI is defined in component-local data.
   - Either remove unused export or connect one single source of truth.

5. src/components/ui/team-section-block-shadcnui.tsx
   - Sync team profile data with src/content.js strategy (avoid duplicated team data).

6. README.md
   - Add architecture summary and mention master_idea.md as canonical technical map.

### Priority 3 (cleanup and repo hygiene)

7. scripts/gsc.mjs
   - If still used, document exact usage and required credentials path.
   - If not used, remove it.

8. public/sitemap.xml
   - It currently lists only homepage.
   - Add blog/static pages if they should be indexed.

## 11) Suggested immediate action plan

1. Delete the clearly unused files listed in section 8.
2. Remove and rotate the service account key immediately.
3. Unify team content source (content.js vs component-local constant).
4. Expand sitemap to include intended indexable pages.
5. Keep this file updated whenever architecture or deployment flow changes.

## 12) Current technical summary in one line

This is a conversion-focused marketing site with a structured lead qualification pipeline and lightweight internal CRM workflow, deployed on Cloudflare Pages and powered by Firebase for data and auth.