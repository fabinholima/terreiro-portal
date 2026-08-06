import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'
import { eventValidator } from '#validators/event'

export default class EventsController {
  async index({ view }: HttpContext) {
    const events = await Event.query().orderBy('starts_at', 'asc')
    return view.render('admin/events/index', { events })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/events/form', { event: null })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(eventValidator)
    await Event.create({
      ...payload,
      startsAt: DateTime.fromISO(payload.startsAt),
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
    })
    return response.redirect('/admin/events')
  }

  async edit({ params, view }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    return view.render('admin/events/form', { event })
  }

  async update({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(eventValidator)
    event.merge({
      ...payload,
      startsAt: DateTime.fromISO(payload.startsAt),
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
    })
    await event.save()
    return response.redirect('/admin/events')
  }

  async destroy({ params, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await event.delete()
    return response.redirect('/admin/events')
  }
}
