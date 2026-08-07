import type { HttpContext } from '@adonisjs/core/http'
import InstitutionalPage from '#models/institutional_page'
import { institutionalPageValidator } from '#validators/institutional_page'

export default class InstitutionalPagesController {
  async index({ view }: HttpContext) {
    const pages = await InstitutionalPage.query().orderBy('id', 'asc')
    return view.render('admin/institutional_pages/index', { pages })
  }

  async edit({ params, view }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    return view.render('admin/institutional_pages/form', { page })
  }

  async update({ params, request, response }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    const payload = await request.validateUsing(institutionalPageValidator)

    page.merge({
      title: payload.title,
      eyebrow: payload.eyebrow ?? null,
      summary: payload.summary ?? null,
      body: payload.body,
      isPublic: request.input('isPublic') === 'true',
    })
    await page.save()

    return response.redirect('/admin/institutional-pages')
  }
}
