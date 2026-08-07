import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class EventsController {
  async index({ view }: HttpContext) {
    const now = DateTime.now().toSQL()

    const events = await Event.query()
      .where('is_public', true)
      .whereNot('status', 'cancelled')
      .where('starts_at', '>=', now!)
      .orderBy('starts_at', 'asc')

    return view.render('pages/events/index', { events })
  }
}
