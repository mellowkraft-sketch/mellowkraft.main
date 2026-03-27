import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

console.log('⚙  Pre-rendering index.html...')

const ssrModule = await import(`${root}/dist/server/entry-server.js`)
const html = ssrModule.render()

const template = readFileSync(`${root}/dist/index.html`, 'utf-8')

const result = template.replace(
  '<div id="root"></div>',
  `<div id="root" data-server-rendered="true">${html}</div>`,
)

if (result === template) {
  console.error('ERROR: Could not find <div id="root"></div> in dist/index.html — injection skipped.')
  process.exit(1)
}

writeFileSync(`${root}/dist/index.html`, result)

rmSync(`${root}/dist/server`, { recursive: true, force: true })

console.log('✓ Pre-rendering complete.')
