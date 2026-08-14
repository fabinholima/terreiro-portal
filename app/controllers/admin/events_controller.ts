import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
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

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(eventValidator)
    const startsAt = this.combineDateTime(payload.startDate, payload.startTime)
    const endsAt = payload.endDate ? this.combineDateTime(payload.endDate, payload.endTime ?? '00:00') : null

    if (!startsAt.isValid || (endsAt && !endsAt.isValid)) {
      session.flash('error', 'Data ou hora inválida. Use o formato de 24 horas HH:mm.')
      return response.redirect('/admin/events/create')
    }

    const imagePath = await this.saveImage(request)
    const slug = await this.uniqueSlug(payload.slug)

    await Event.create({
      title: payload.title,
      slug,
      description: payload.description ?? null,
      category: payload.category ?? null,
      startsAt,
      endsAt,
      location: payload.location ?? null,
      imagePath,
      status: payload.status,
      isPublic: payload.isPublic ?? false,
    })

    session.flash('success', 'Evento cadastrado com sucesso.')
    return response.redirect('/admin/events')
  }

  async edit({ params, view }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    return view.render('admin/events/form', { event })
  }

  async update({ params, request, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(eventValidator)
    const startsAt = this.combineDateTime(payload.startDate, payload.startTime)
    const endsAt = payload.endDate ? this.combineDateTime(payload.endDate, payload.endTime ?? '00:00') : null

    if (!startsAt.isValid || (endsAt && !endsAt.isValid)) {
      session.flash('error', 'Data ou hora inválida. Use o formato de 24 horas HH:mm.')
      return response.redirect(`/admin/events/${event.id}/edit`)
    }

    const newImagePath = await this.saveImage(request)
    if (newImagePath && event.imagePath) await this.deleteImage(event.imagePath)

    const slug = await this.uniqueSlug(payload.slug, event.id)

    event.merge({
      title: payload.title,
      slug,
      description: payload.description ?? null,
      category: payload.category ?? null,
      startsAt,
      endsAt,
      location: payload.location ?? null,
      imagePath: newImagePath ?? event.imagePath,
      status: payload.status,
      isPublic: payload.isPublic ?? false,
    })
    await event.save()

    session.flash('success', 'Evento atualizado com sucesso.')
    return response.redirect('/admin/events')
  }

  async destroy({ params, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    if (event.imagePath) await this.deleteImage(event.imagePath)
    await event.delete()
    return response.redirect('/admin/events')
  }

  private combineDateTime(date: string, time: string) {
    return DateTime.fromFormat(`${date} ${time}`, 'yyyy-LL-dd HH:mm')
  }

  private async uniqueSlug(requestedSlug: string, ignoreId?: number) {
    const baseSlug = requestedSlug.trim().toLowerCase()
    let candidate = baseSlug
    let suffix = 2

    while (true) {
      const query = Event.query().where('slug', candidate)
      if (ignoreId) query.whereNot('id', ignoreId)
      const existing = await query.first()
      if (!existing) return candidate
      candidate = `${baseSlug}-${suffix}`
      suffix += 1
    }
  }

  private async saveImage(request: HttpContext['request']) {
    const file = request.file('image', {
      size: '12mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })
    if (!file) return null

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    await file.move(app.makePath('public/uploads/events'), { name: safeName })
    return `/uploads/events/${safeName}`
  }

  private async deleteImage(publicPath: string) {
    if (!publicPath.startsWith('/uploads/events/')) return
    try {
      await unlink(app.makePath('public', publicPath.replace(/^\//, '')))
    } catch {
      // Ignore missing files; the database record can still be updated/deleted.
    }
  }
}
