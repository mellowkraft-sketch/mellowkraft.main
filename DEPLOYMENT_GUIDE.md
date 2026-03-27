# MellowKraft Deployment Guide - Cloudflare Pages via Wrangler

## Prerequisites on Your Local Machine

You need:
- **Node.js** (v16+) — Download from https://nodejs.org
- **npm** (comes with Node.js)
- **Git** (to clone/pull from GitHub)
- A **Cloudflare account** (new one: mellowkraft-sketch)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/mellowkraft-sketch/Mellow.main.git
cd Mellow.main
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`.

---

## Step 3: Verify Your Environment Variables

The `.env` file is already configured with:
- Firebase credentials for `mellow-kraft-main` project
- Admin email: `mellowkraft@protonmail.com`

Check that `.env` exists and has values (it won't be on GitHub, so verify locally).

---

## Step 4: Install Wrangler CLI

```bash
npm install -g wrangler
```

---

## Step 5: Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser. Log in with your **new Cloudflare account** (mellowkraft-sketch) and authorize.

---

## Step 6: Deploy to Cloudflare Pages

```bash
npm run pages:deploy
```

This runs:
1. `npm run build` — Builds your React app
2. `wrangler pages deploy dist` — Uploads to Cloudflare Pages

---

## Step 7: Get Your Live URL

After deployment, you'll see output like:
```
✓ Deployment complete!
✓ Visit https://mellowkraft-site.pages.dev
```

**That's your live site!** 🚀

---

## Post-Deployment Checklist

- [ ] Visit your live URL
- [ ] Check that the homepage loads
- [ ] Test the contact form (submit a test lead)
- [ ] Go to `/admin` and verify Firebase Auth login works
- [ ] Check Firestore in Firebase Console for the test lead

---

## Environment Variables in Cloudflare (Optional Setup)

If you want to manage env vars in Cloudflare Dashboard instead of `.env`:

1. Go to Cloudflare Dashboard → Pages → `mellowkraft-site` → Settings
2. Add these under "Environment variables":
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDOjcKlQjz7aVUnnBfMj2yUY_lXeCQChHE
   VITE_FIREBASE_AUTH_DOMAIN=mellow-kraft-main.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mellow-kraft-main
   VITE_FIREBASE_STORAGE_BUCKET=mellow-kraft-main.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=36398506042
   VITE_FIREBASE_APP_ID=1:36398506042:web:303643d6be7dd5f60b9503
   VITE_FIREBASE_MEASUREMENT_ID=G-B68377C3HF
   VITE_ADMIN_EMAILS=mellowkraft@protonmail.com
   ```

---

## Future Deployments

After code changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
npm run pages:deploy
```

Or use the GitHub-connected auto-deploy (see master_idea.md).

---

## Troubleshooting

**"wrangler: command not found"**
```bash
npm install -g wrangler
```

**Build fails**
```bash
npm install
npm run build
```

**Wrangler not authenticated**
```bash
wrangler logout
wrangler login
```

---

**Questions?** Check `master_idea.md` for full architecture details.
