import type { HttpContext } from '@adonisjs/core/http'
import InstitutionalPage from '#models/institutional_page'
import { institutionalPageValidator } from '#validators/institutional_page'

const defaults = [
  {
    slug: 'o-terreiro',
    title: 'O Terreiro',
    eyebrow: 'Institucional',
    summary:
      'O Terreiro de Umbanda Oxóssi e João Boiadeiro é uma casa dedicada à fé, à caridade, ao acolhimento e à preservação da tradição umbandista.',
    body:
      'Nossa missão é promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade, oferecendo um espaço de acolhimento espiritual e convivência comunitária.\n\nEntre nossos valores estão o respeito às diferenças, a valorização da ancestralidade, o compromisso com a comunidade, a responsabilidade religiosa, a solidariedade e o cuidado com as pessoas.\n\nA casa está em atividade desde 1991 e, ao longo de sua trajetória, desenvolveu atividades religiosas, ações de caridade e iniciativas voltadas à comunidade.',
  },
  {
    slug: 'nossa-historia',
    title: 'Nossa História',
    eyebrow: 'Memória e ancestralidade',
    summary:
      'Uma trajetória construída desde 1991, marcada pela continuidade da fé, pelo cuidado com a comunidade e pela preservação da memória da casa.',
    body:
      'O Terreiro de Umbanda Oxóssi e João Boiadeiro está em atividade desde 1991. Ao longo dos anos, a casa consolidou sua prática religiosa e comunitária, mantendo vivas referências, saberes e vínculos construídos por seus integrantes.\n\nEste espaço institucional registra essa trajetória e será continuamente atualizado com documentos, fotografias, relatos e marcos importantes da história do Terreiro.',
  },
  {
    slug: 'umbanda',
    title: 'Umbanda',
    eyebrow: 'Tradição religiosa brasileira',
    summary:
      'A Umbanda é uma religião brasileira constituída por diferentes influências históricas e espirituais, marcada pela diversidade, pela ancestralidade e pela prática da caridade.',
    body:
      'No Terreiro de Umbanda Oxóssi e João Boiadeiro, a vivência religiosa é orientada pelo respeito às tradições da casa, à ancestralidade e às entidades espirituais cultuadas.\n\nA prática religiosa busca conciliar fé, responsabilidade, acolhimento e serviço à comunidade, preservando a identidade própria do Terreiro e respeitando a diversidade existente dentro da Umbanda.',
  },
  {
    slug: 'contato',
    title: 'Contato',
    eyebrow: 'Fale com o Terreiro',
    summary:
      'Consulte a agenda pública para conhecer as próximas atividades. Os canais oficiais de contato podem ser divulgados nesta página conforme decisão da administração da casa.',
    body:
      'Esta página poderá apresentar endereço público, telefone, WhatsApp, e-mail e orientações de atendimento.\n\nPor segurança e privacidade, publique apenas os canais que devem ser disponibilizados ao público.',
  },
]

export default class InstitutionalPagesController {
  async index({ view }: HttpContext) {
    for (const item of defaults) {
      await InstitutionalPage.firstOrCreate(
        { slug: item.slug },
        { ...item, isPublic: true }
      )
    }

    const pages = await InstitutionalPage.query().orderBy('id', 'asc')
    return view.render('admin/institutional_pages/index', { pages })
  }

  async edit({ params, view }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    return view.render('admin/institutional_pages/form', { page })
  }

  async update({ params, request, response }: HttpContext) {
    const page = await InstitutionalPage.findOrFail(params.id)
    const payload = await request.validateUsing(institutionalPageValidator)

    page.merge({
      title: payload.title,
      eyebrow: payload.eyebrow ?? null,
      summary: payload.summary ?? null,
      body: payload.body,
      isPublic: request.input('isPublic') === 'true',
    })
    await page.save()

    return response.redirect('/admin/institutional-pages')
  }
}
