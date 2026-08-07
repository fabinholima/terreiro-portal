import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async about({ view }: HttpContext) {
    return view.render('pages/institutional/about')
  }

  async history({ view }: HttpContext) {
    return view.render('pages/institutional/history')
  }

  async umbanda({ view }: HttpContext) {
    return view.render('pages/institutional/umbanda')
  }

  async contact({ view }: HttpContext) {
    return view.render('pages/institutional/contact')
  }
}
