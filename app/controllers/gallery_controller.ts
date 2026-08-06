import type { HttpContext } from '@adonisjs/core/http'
import Album from '#models/album'

export default class GalleryController {
  async index({ view }: HttpContext) {
    const albums = await Album.query()
      .where('is_public', true)
      .preload('photos', (query) => {
        query.where('publication_authorized', true).orderBy('position', 'asc')
      })
      .orderBy('event_date', 'desc')

    return view.render('pages/gallery', { albums })
  }
}
