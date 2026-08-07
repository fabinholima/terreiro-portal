import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import SiteSetting from '#models/site_setting'

export default class SiteSettingsMiddleware {
  async handle({ view }: HttpContext, next: NextFn) {
    const settings = await SiteSetting.first()

    view.share({
      siteSettings: settings ?? {
        siteName: 'Terreiro de Umbanda Oxóssi e João Boiadeiro',
        siteSubtitle: 'Fé, caridade, ancestralidade e acolhimento',
        address: null,
        city: null,
        state: null,
        postalCode: null,
        phone: null,
        whatsapp: null,
        email: null,
        instagramUrl: null,
        facebookUrl: null,
        youtubeUrl: null,
        mapsUrl: null,
        openingHours: null,
        footerText: 'Terreiro de Umbanda Oxóssi e João Boiadeiro — em atividade desde 1991.',
      },
    })

    return next()
  }
}
