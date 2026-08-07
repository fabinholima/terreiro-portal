import type { HttpContext } from '@adonisjs/core/http'
import SiteSetting from '#models/site_setting'
import { siteSettingValidator } from '#validators/site_setting'

const defaults = {
  siteName: 'Terreiro de Umbanda Oxóssi e João Boiadeiro',
  siteSubtitle: 'Fé, caridade, ancestralidade e acolhimento',
  footerText: 'Terreiro de Umbanda Oxóssi e João Boiadeiro — em atividade desde 1991.',
}

export default class SiteSettingsController {
  private async getSettings() {
    let settings = await SiteSetting.first()
    if (!settings) {
      settings = await SiteSetting.create(defaults)
    }
    return settings
  }

  async edit({ view }: HttpContext) {
    const settings = await this.getSettings()
    return view.render('admin/site_settings/form', { settings })
  }

  async update({ request, response, session }: HttpContext) {
    const settings = await this.getSettings()
    const payload = await request.validateUsing(siteSettingValidator)

    settings.merge({
      siteName: payload.siteName,
      siteSubtitle: payload.siteSubtitle ?? null,
      address: payload.address ?? null,
      city: payload.city ?? null,
      state: payload.state?.toUpperCase() ?? null,
      postalCode: payload.postalCode ?? null,
      phone: payload.phone ?? null,
      whatsapp: payload.whatsapp ?? null,
      email: payload.email ?? null,
      instagramUrl: payload.instagramUrl ?? null,
      facebookUrl: payload.facebookUrl ?? null,
      youtubeUrl: payload.youtubeUrl ?? null,
      mapsUrl: payload.mapsUrl ?? null,
      openingHours: payload.openingHours ?? null,
      footerText: payload.footerText ?? null,
    })
    await settings.save()

    session.flash('success', 'Configurações atualizadas com sucesso.')
    return response.redirect('/admin/site-settings')
  }
}
