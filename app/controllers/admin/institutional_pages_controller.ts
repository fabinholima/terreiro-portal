import type { HttpContext } from '@adonisjs/core/http'
import InstitutionalPage from '#models/institutional_page'
import { institutionalPageValidator } from '#validators/institutional_page'

const protectedSlugs = new Set(['o-terreiro', 'nossa-historia', 'umbanda', 'contato'])

const defaults = [
  { slug:'o-terreiro', title:'O Terreiro', eyebrow:'Institucional', summary:'O Terreiro de Umbanda Oxóssi e João Boiadeiro é uma casa dedicada à fé, à caridade, ao acolhimento e à preservação da tradição umbandista.', body:'Nossa missão é promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade, oferecendo um espaço de acolhimento espiritual e convivência comunitária.' },
  { slug:'nossa-historia', title:'Nossa História', eyebrow:'Memória e ancestralidade', summary:'Uma trajetória construída desde 1991, marcada pela continuidade da fé, pelo cuidado com a comunidade e pela preservação da memória da casa.', body:'O Terreiro de Umbanda Oxóssi e João Boiadeiro está em atividade desde 1991.' },
  { slug:'umbanda', title:'Umbanda', eyebrow:'Tradição religiosa brasileira', summary:'A Umbanda é uma religião brasileira constituída por diferentes influências históricas e espirituais.', body:'No Terreiro de Umbanda Oxóssi e João Boiadeiro, a vivência religiosa é orientada pelo respeito às tradições da casa.' },
  { slug:'contato', title:'Contato', eyebrow:'Fale com o Terreiro', summary:'Consulte a agenda pública para conhecer as próximas atividades.', body:'Esta página poderá apresentar endereço público, telefone, WhatsApp, e-mail e orientações de atendimento.' },
]

function sanitizeRichText(html: string) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'').replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,'').replace(/\son\w+\s*=\s*(["']).*?\1/gi,'').replace(/\son\w+\s*=\s*[^\s>]+/gi,'').replace(/javascript\s*:/gi,'')
}

function publicUrlFor(slug: string) {
  return protectedSlugs.has(slug) ? `/${slug}` : `/pagina/${slug}`
}

export default class InstitutionalPagesController {
  private async ensureDefaults() {
    for (const item of defaults) await InstitutionalPage.firstOrCreate({ slug:item.slug }, { ...item, isPublic:true })
  }

  async index({ view }: HttpContext) {
    await this.ensureDefaults()
    const pages = await InstitutionalPage.query().orderBy('created_at','desc')
    return view.render('admin/institutional_pages/index', { pages, protectedSlugs:[...protectedSlugs] })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/institutional_pages/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(institutionalPageValidator)
    const slug = payload.slug!
    const exists = await InstitutionalPage.findBy('slug', slug)
    if (exists) {
      session.flash('error','Já existe uma página com este slug.')
      return response.redirect().back()
    }

    const page = await InstitutionalPage.create({
      title:payload.title,
      slug,
      eyebrow:payload.eyebrow??null,
      summary:payload.summary??null,
      body:sanitizeRichText(payload.body),
      isPublic:request.input('isPublic')==='true',
    })

    session.flash('success','Página criada com sucesso.')
    return response.redirect(`/admin/institutional-pages/${page.id}/edit`)
  }

  async edit({ params, view }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    return view.render('admin/institutional_pages/form', {
      page,
      isEdit: true,
      isProtected: protectedSlugs.has(page.slug),
      previewUrl: publicUrlFor(page.slug),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    const payload = await request.validateUsing(institutionalPageValidator)
    const newSlug = protectedSlugs.has(page.slug) ? page.slug : (payload.slug ?? page.slug)

    if (newSlug !== page.slug && await InstitutionalPage.query().where('slug',newSlug).whereNot('id',page.id).first()) {
      session.flash('error','Já existe uma página com este slug.')
      return response.redirect().back()
    }

    page.merge({
      title:payload.title,
      slug:newSlug,
      eyebrow:payload.eyebrow??null,
      summary:payload.summary??null,
      body:sanitizeRichText(payload.body),
      isPublic:request.input('isPublic')==='true',
    })
    await page.save()

    session.flash('success','Página atualizada com sucesso.')
    return response.redirect('/admin/institutional-pages')
  }

  async destroy({ params, response, session }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    if (protectedSlugs.has(page.slug)) {
      session.flash('error','Esta página faz parte da estrutura principal e não pode ser excluída.')
      return response.redirect('/admin/institutional-pages')
    }

    await page.delete()
    session.flash('success','Página excluída.')
    return response.redirect('/admin/institutional-pages')
  }
}
