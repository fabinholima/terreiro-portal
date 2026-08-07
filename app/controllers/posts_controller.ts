import type { HttpContext } from '@adonisjs/core/http'
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

    return view.render('pages/posts/show', { post })
  }
}
