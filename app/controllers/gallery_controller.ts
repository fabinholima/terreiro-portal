import type { HttpContext } from '@adonisjs/core/http'
import Album from '#models/album'

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

  async show({ params, view }: HttpContext) {
    const album = await Album.query()
      .where('slug', params.slug)
      .where('is_public', true)
      .preload('photos', (query) => {
        query.where('publication_authorized', true).orderBy('position', 'asc')
      })
      .firstOrFail()

    return view.render('pages/gallery_show', { album })
  }
}
