import type { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'
import MenuItem from '#models/menu_item'
import InstitutionalPage from '#models/institutional_page'

const defaults = [
  ['O Terreiro','/o-terreiro'],['Agenda','/agenda'],['Galeria','/galeria'],['Notícias','/noticias'],['Ações sociais','/acoes-sociais'],['Documentos','/documentos'],['Contato','/contato'],
] as const

export default class MenusController {
  private async getMainMenu() {
    let menu = await Menu.findBy('location','main')
    if (!menu) {
      menu = await Menu.create({ name:'Menu principal', location:'main', isActive:true })
      for (let i=0;i<defaults.length;i++) await MenuItem.create({ menuId:menu.id, parentId:null, label:defaults[i][0], type:'url', pageId:null, url:defaults[i][1], position:i+1, isVisible:true, openNewTab:false })
    }
    return menu
  }

  async index({ view }: HttpContext) {
    const menu = await this.getMainMenu()
    const items = await MenuItem.query().where('menu_id',menu.id).preload('page').orderBy('position','asc').orderBy('id','asc')
    const pages = await InstitutionalPage.query().orderBy('title','asc')
    const roots = items.filter((item)=>!item.parentId)
    return view.render('admin/menus/index',{ menu,items,pages,roots })
  }

  async storeItem({ request,response,session }: HttpContext) {
    const menu = await this.getMainMenu()
    const type = request.input('type') === 'page' ? 'page' : 'url'
    const label = String(request.input('label')||'').trim()
    if (!label) { session.flash('error','Informe o nome do item do menu.'); return response.redirect().back() }
    const parentId = request.input('parentId') ? Number(request.input('parentId')) : null
    const pageId = type==='page' && request.input('pageId') ? Number(request.input('pageId')) : null
    const url = type==='url' ? String(request.input('url')||'').trim() : null
    if (type==='page' && !pageId) { session.flash('error','Selecione uma página.'); return response.redirect().back() }
    if (type==='url' && !url) { session.flash('error','Informe a URL do item.'); return response.redirect().back() }
    await MenuItem.create({ menuId:menu.id,parentId,label:label.slice(0,80),type,pageId,url,position:Number(request.input('position')||0),isVisible:request.input('isVisible')==='true',openNewTab:request.input('openNewTab')==='true' })
    session.flash('success','Item adicionado ao menu.'); return response.redirect('/admin/menus')
  }

  async updateItem({ params,request,response,session }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    const type = request.input('type') === 'page' ? 'page' : 'url'
    const parentId = request.input('parentId') ? Number(request.input('parentId')) : null
    item.merge({ label:String(request.input('label')||item.label).trim().slice(0,80), type, pageId:type==='page'&&request.input('pageId')?Number(request.input('pageId')):null, url:type==='url'?String(request.input('url')||'').trim():null, parentId:parentId===item.id?null:parentId, position:Number(request.input('position')||0), isVisible:request.input('isVisible')==='true', openNewTab:request.input('openNewTab')==='true' })
    await item.save(); session.flash('success','Item do menu atualizado.'); return response.redirect('/admin/menus')
  }

  async destroyItem({ params,response,session }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    await MenuItem.query().where('parent_id',item.id).update({ parentId:null })
    await item.delete(); session.flash('success','Item removido do menu.'); return response.redirect('/admin/menus')
  }
}
