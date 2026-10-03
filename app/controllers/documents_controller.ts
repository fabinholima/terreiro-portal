import type { HttpContext } from '@adonisjs/core/http'
import Document from '#models/document'

export default class DocumentsController {
  async index({ view }: HttpContext) {
    const documents = await Document.query()
      .where('is_public', true)
      .orderBy('document_date', 'desc')
      .orderBy('created_at', 'desc')

    return view.render('pages/documents/index', { documents })
  }
}
