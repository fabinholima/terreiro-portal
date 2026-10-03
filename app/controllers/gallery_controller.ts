import type { HttpContext } from '@adonisjs/core/http'
import Album from '#models/album'
import GalleryComment from '#models/gallery_comment'

export default class GalleryController {
  async index({ request, view }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const albums = await Album.query()
      .where('is_public', true)
      .preload('photos', (query) => {
        query.where('publication_authorized', true).orderBy('position', 'asc')
      })
      .orderBy('event_date', 'desc')
      .paginate(page, 9)

    return view.render('pages/gallery', { albums, pagination: albums.getMeta() })
  }

  async comment({ params, request, response }: HttpContext) {
    const album = await Album.query().where('slug', params.slug).where('is_public', true).firstOrFail()
    const { name, email, body } = request.only(['name', 'email', 'body'])
    if (!name?.trim() || !email?.trim() || !body?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return response.badRequest({ message: 'Informe nome, e-mail válido e comentário.' })
    }
    await GalleryComment.create({ albumId: album.id, name: name.trim(), email: email.trim().toLowerCase(), body: body.trim(), isApproved: true })
    return response.redirect(`/galeria/${album.slug}#comments`)
  }

  async show({ params, view }: HttpContext) {
    const album = await Album.query()
      .where('slug', params.slug)
      .where('is_public', true)
      .preload('photos', (query) => {
        query.where('publication_authorized', true).orderBy('position', 'asc')
      })
      .preload('comments', (query) => {
        query.where('is_approved', true).orderBy('created_at', 'desc')
      })
      .firstOrFail()

    return view.render('pages/gallery_show', { album })
  }
}
