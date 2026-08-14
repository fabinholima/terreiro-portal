import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Album from '#models/album'
import Photo from '#models/photo'
import { albumValidator } from '#validators/album'
import app from '@adonisjs/core/services/app'

export default class AlbumsController {
  async index({ view }: HttpContext) {
    const albums = await Album.query().withCount('photos').orderBy('created_at', 'desc')
    return view.render('admin/albums/index', { albums })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/albums/form', { album: null })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(albumValidator)
    const album = await Album.create({
      title: payload.title,
      slug: payload.slug,
      description: payload.description ?? null,
      eventDate: payload.eventDate ? DateTime.fromISO(payload.eventDate) : null,
      isPublic: request.input('isPublic') === 'true',
    })

    await this.savePhotos(album, request)
    return response.redirect(`/admin/albums/${album.id}/edit`)
  }

  async edit({ params, view }: HttpContext) {
    const album = await Album.query()
      .where('id', params.id)
      .preload('photos', (query) => query.orderBy('position'))
      .firstOrFail()

    return view.render('admin/albums/form', { album })
  }

  async update({ params, request, response }: HttpContext) {
    const album = await Album.findOrFail(params.id)
    const payload = await request.validateUsing(albumValidator)

    album.merge({
      title: payload.title,
      slug: payload.slug,
      description: payload.description ?? null,
      eventDate: payload.eventDate ? DateTime.fromISO(payload.eventDate) : null,
      isPublic: request.input('isPublic') === 'true',
    })

    await album.save()
    return response.redirect('/admin/albums')
  }

  async upload({ params, request, response }: HttpContext) {
    const album = await Album.findOrFail(params.id)
    await this.savePhotos(album, request)
    return response.redirect(`/admin/albums/${album.id}/edit`)
  }

  async publishAllPhotos({ params, response, session }: HttpContext) {
    const album = await Album.findOrFail(params.id)
    await Photo.query().where('album_id', album.id).update({ publication_authorized: true })
    session.flash('success', 'Todas as fotos do álbum foram autorizadas para publicação.')
    return response.redirect(`/admin/albums/${album.id}/edit`)
  }

  async updatePhoto({ params, request, response }: HttpContext) {
    const photo = await Photo.findOrFail(params.photoId)
    photo.merge({
      caption: request.input('caption') || null,
      altText: request.input('altText') || null,
      credit: request.input('credit') || null,
      publicationAuthorized: request.input('publicationAuthorized') === 'true',
      position: Number(request.input('position') || 0),
    })
    await photo.save()
    return response.redirect(`/admin/albums/${photo.albumId}/edit`)
  }

  async deletePhoto({ params, response }: HttpContext) {
    const photo = await Photo.findOrFail(params.photoId)
    const albumId = photo.albumId
    await photo.delete()
    return response.redirect(`/admin/albums/${albumId}/edit`)
  }

  async destroy({ params, response }: HttpContext) {
    const album = await Album.findOrFail(params.id)
    await album.delete()
    return response.redirect('/admin/albums')
  }

  private async savePhotos(album: Album, request: HttpContext['request']) {
    const files = request.files('photos', {
      size: '12mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let position = await Photo.query()
      .where('album_id', album.id)
      .count('* as total')
      .then((rows) => Number(rows[0].$extras.total))

    for (const file of files) {
      if (!file.isValid) continue

      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      await file.move(app.makePath('public/uploads/gallery'), { name: safeName })
      const path = `/uploads/gallery/${safeName}`

      await Photo.create({
        albumId: album.id,
        path,
        caption: null,
        altText: album.title,
        credit: null,
        publicationAuthorized: album.isPublic,
        position: position++,
      })

      if (!album.coverPath) {
        album.coverPath = path
        await album.save()
      }
    }
  }
}
