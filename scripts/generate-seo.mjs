import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('dist')
const repository = process.env.GITHUB_REPOSITORY?.split('/')
const githubPagesUrl =
  process.env.GITHUB_ACTIONS === 'true' && repository?.length === 2
    ? `https://${repository[0]}.github.io/${repository[1]}/`
    : undefined
const configuredSiteUrl = process.env.VITE_SITE_URL?.trim() || githubPagesUrl

if (!configuredSiteUrl) {
  console.warn(
    'SEO sitemap/canonical URLs were not generated. Set VITE_SITE_URL when the public website URL is known.',
  )
  process.exit(0)
}

const siteUrl = new URL(configuredSiteUrl)

if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password) {
  throw new Error('VITE_SITE_URL must be an HTTPS URL without embedded credentials.')
}

siteUrl.search = ''
siteUrl.hash = ''
if (!siteUrl.pathname.endsWith('/')) {
  siteUrl.pathname += '/'
}

const customDomain = process.env.VITE_CUSTOM_DOMAIN?.trim()
if (customDomain && siteUrl.hostname !== customDomain) {
  throw new Error('VITE_CUSTOM_DOMAIN must match the hostname in VITE_SITE_URL.')
}

const canonicalUrl = siteUrl.href
const logoUrl = new URL('images/lakshmi-logo.jpg', siteUrl).href
const indexPath = resolve(outputDirectory, 'index.html')
let html = await readFile(indexPath, 'utf8')

html = html.replace(
  '</head>',
  `    <link rel="canonical" href="${canonicalUrl}" />\n` +
    `    <meta property="og:url" content="${canonicalUrl}" />\n` +
    `    <meta property="og:image" content="${logoUrl}" />\n` +
    `    <meta name="twitter:card" content="summary_large_image" />\n` +
    '  </head>',
)

html = html.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
  (script) => {
    const structuredData = JSON.parse(
      script.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, ''),
    )
    structuredData.url = canonicalUrl
    structuredData.image = logoUrl
    return `<script type="application/ld+json">\n      ${JSON.stringify(structuredData)}\n    </script>`
  },
)

await writeFile(indexPath, html)

const xmlEscape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

await writeFile(
  resolve(outputDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${xmlEscape(canonicalUrl)}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `</urlset>\n`,
)

await writeFile(
  resolve(outputDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).href}\n`,
)

if (customDomain) {
  await writeFile(resolve(outputDirectory, 'CNAME'), `${customDomain}\n`)
}

console.info(`Generated canonical URL, sitemap, and robots.txt for ${canonicalUrl}`)
