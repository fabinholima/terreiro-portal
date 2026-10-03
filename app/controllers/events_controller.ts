import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class EventsController {
  async index({ view, request }: HttpContext) {
    const requestedMonth = String(request.input('mes') ?? '').trim()
    const parsedMonth = /^\d{4}-\d{2}$/.test(requestedMonth)
      ? DateTime.fromFormat(requestedMonth, 'yyyy-MM', { zone: 'local' })
      : DateTime.now()

    const month = parsedMonth.isValid ? parsedMonth.startOf('month') : DateTime.now().startOf('month')
    const monthStart = month.startOf('month')
    const monthEnd = month.endOf('month')
    const now = DateTime.now()

    const events = await Event.query()
      .where('is_public', true)
      .whereNot('status', 'cancelled')
      .where('starts_at', '>=', monthStart.toSQL()!)
      .where('starts_at', '<=', monthEnd.toSQL()!)
      .orderBy('starts_at', 'asc')

    for (const event of events) {
      const eventFinishedAt = event.endsAt ?? event.startsAt.endOf('day')
      const canAutoComplete = event.status === 'scheduled' || event.status === 'confirmed'

      event.$extras.publicStatus = canAutoComplete && eventFinishedAt < now
        ? 'completed'
        : event.status
    }

    const eventDays = new Set(events.map((event) => event.startsAt.toISODate()))

    const calendarStart = monthStart.startOf('week')
    const calendarDays = Array.from({ length: 42 }, (_, index) => {
      const date = calendarStart.plus({ days: index })
      return {
        iso: date.toISODate(),
        day: date.day,
        inMonth: date.month === month.month && date.year === month.year,
        hasEvent: eventDays.has(date.toISODate()),
        isToday: date.hasSame(now, 'day'),
      }
    })

    return view.render('pages/events/index', {
      events,
      month,
      monthLabel: month.setLocale('pt-BR').toFormat('LLLL yyyy'),
      previousMonth: month.minus({ months: 1 }).toFormat('yyyy-MM'),
      nextMonth: month.plus({ months: 1 }).toFormat('yyyy-MM'),
      calendarDays,
    })
  }
}
