import type { HttpContext } from '@adonisjs/core/http'
import InstitutionalPage from '#models/institutional_page'

const defaults: Record<string, { title:string; eyebrow:string; summary:string; body:string }> = {
  'o-terreiro':{ title:'O Terreiro',eyebrow:'Institucional',summary:'O Terreiro de Umbanda Oxóssi e João Boiadeiro é uma casa dedicada à fé, à caridade, ao acolhimento e à preservação da tradição umbandista.',body:'Nossa missão é promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade.' },
  'nossa-historia':{ title:'Nossa História',eyebrow:'Memória e ancestralidade',summary:'Uma trajetória construída desde 1991.',body:'O Terreiro de Umbanda Oxóssi e João Boiadeiro está em atividade desde 1991.' },
  umbanda:{ title:'Umbanda',eyebrow:'Tradição religiosa brasileira',summary:'A Umbanda é uma religião brasileira marcada pela diversidade, ancestralidade e caridade.',body:'A vivência religiosa é orientada pelo respeito às tradições da casa.' },
  contato:{ title:'Contato',eyebrow:'Fale com o Terreiro',summary:'Consulte a agenda pública para conhecer as próximas atividades.',body:'Utilize os canais oficiais e as orientações de atendimento.' },
}

export default class PagesController {
  private async renderPage(slug:string,{ view,response }:HttpContext) {
    let page = await InstitutionalPage.findBy('slug',slug)
    if (!page && defaults[slug]) page = await InstitutionalPage.create({ slug,title:defaults[slug].title,eyebrow:defaults[slug].eyebrow,summary:defaults[slug].summary,body:defaults[slug].body,isPublic:true })
    if (!page || !page.isPublic) return response.notFound('Página não disponível')
    return view.render('pages/institutional/page',{ page })
  }
  async about(ctx:HttpContext){ return this.renderPage('o-terreiro',ctx) }
  async history(ctx:HttpContext){ return this.renderPage('nossa-historia',ctx) }
  async umbanda(ctx:HttpContext){ return this.renderPage('umbanda',ctx) }
  async contact(ctx:HttpContext){ return this.renderPage('contato',ctx) }
  async custom({ params,...rest }:HttpContext){ return this.renderPage(params.slug,{ params,...rest } as HttpContext) }
}
