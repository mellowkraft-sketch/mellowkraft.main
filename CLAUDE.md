# MellowKraft Development Guidelines

## Critical Rules - READ BEFORE ANY WORK

### Deployment & GitHub
- **NEVER deploy through GitHub Actions or any GitHub-based automation**
- **ALWAYS use `wrangler deploy` for production deployments**
- GitHub is for code backup and version control ONLY
- Any deployment must be done locally via Wrangler CLI
- Verify deployment manually before confirming completion

### How to Work With Me
- **BEFORE starting any task, ask me extensive clarifying questions**
- Don't assume intent - ask about:
  - What specifically needs to change
  - Why this change is needed
  - What the success criteria are
  - Any constraints or edge cases
  - How this fits into broader goals
- Only proceed with implementation after I've answered your questions
- This prevents misaligned work and wasted effort

## Architecture & Stack

### Core Technologies
- Frontend: React (built with Vite)
- Backend: Cloudflare Workers (Wrangler)
- Database: Firebase Realtime Database
- Hosting: Cloudflare Pages (frontend) + Cloudflare Workers (API)
- Deployment Tool: Wrangler CLI

### Project Structure
```
mellowkraft.com/
├── src/
│   ├── components/     (React components)
│   ├── pages/          (Page components)
│   ├── lib/            (Utilities & helpers)
│   └── ...
├── wrangler.toml       (Cloudflare Worker config)
├── package.json        (Dependencies)
└── [other config files]
```

## Deployment Process
1. **Local Testing**: Test changes locally with `npm run dev`
2. **Commit & Push**: Commit to git and push to GitHub (backup only)
3. **Deploy**: Run `wrangler deploy` from local machine
4. **Verify**: Check deployment at production URL
5. **Never** rely on CI/CD for deployments

## Code Conventions

### File Naming
- Components: PascalCase (`Button.jsx`, `UserProfile.jsx`)
- Utilities: camelCase (`formatDate.js`, `apiClient.js`)
- Styles: Match component name or use camelCase

### Component Structure
- Functional components with hooks
- Props should be well-documented
- Keep components focused and reusable

### Commits
- Clear, descriptive commit messages
- Include context about why changes were made
- Reference issues/tasks when applicable

## What NOT to Do
- ❌ Create GitHub Actions for deployments
- ❌ Push to main expecting automated deploys
- ❌ Deploy without testing locally first
- ❌ Make assumptions about requirements - ask first
- ❌ Proceed with vague instructions
- ❌ Skip the questioning phase

## Testing & Quality
- Run local tests before committing: `npm run test` (if configured)
- Test locally with `npm run dev` before deployment
- Manual verification on production URL after `wrangler deploy`

## Common Commands
```bash
# Development
npm run dev              # Local dev server
npm install             # Install dependencies

# Deployment
wrangler deploy         # Deploy to production (ONLY way)
wrangler dev            # Test Worker locally

# Git (backup only)
git add .
git commit -m "message"
git push origin main    # Backup to GitHub
```

## Questions I'll Ask You
For ANY request, expect me to ask:
1. **What specifically** are you trying to accomplish?
2. **Why** do you need this change?
3. **Where** does this fit in the project?
4. **How** should it work? (expected behavior)
5. **Who** will use this / what's the impact?
6. **When** does it need to be done?
7. **Are there constraints** I should know about?
8. **How will you know** it's working correctly?

---

**Last Updated**: 2026-03-27
