import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Post from '#models/post'
import InstitutionalPage from '#models/institutional_page'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default class SeoController {
  async robots({ response }: HttpContext) {
    const baseUrl = env.get('APP_URL').replace(/\/$/, '')

    response.header('Content-Type', 'text/plain; charset=utf-8')
    return response.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${baseUrl}/sitemap.xml\n`)
  }

  async sitemap({ response }: HttpContext) {
    const baseUrl = env.get('APP_URL').replace(/\/$/, '')

    const staticPaths = [
      '/',
      '/o-terreiro',
      '/nossa-historia',
      '/umbanda',
      '/agenda',
      '/galeria',
      '/acoes-sociais',
      '/noticias',
      '/documentos',
      '/contato',
    ]

    const institutionalPages = await InstitutionalPage.query().where('is_public', true)
    const hiddenInstitutionalSlugs = new Set(
      institutionalPages.filter((page) => !page.isPublic).map((page) => page.slug)
    )

    const paths = staticPaths.filter((path) => {
      const slug = path.replace(/^\//, '')
      return !slug || !hiddenInstitutionalSlugs.has(slug)
    })

    const posts = await Post.query()
      .where('status', 'published')
      .whereNotNull('published_at')
      .orderBy('published_at', 'desc')

    const entries: string[] = []

    for (const path of paths) {
      entries.push(`  <url>\n    <loc>${escapeXml(`${baseUrl}${path}`)}</loc>\n  </url>`)
    }

    for (const post of posts) {
      const lastmod = (post.updatedAt ?? post.publishedAt)?.toISODate()
      entries.push(
        `  <url>\n    <loc>${escapeXml(`${baseUrl}/noticias/${post.slug}`)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
      )
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`

    response.header('Content-Type', 'application/xml; charset=utf-8')
    return response.send(xml)
  }
}
