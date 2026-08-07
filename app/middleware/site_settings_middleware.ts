import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import SiteSetting from '#models/site_setting'
import env from '#start/env'

const pageTitles: Record<string, string> = {
  '/': 'Início',
  '/o-terreiro': 'O Terreiro',
  '/nossa-historia': 'Nossa História',
  '/umbanda': 'Umbanda',
  '/agenda': 'Agenda',
  '/galeria': 'Galeria',
  '/acoes-sociais': 'Ações Sociais',
  '/noticias': 'Notícias',
  '/documentos': 'Documentos Públicos',
  '/contato': 'Contato',
}

const fallbackSettings = {
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

export default class SiteSettingsMiddleware {
  async handle({ view, request }: HttpContext, next: NextFn) {
    const settings = await SiteSetting.first()
    const siteSettings = settings ?? fallbackSettings

    const baseUrl = env.get('APP_URL').replace(/\/$/, '')
    const path = request.url().split('?')[0]
    const pageTitle = pageTitles[path]
    const description = siteSettings.siteSubtitle || `Portal institucional de ${siteSettings.siteName}.`

    view.share({
      siteSettings,
      seo: {
        title: pageTitle ? `${pageTitle} | ${siteSettings.siteName}` : siteSettings.siteName,
        description,
        canonicalUrl: `${baseUrl}${path}`,
        imageUrl: null,
        type: 'website',
        noindex: path.startsWith('/admin') || path === '/login',
      },
    })

    return next()
  }
}
