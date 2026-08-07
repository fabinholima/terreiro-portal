import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
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
      featuredImageWidth: payload.featuredImageWidth ?? null,
      featuredImageHeight: payload.featuredImageHeight ?? null,
      featuredImageFit: payload.featuredImageFit ?? 'contain',
      imagePaths,
      imageDisplaySize: payload.imageDisplaySize ?? 'large',
      contentImageWidth: payload.contentImageWidth ?? null,
      contentImageHeight: payload.contentImageHeight ?? null,
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
    const currentImagePaths = this.normalizeImagePaths(post.imagePaths)

    if (newFeaturedImagePath && post.featuredImagePath && newFeaturedImagePath !== post.featuredImagePath) {
      await this.deletePublicFile(post.featuredImagePath)
    }

    post.merge({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: payload.body ?? null,
      status: payload.status,
      publishedAt,
      featuredImagePath: newFeaturedImagePath ?? post.featuredImagePath,
      featuredImageWidth: payload.featuredImageWidth ?? null,
      featuredImageHeight: payload.featuredImageHeight ?? null,
      featuredImageFit: payload.featuredImageFit ?? 'contain',
      imagePaths: [...currentImagePaths, ...newImagePaths],
      imageDisplaySize: payload.imageDisplaySize ?? post.imageDisplaySize ?? 'large',
      contentImageWidth: payload.contentImageWidth ?? null,
      contentImageHeight: payload.contentImageHeight ?? null,
    })

    await post.save()
    return response.redirect('/admin/posts')
  }

  async deleteFeaturedImage({ params, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    if (post.featuredImagePath) {
      await this.deletePublicFile(post.featuredImagePath)
      post.featuredImagePath = null
      await post.save()
    }
    session.flash('success', 'Imagem de destaque excluída.')
    return response.redirect(`/admin/posts/${post.id}/edit`)
  }

  async deleteImage({ params, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const images = this.normalizeImagePaths(post.imagePaths)
    const index = Number(params.index)

    if (Number.isInteger(index) && index >= 0 && index < images.length) {
      const [removed] = images.splice(index, 1)
      if (removed) await this.deletePublicFile(removed)
      post.imagePaths = images
      await post.save()
      session.flash('success', 'Imagem anexa excluída.')
    }

    return response.redirect(`/admin/posts/${post.id}/edit`)
  }

  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    if (post.featuredImagePath) await this.deletePublicFile(post.featuredImagePath)
    for (const image of this.normalizeImagePaths(post.imagePaths)) await this.deletePublicFile(image)
    await post.delete()
    return response.redirect('/admin/posts')
  }

  private normalizeImagePaths(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []

      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
        }
      } catch {
        // Legacy rows may contain a single image path instead of JSON.
      }

      return [trimmed]
    }

    return []
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

  private async deletePublicFile(publicPath: string) {
    if (!publicPath.startsWith('/uploads/news/')) return
    try {
      await unlink(app.makePath('public', publicPath.replace(/^\//, '')))
    } catch {
      // The database reference can still be removed even if the physical file is already missing.
    }
  }

  private fileName(clientName: string) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  }
}
