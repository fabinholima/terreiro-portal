import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
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

    const featuredImagePath = await this.saveFeaturedImage(request)
    const imagePaths = await this.saveImages(request)

    await Post.create({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: payload.body ?? null,
      status: payload.status,
      publishedAt,
      featuredImagePath,
      imagePaths,
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

    const newFeaturedImagePath = await this.saveFeaturedImage(request)
    const newImagePaths = await this.saveImages(request)

    post.merge({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: payload.body ?? null,
      status: payload.status,
      publishedAt,
      featuredImagePath: newFeaturedImagePath ?? post.featuredImagePath,
      imagePaths: [...(post.imagePaths ?? []), ...newImagePaths],
    })

    await post.save()
    return response.redirect('/admin/posts')
  }

  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.redirect('/admin/posts')
  }

  private async saveFeaturedImage(request: HttpContext['request']) {
    const file = request.file('featuredImage', {
      size: '12mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!file) return null

    const safeName = this.fileName(file.clientName)
    await file.move(app.makePath('public/uploads/news'), { name: safeName })
    return `/uploads/news/${safeName}`
  }

  private async saveImages(request: HttpContext['request']) {
    const files = request.files('images', {
      size: '12mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    const paths: string[] = []
    for (const file of files) {
      const safeName = this.fileName(file.clientName)
      await file.move(app.makePath('public/uploads/news'), { name: safeName })
      paths.push(`/uploads/news/${safeName}`)
    }
    return paths
  }

  private fileName(clientName: string) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  }
}
