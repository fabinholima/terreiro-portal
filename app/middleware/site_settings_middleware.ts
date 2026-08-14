import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import SiteSetting from '#models/site_setting'
import Menu from '#models/menu'
import env from '#start/env'

const pageTitles:Record<string,string>={'/':'Início','/o-terreiro':'O Terreiro','/nossa-historia':'Nossa História','/umbanda':'Umbanda','/agenda':'Agenda','/galeria':'Galeria','/acoes-sociais':'Ações Sociais','/noticias':'Notícias','/documentos':'Documentos Públicos','/contato':'Contato'}
const legacyPublic=[{key:'about',label:'O Terreiro',href:'/o-terreiro',visible:true,order:1},{key:'events',label:'Agenda',href:'/agenda',visible:true,order:2},{key:'gallery',label:'Galeria',href:'/galeria',visible:true,order:3},{key:'posts',label:'Notícias',href:'/noticias',visible:true,order:4},{key:'social',label:'Ações sociais',href:'/acoes-sociais',visible:true,order:5},{key:'documents',label:'Documentos',href:'/documentos',visible:true,order:6},{key:'contact',label:'Contato',href:'/contato',visible:true,order:7}]
const defaultAdminMenu=[{key:'events',label:'Agenda',href:'/admin/events',visible:true,order:1},{key:'posts',label:'Notícias',href:'/admin/posts',visible:true,order:2},{key:'albums',label:'Galeria',href:'/admin/albums',visible:true,order:3},{key:'social',label:'Ações sociais',href:'/admin/social-actions',visible:true,order:4},{key:'documents',label:'Documentos',href:'/admin/documents',visible:true,order:5},{key:'pages',label:'Páginas',href:'/admin/institutional-pages',visible:true,order:6}]
const fallbackSettings:any={siteName:'Terreiro de Umbanda Oxóssi e João Boiadeiro',siteSubtitle:'Fé, caridade, ancestralidade e acolhimento',themePrimary:'#1E4620',themeDark:'#08351F',themeAccent:'#D6A23C',themeBackground:'#FFFDF9',themeText:'#223028',fontHeading:'Georgia',fontBody:'Inter',fontUi:'Inter',fontSizeBase:16,headingWeight:600,publicMenuConfig:null,adminMenuConfig:null}
function parseMenu(raw:string|null|undefined,fallback:any[]){if(!raw)return fallback;try{const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed:fallback}catch{return fallback}}
function pageHref(slug:string){return ['o-terreiro','nossa-historia','umbanda','contato'].includes(slug)?`/${slug}`:`/pagina/${slug}`}

export default class SiteSettingsMiddleware {
  async handle({view,request}:HttpContext,next:NextFn){
    const settings=await SiteSetting.first();const siteSettings=settings??fallbackSettings
    let publicMenu:any[]=[]
    const dbMenu=await Menu.query().where('location','main').where('is_active',true).preload('items',(q)=>q.preload('page').where('is_visible',true).orderBy('position','asc').orderBy('id','asc')).first()
    if(dbMenu){
      const flat=dbMenu.items.map((item:any)=>({id:item.id,parentId:item.parentId,label:item.label,href:item.type==='page'&&item.page?pageHref(item.page.slug):item.url||'#',openNewTab:item.openNewTab,position:item.position,children:[]}))
      const byId=new Map(flat.map((i:any)=>[i.id,i]))
      for(const item of flat){if(item.parentId&&byId.has(item.parentId))byId.get(item.parentId).children.push(item)}
      publicMenu=flat.filter((i:any)=>!i.parentId).sort((a:any,b:any)=>a.position-b.position)
    }else{
      publicMenu=parseMenu(siteSettings.publicMenuConfig,legacyPublic).filter((i:any)=>i.visible!==false).sort((a:any,b:any)=>(a.order??0)-(b.order??0)).map((i:any)=>({...i,children:[]}))
    }
    const adminMenuAll=parseMenu(siteSettings.adminMenuConfig,defaultAdminMenu).sort((a:any,b:any)=>(a.order??0)-(b.order??0));const adminMenu=adminMenuAll.filter((i:any)=>i.visible!==false)
    const baseUrl=env.get('APP_URL').replace(/\/$/,'');const path=request.url().split('?')[0];const pageTitle=pageTitles[path];const description=siteSettings.siteSubtitle||`Portal institucional de ${siteSettings.siteName}.`
    view.share({siteSettings,publicMenu,adminMenu,adminMenuAll,seo:{title:pageTitle?`${pageTitle} | ${siteSettings.siteName}`:siteSettings.siteName,description,canonicalUrl:`${baseUrl}${path}`,imageUrl:null,type:'website',noindex:path.startsWith('/admin')||path==='/login'}})
    return next()
  }
}
