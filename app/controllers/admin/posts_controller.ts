import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
import Post from '#models/post'
import { postValidator } from '#validators/post_validator'

type ImageSettings = Record<string, { width?: number | null; height?: number | null }>

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
    const publishedAt = this.resolvePublishedAt(payload.status, payload.publishedDate, payload.publishedTime)
    const featuredImagePath = await this.saveFeaturedImage(request)
    const imagePaths = await this.saveImages(request)
    const imageSettings = this.settingsForNewImages(imagePaths, payload.contentImageWidth, payload.contentImageHeight)

    await Post.create({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: this.sanitizeRichText(payload.body ?? ''),
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
      imageSettings,
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
    const publishedAt = this.resolvePublishedAt(
      payload.status,
      payload.publishedDate,
      payload.publishedTime,
      post.publishedAt
    )

    const newFeaturedImagePath = await this.saveFeaturedImage(request)
    const newImagePaths = await this.saveImages(request)
    const currentImagePaths = this.normalizeImagePaths(post.imagePaths)
    const imageSettings = this.normalizeImageSettings(post.imageSettings)

    if (newFeaturedImagePath && post.featuredImagePath && newFeaturedImagePath !== post.featuredImagePath) {
      await this.deletePublicFile(post.featuredImagePath)
    }

    Object.assign(
      imageSettings,
      this.settingsForNewImages(newImagePaths, payload.contentImageWidth, payload.contentImageHeight)
    )

    post.merge({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary ?? null,
      body: this.sanitizeRichText(payload.body ?? ''),
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
      imageSettings,
    })

    await post.save()
    return response.redirect('/admin/posts')
  }

  async updateImageDimensions({ params, request, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const images = this.normalizeImagePaths(post.imagePaths)
    const index = Number(params.index)

    if (!Number.isInteger(index) || index < 0 || index >= images.length) {
      session.flash('error', 'Imagem inválida.')
      return response.redirect(`/admin/posts/${post.id}/edit`)
    }

    const width = this.optionalDimension(request.input('width'))
    const height = this.optionalDimension(request.input('height'))
    const imagePath = images[index]
    const settings = this.normalizeImageSettings(post.imageSettings)
    settings[imagePath] = { width, height }
    post.imageSettings = settings
    await post.save()

    session.flash('success', 'Dimensões da imagem atualizadas.')
    return response.redirect(`/admin/posts/${post.id}/edit`)
  }

  async replaceFeaturedImage({ params, request, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const file = request.file('featuredImage', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    if (!file) {
      session.flash('error', 'Selecione uma imagem para substituir a atual.')
      return response.redirect(`/admin/posts/${post.id}/edit`)
    }

    const newPath = await this.moveImage(file.clientName, file)
    if (post.featuredImagePath) await this.deletePublicFile(post.featuredImagePath)
    post.featuredImagePath = newPath
    await post.save()
    session.flash('success', 'Imagem de destaque substituída.')
    return response.redirect(`/admin/posts/${post.id}/edit`)
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

  async replaceImage({ params, request, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const images = this.normalizeImagePaths(post.imagePaths)
    const index = Number(params.index)
    const file = request.file('image', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })

    if (!Number.isInteger(index) || index < 0 || index >= images.length || !file) {
      session.flash('error', 'Não foi possível substituir a imagem selecionada.')
      return response.redirect(`/admin/posts/${post.id}/edit`)
    }

    const oldPath = images[index]
    const newPath = await this.moveImage(file.clientName, file)
    const settings = this.normalizeImageSettings(post.imageSettings)
    if (settings[oldPath]) {
      settings[newPath] = settings[oldPath]
      delete settings[oldPath]
    }
    images[index] = newPath
    post.imagePaths = images
    post.imageSettings = settings
    await post.save()
    if (oldPath) await this.deletePublicFile(oldPath)

    session.flash('success', 'Imagem anexa substituída.')
    return response.redirect(`/admin/posts/${post.id}/edit`)
  }

  async deleteImage({ params, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const images = this.normalizeImagePaths(post.imagePaths)
    const index = Number(params.index)

    if (Number.isInteger(index) && index >= 0 && index < images.length) {
      const [removed] = images.splice(index, 1)
      const settings = this.normalizeImageSettings(post.imageSettings)
      if (removed) {
        delete settings[removed]
        await this.deletePublicFile(removed)
      }
      post.imagePaths = images
      post.imageSettings = settings
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

  private resolvePublishedAt(
    status: 'draft' | 'published' | 'archived',
    date?: string,
    time?: string,
    current?: DateTime | null
  ) {
    if (date) {
      const parsed = DateTime.fromFormat(`${date} ${time || '00:00'}`, 'yyyy-LL-dd HH:mm')
      if (parsed.isValid) return parsed
    }
    if (status === 'published') return current?.isValid ? current : DateTime.now()
    return current?.isValid ? current : null
  }

  private optionalDimension(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return null
    return Math.min(3000, Math.max(100, Math.round(parsed)))
  }

  private settingsForNewImages(paths: string[], width?: number, height?: number): ImageSettings {
    const settings: ImageSettings = {}
    for (const path of paths) settings[path] = { width: width ?? null, height: height ?? null }
    return settings
  }

  private normalizeImageSettings(value: unknown): ImageSettings {
    if (value && typeof value === 'object' && !Array.isArray(value)) return { ...(value as ImageSettings) }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
      } catch {
        return {}
      }
    }
    return {}
  }

  private normalizeImagePaths(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
      } catch {}
      return [trimmed]
    }
    return []
  }

  private sanitizeRichText(value: string) {
    return value
      .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, '')
  }

  private async saveFeaturedImage(request: HttpContext['request']) {
    const file = request.file('featuredImage', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    if (!file) return null
    return this.moveImage(file.clientName, file)
  }

  private async saveImages(request: HttpContext['request']) {
    const files = request.files('images', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    const paths: string[] = []
    for (const file of files) paths.push(await this.moveImage(file.clientName, file))
    return paths
  }

  private async moveImage(clientName: string, file: any) {
    const safeName = this.fileName(clientName)
    await file.move(app.makePath('public/uploads/news'), { name: safeName })
    return `/uploads/news/${safeName}`
  }

  private async deletePublicFile(publicPath: string) {
    if (!publicPath.startsWith('/uploads/news/')) return
    try {
      await unlink(app.makePath('public', publicPath.replace(/^\//, '')))
    } catch {}
  }

  private fileName(clientName: string) {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  }
}
