/**
 * Google Search Console helper script.
 * - Verifies the site is registered
 * - Submits the sitemap
 * - Runs URL inspection on the homepage
 *
 * Usage: node scripts/gsc.mjs
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSign } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const SITE_URL = 'sc-domain:mellowkraft.com'
const SITEMAP_URL = 'https://mellowkraft.com/sitemap.xml'

const credPath = resolve(root, 'mellowkraft-seo-683626e25846.json')
const credentials = JSON.parse(readFileSync(credPath, 'utf-8'))

// Fetch real time from Google to work around local clock skew
async function getRealUnixTime() {
  const res = await fetch('https://www.googleapis.com/discovery/v1/apis')
  const dateHeader = res.headers.get('date')
  if (dateHeader) return Math.floor(new Date(dateHeader).getTime() / 1000)
  return Math.floor(Date.now() / 1000)
}

function base64url(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj)
  return Buffer.from(str).toString('base64url')
}

function signJwt(header, payload, privateKey) {
  const data = `${base64url(header)}.${base64url(payload)}`
  const sign = createSign('RSA-SHA256')
  sign.update(data)
  const sig = sign.sign(privateKey, 'base64url')
  return `${data}.${sig}`
}

async function getAccessToken() {
  const now = await getRealUnixTime()
  const jwt = signJwt(
    { alg: 'RS256', typ: 'JWT' },
    {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    credentials.private_key,
  )

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`)
  return data.access_token
}

async function request(method, url, body) {
  const token = await getAccessToken()

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, ok: res.ok, body: json }
}

// ── 1. List verified sites ────────────────────────────────────────────────────
console.log('\n── Verified sites in this GSC account ──')
const sitesRes = await request('GET', 'https://www.googleapis.com/webmasters/v3/sites')

if (!sitesRes.ok) {
  console.error('Failed to fetch sites:', sitesRes.body)
  console.error('\nMake sure you added the service account as an OWNER in GSC:')
  console.error('GSC → Settings → Users and permissions → Add user')
  console.error(`Email: ${credentials.client_email}`)
  process.exit(1)
}

const sites = sitesRes.body.siteEntry || []
if (sites.length === 0) {
  console.log('No sites found. The service account has no access yet.')
  console.log(`\nAdd this email as Owner in GSC → Settings → Users and permissions:`)
  console.log(`  ${credentials.client_email}`)
  process.exit(1)
}

sites.forEach(s => console.log(` • ${s.siteUrl}  [${s.permissionLevel}]`))

const hasSite = sites.some(s => s.siteUrl === SITE_URL)

if (!hasSite) {
  console.log(`\n⚠  ${SITE_URL} is not in this account yet.`)
  console.log('Add it in GSC → Add property, verify ownership, then re-run this script.')
  process.exit(1)
}

// ── 2. Submit sitemap ─────────────────────────────────────────────────────────
console.log('\n── Submitting sitemap ──')
const sitemapRes = await request(
  'PUT',
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`
)

if (sitemapRes.ok || sitemapRes.status === 204) {
  console.log(`✓ Sitemap submitted: ${SITEMAP_URL}`)
} else {
  console.error('Sitemap submission failed:', sitemapRes.body)
}

// ── 3. Check sitemap status ───────────────────────────────────────────────────
console.log('\n── Sitemap status ──')
const sitemapStatusRes = await request(
  'GET',
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`
)

if (sitemapStatusRes.ok) {
  const s = sitemapStatusRes.body
  console.log(` Last submitted : ${s.lastSubmitted || 'just now'}`)
  console.log(` Last downloaded: ${s.lastDownloaded || 'pending'}`)
  console.log(` Warnings       : ${s.warnings || 0}`)
  console.log(` Errors         : ${s.errors || 0}`)
} else {
  console.log('Sitemap status not available yet — Google will process it shortly.')
}

console.log('\n✓ Done. Google will crawl mellowkraft.com within the next 24–48 hours.')
console.log('  Check GSC → Coverage in a few days to see indexed pages.\n')
