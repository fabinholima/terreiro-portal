import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import SiteSetting from '#models/site_setting'
import env from '#start/env'

const pageTitles: Record<string, string> = {
  '/': 'Início', '/o-terreiro': 'O Terreiro', '/nossa-historia': 'Nossa História', '/umbanda': 'Umbanda', '/agenda': 'Agenda', '/galeria': 'Galeria', '/acoes-sociais': 'Ações Sociais', '/noticias': 'Notícias', '/documentos': 'Documentos Públicos', '/contato': 'Contato',
}

const defaultMenu = [
  { key:'about', label:'O Terreiro', href:'/o-terreiro', visible:true, order:1 },
  { key:'events', label:'Agenda', href:'/agenda', visible:true, order:2 },
  { key:'gallery', label:'Galeria', href:'/galeria', visible:true, order:3 },
  { key:'posts', label:'Notícias', href:'/noticias', visible:true, order:4 },
  { key:'social', label:'Ações sociais', href:'/acoes-sociais', visible:true, order:5 },
  { key:'documents', label:'Documentos', href:'/documentos', visible:true, order:6 },
  { key:'contact', label:'Contato', href:'/contato', visible:true, order:7 },
]

const fallbackSettings = {
  siteName:'Terreiro de Umbanda Oxóssi e João Boiadeiro', siteSubtitle:'Fé, caridade, ancestralidade e acolhimento', address:null, city:null, state:null, postalCode:null, phone:null, whatsapp:null, email:null, instagramUrl:null, facebookUrl:null, youtubeUrl:null, mapsUrl:null, openingHours:null,
  footerText:'Terreiro de Umbanda Oxóssi e João Boiadeiro — em atividade desde 1991.', homeEyebrow:'Institucional', homeTitle:'O Terreiro', homeSummary:'Casa de fé, caridade, ancestralidade e acolhimento.',
  missionTitle:'Nossa missão', missionText:'Promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade, oferecendo um espaço de acolhimento espiritual e convivência comunitária.', missionVisible:true,
  valuesTitle:'Nossos valores', valuesText:'Respeito às diferenças, valorização da ancestralidade, compromisso com a comunidade, responsabilidade religiosa, solidariedade e cuidado com as pessoas.', valuesVisible:true,
  trajectoryTitle:'Nossa trajetória', trajectoryText:'A casa está em atividade desde 1991 e, ao longo de sua trajetória, desenvolveu atividades religiosas, ações de caridade e iniciativas voltadas à comunidade.', trajectoryVisible:true, trajectoryButtonText:'Conheça nossa história', trajectoryButtonUrl:'/o-terreiro',
  contributionVisible:false, contributionTitle:'Contribua com a casa', contributionText:'Sua contribuição voluntária auxilia na manutenção das atividades religiosas, sociais e comunitárias do Terreiro.', pixKey:null, pixBeneficiary:null, pixQrCodePath:null,
  themePrimary:'#1E4620', themeDark:'#08351F', themeAccent:'#D6A23C', themeBackground:'#FFFDF9', themeText:'#223028', fontHeading:'Georgia', fontBody:'Inter', fontUi:'Inter', fontSizeBase:16, headingWeight:600, publicMenuConfig:null,
}

export default class SiteSettingsMiddleware {
  async handle({ view, request }: HttpContext, next: NextFn) {
    const settings = await SiteSetting.first()
    const siteSettings = settings ?? fallbackSettings
    let publicMenu = defaultMenu
    if (siteSettings.publicMenuConfig) {
      try {
        const parsed = JSON.parse(siteSettings.publicMenuConfig)
        if (Array.isArray(parsed)) publicMenu = parsed
      } catch {}
    }
    publicMenu = publicMenu.filter((item:any)=>item.visible !== false).sort((a:any,b:any)=>(a.order??0)-(b.order??0))

    const baseUrl = env.get('APP_URL').replace(/\/$/, '')
    const path = request.url().split('?')[0]
    const pageTitle = pageTitles[path]
    const description = siteSettings.siteSubtitle || `Portal institucional de ${siteSettings.siteName}.`

    view.share({
      siteSettings,
      publicMenu,
      seo:{ title:pageTitle ? `${pageTitle} | ${siteSettings.siteName}` : siteSettings.siteName, description, canonicalUrl:`${baseUrl}${path}`, imageUrl:null, type:'website', noindex:path.startsWith('/admin') || path === '/login' },
    })
    return next()
  }
}
