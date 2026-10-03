import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'
import Album from '#models/album'
import SocialAction from '#models/social_action'
import Post from '#models/post'
import Document from '#models/document'

export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    const now = DateTime.now()

    const [events, albums, actions, posts, documents, upcomingEvents] = await Promise.all([
      Event.query().count('* as total'),
      Album.query().count('* as total'),
      SocialAction.query().count('* as total'),
      Post.query().count('* as total'),
      Document.query().count('* as total'),
      Event.query()
        .where('starts_at', '>=', now.toSQL()!)
        .whereNot('status', 'cancelled')
        .orderBy('starts_at', 'asc')
        .limit(5),
    ])

    const counters = {
      events: Number(events[0].$extras.total),
      albums: Number(albums[0].$extras.total),
      actions: Number(actions[0].$extras.total),
      posts: Number(posts[0].$extras.total),
      documents: Number(documents[0].$extras.total),
    }

    return view.render('admin/dashboard', {
      user: auth.user,
      counters,
      upcomingEvents,
    })
  }
}
