import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Post from '#models/post'

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
    const description = post.summary || post.body.replace(/\s+/g, ' ').slice(0, 160)

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

    return view.render('pages/posts/show', { post })
  }
}
