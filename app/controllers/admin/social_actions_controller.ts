import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
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
    await SocialAction.create({
      ...payload,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
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
    action.merge({
      ...payload,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
    })
    await action.save()
    return response.redirect('/admin/social-actions')
  }

  async destroy({ params, response }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    await action.delete()
    return response.redirect('/admin/social-actions')
  }
}
