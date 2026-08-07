import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Post from '#models/post'
import { postValidator } from '#validators/post_validator'

export default class PostsController {
  async index({ view }: HttpContext) {
    const posts = await Post.query().orderBy('created_at', 'desc')
    return view.render('admin/posts/index', { posts })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/posts/form', { post: null })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(postValidator)

    const publishedAt = payload.publishedAt
      ? DateTime.fromISO(payload.publishedAt)
      : payload.status === 'published'
        ? DateTime.now()
        : null

    await Post.create({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: payload.body ?? null,
      status: payload.status,
      publishedAt,
    })

    return response.redirect('/admin/posts')
  }

  async edit({ params, view }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    return view.render('admin/posts/form', { post })
  }

  async update({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const payload = await request.validateUsing(postValidator)

    const publishedAt = payload.publishedAt
      ? DateTime.fromISO(payload.publishedAt)
      : payload.status === 'published'
        ? post.publishedAt ?? DateTime.now()
        : null

    post.merge({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: payload.body ?? null,
      status: payload.status,
      publishedAt,
    })

    await post.save()
    return response.redirect('/admin/posts')
  }

  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.redirect('/admin/posts')
  }
}
