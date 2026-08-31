import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function getSiteUrl(): string {
  const raw =
    process.env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || ''

  if (!raw) return ''

  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`
  return withProtocol.replace(/\/$/, '')
}

function seoPlugin(): Plugin {
  const replaceSiteUrl = (html: string, siteUrl: string) =>
    html.replaceAll('%SITE_URL%', siteUrl)

  return {
    name: 'seo-meta',
    transformIndexHtml(html) {
      const siteUrl = getSiteUrl()

      if (siteUrl) {
        return replaceSiteUrl(html, `${siteUrl}/`)
      }

      return {
        html: html
          .replace(/\n\s*<link rel="canonical" href="%SITE_URL%" \/>/, '')
          .replace(/\n\s*<meta property="og:url" content="%SITE_URL%" \/>/, ''),
        tags: [
          {
            tag: 'script',
            injectTo: 'head',
            children: `(function(){var u=location.origin+'/';var l=document.createElement('link');l.rel='canonical';l.href=u;document.head.appendChild(l);var m=document.createElement('meta');m.setAttribute('property','og:url');m.content=u;document.head.appendChild(m);})();`,
          },
        ],
      }
    },
    generateBundle() {
      const siteUrl = getSiteUrl()
      const robotsLines = [
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: Yandex',
        'Allow: /',
        '',
      ]

      if (siteUrl) {
        robotsLines.push(`Sitemap: ${siteUrl}/sitemap.xml`, '')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
        })
      }

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsLines.join('\n'),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
})
