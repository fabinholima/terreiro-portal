import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Post from '#models/post'

type ImageSettings = Record<string, { width?: number | null; height?: number | null }>

export default class PostsController {
  async index({ view }: HttpContext) {
    const posts = await Post.query()
      .where('status', 'published')
      .whereNotNull('published_at')
      .orderBy('published_at', 'desc')

    return view.render('pages/posts/index', { posts })
  }

  async show({ params, view }: HttpContext) {
    const post = await Post.query()
      .where('slug', params.slug)
      .where('status', 'published')
      .firstOrFail()

    const baseUrl = env.get('APP_URL').replace(/\/$/, '')
    const plainBody = (post.body ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const description = post.summary || plainBody.slice(0, 160)
    const settings = (post.imageSettings ?? {}) as ImageSettings
    const imageEntries = (post.imagePaths ?? []).map((path) => ({
      path,
      width: settings[path]?.width ?? null,
      height: settings[path]?.height ?? null,
    }))

    view.share({
      seo: {
        title: post.title,
        description,
        canonicalUrl: `${baseUrl}/noticias/${post.slug}`,
        imageUrl: post.featuredImagePath ? `${baseUrl}${post.featuredImagePath}` : null,
        type: 'article',
        noindex: false,
      },
    })

    return view.render('pages/posts/show', { post, imageEntries })
  }
}
