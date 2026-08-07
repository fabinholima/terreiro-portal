import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Event from '#models/event'
import Album from '#models/album'
import SocialAction from '#models/social_action'
import Post from '#models/post'

export default class HomeController {
  async index({ view }: HttpContext) {
    const now = DateTime.now().toSQL()

    const [events, posts, actions, albums] = await Promise.all([
      Event.query()
        .where('is_public', true)
        .whereNot('status', 'cancelled')
        .where('starts_at', '>=', now!)
        .orderBy('starts_at', 'asc')
        .limit(3),
      Post.query()
        .where('status', 'published')
        .whereNotNull('published_at')
        .orderBy('published_at', 'desc')
        .limit(3),
      SocialAction.query()
        .where('is_public', true)
        .whereIn('status', ['planned', 'active', 'permanent'])
        .orderBy('created_at', 'desc')
        .limit(3),
      Album.query()
        .where('is_public', true)
        .whereNotNull('cover_path')
        .orderBy('event_date', 'desc')
        .limit(4),
    ])

    return view.render('pages/home', { events, posts, actions, albums })
  }
}
