import type { HttpContext } from '@adonisjs/core/http'
import SiteSetting from '#models/site_setting'
import { siteSettingValidator } from '#validators/site_setting'

const defaults = {
  siteName: 'Terreiro de Umbanda Oxóssi e João Boiadeiro',
  siteSubtitle: 'Fé, caridade, ancestralidade e acolhimento',
  footerText: 'Terreiro de Umbanda Oxóssi e João Boiadeiro — em atividade desde 1991.',
  homeEyebrow: 'Institucional',
  homeTitle: 'O Terreiro',
  homeSummary: 'Casa de fé, caridade, ancestralidade e acolhimento.',
  missionTitle: 'Nossa missão',
  missionText: 'Promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade, oferecendo um espaço de acolhimento espiritual e convivência comunitária.',
  missionVisible: true,
  valuesTitle: 'Nossos valores',
  valuesText: 'Respeito às diferenças, valorização da ancestralidade, compromisso com a comunidade, responsabilidade religiosa, solidariedade e cuidado com as pessoas.',
  valuesVisible: true,
  trajectoryTitle: 'Nossa trajetória',
  trajectoryText: 'A casa está em atividade desde 1991 e, ao longo de sua trajetória, desenvolveu atividades religiosas, ações de caridade e iniciativas voltadas à comunidade.',
  trajectoryVisible: true,
  trajectoryButtonText: 'Conheça nossa história',
  trajectoryButtonUrl: '/o-terreiro',
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
      homeEyebrow: payload.homeEyebrow ?? defaults.homeEyebrow,
      homeTitle: payload.homeTitle ?? defaults.homeTitle,
      homeSummary: payload.homeSummary ?? defaults.homeSummary,
      missionTitle: payload.missionTitle ?? defaults.missionTitle,
      missionText: payload.missionText ?? defaults.missionText,
      missionVisible: payload.missionVisible ?? false,
      valuesTitle: payload.valuesTitle ?? defaults.valuesTitle,
      valuesText: payload.valuesText ?? defaults.valuesText,
      valuesVisible: payload.valuesVisible ?? false,
      trajectoryTitle: payload.trajectoryTitle ?? defaults.trajectoryTitle,
      trajectoryText: payload.trajectoryText ?? defaults.trajectoryText,
      trajectoryVisible: payload.trajectoryVisible ?? false,
      trajectoryButtonText: payload.trajectoryButtonText ?? defaults.trajectoryButtonText,
      trajectoryButtonUrl: payload.trajectoryButtonUrl ?? defaults.trajectoryButtonUrl,
    })
    await settings.save()

    session.flash('success', 'Configurações atualizadas com sucesso.')
    return response.redirect('/admin/site-settings')
  }
}
