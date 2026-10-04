import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { existsSync, readFileSync } from 'node:fs'

const githubRepository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const cnamePath = new URL('./public/CNAME', import.meta.url)
const cnameDomain = existsSync(cnamePath)
  ? readFileSync(cnamePath, 'utf8').trim()
  : ''
const customDomain = process.env.VITE_CUSTOM_DOMAIN?.trim() || cnameDomain
const base = customDomain
  ? '/'
  : process.env.GITHUB_ACTIONS === 'true' && githubRepository
    ? `/${githubRepository}/`
    : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
