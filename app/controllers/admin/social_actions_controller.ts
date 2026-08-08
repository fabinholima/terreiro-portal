import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
import SocialAction from '#models/social_action'
import { socialActionValidator } from '#validators/social_action'

export default class SocialActionsController {
  async index({ view }: HttpContext) {
    const actions = await SocialAction.query().orderBy('created_at', 'desc')
    return view.render('admin/social_actions/index', { actions })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/social_actions/form', { action: null })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(socialActionValidator)
    const imagePath = await this.saveImage(request)

    await SocialAction.create({
      ...payload,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
      imagePath,
    })

    return response.redirect('/admin/social-actions')
  }

  async edit({ params, view }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    return view.render('admin/social_actions/form', { action })
  }

  async update({ params, request, response }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    const payload = await request.validateUsing(socialActionValidator)
    const newImagePath = await this.saveImage(request)

    if (newImagePath && action.imagePath && newImagePath !== action.imagePath) {
      await this.deletePublicFile(action.imagePath)
    }

    action.merge({
      ...payload,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
      imagePath: newImagePath ?? action.imagePath,
    })
    await action.save()
    return response.redirect('/admin/social-actions')
  }

  async destroy({ params, response }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    if (action.imagePath) await this.deletePublicFile(action.imagePath)
    await action.delete()
    return response.redirect('/admin/social-actions')
  }

  private async saveImage(request: HttpContext['request']) {
    const file = request.file('image', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    if (!file) return null

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    await file.move(app.makePath('public/uploads/social-actions'), { name: safeName })
    return `/uploads/social-actions/${safeName}`
  }

  private async deletePublicFile(publicPath: string) {
    if (!publicPath.startsWith('/uploads/social-actions/')) return
    try {
      await unlink(app.makePath('public', publicPath.replace(/^\//, '')))
    } catch {}
  }
}
