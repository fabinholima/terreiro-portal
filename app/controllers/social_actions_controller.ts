import type { HttpContext } from '@adonisjs/core/http'
import SocialAction from '#models/social_action'

export default class SocialActionsController {
  async index({ view }: HttpContext) {
    const actions = await SocialAction.query()
      .where('is_public', true)
      .whereNot('status', 'cancelled')
      .orderBy('created_at', 'desc')

    return view.render('pages/social_actions', { actions })
  }
}
