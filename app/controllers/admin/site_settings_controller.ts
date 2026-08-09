import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { mkdir, unlink } from 'node:fs/promises'
import SiteSetting from '#models/site_setting'
import { siteSettingValidator } from '#validators/site_setting'

const defaults = {
  siteName:'Terreiro de Umbanda Oxóssi e João Boiadeiro', siteSubtitle:'Fé, caridade, ancestralidade e acolhimento', footerText:'Terreiro de Umbanda Oxóssi e João Boiadeiro — em atividade desde 1991.',
  homeEyebrow:'Institucional', homeTitle:'O Terreiro', homeSummary:'Casa de fé, caridade, ancestralidade e acolhimento.', missionTitle:'Nossa missão', missionText:'Promover o exercício religioso da Umbanda com respeito, responsabilidade e compromisso com a caridade, oferecendo um espaço de acolhimento espiritual e convivência comunitária.', missionVisible:true,
  valuesTitle:'Nossos valores', valuesText:'Respeito às diferenças, valorização da ancestralidade, compromisso com a comunidade, responsabilidade religiosa, solidariedade e cuidado com as pessoas.', valuesVisible:true,
  trajectoryTitle:'Nossa trajetória', trajectoryText:'A casa está em atividade desde 1991 e, ao longo de sua trajetória, desenvolveu atividades religiosas, ações de caridade e iniciativas voltadas à comunidade.', trajectoryVisible:true, trajectoryButtonText:'Conheça nossa história', trajectoryButtonUrl:'/o-terreiro',
  contributionVisible:false, contributionTitle:'Contribua com a casa', contributionText:'Sua contribuição voluntária auxilia na manutenção das atividades religiosas, sociais e comunitárias do Terreiro.', themePrimary:'#1E4620', themeDark:'#08351F', themeAccent:'#D6A23C', themeBackground:'#FFFDF9', themeText:'#223028', fontHeading:'Georgia', fontBody:'Inter', fontUi:'Inter', fontSizeBase:16, headingWeight:600,
}

const menuDefs = [
  ['about','O Terreiro','/o-terreiro'],['events','Agenda','/agenda'],['gallery','Galeria','/galeria'],['posts','Notícias','/noticias'],['social','Ações sociais','/acoes-sociais'],['documents','Documentos','/documentos'],['contact','Contato','/contato'],
] as const
const defaultMenu = menuDefs.map(([key,label,href],index)=>({ key,label,href,visible:true,order:index+1 }))
const fontOptions = ['Georgia','Inter','Lora','Merriweather','Source Sans 3','Source Serif 4','Libre Baskerville','Arial','system-ui']
const allowedFonts = new Set(fontOptions)

export default class SiteSettingsController {
  private async getSettings() { let settings=await SiteSetting.first(); if(!settings) settings=await SiteSetting.create(defaults); return settings }
  private getMenu(settings: SiteSetting) {
    if (!settings.publicMenuConfig) return defaultMenu
    try { const parsed=JSON.parse(settings.publicMenuConfig); return Array.isArray(parsed) ? parsed : defaultMenu } catch { return defaultMenu }
  }
  async edit({ view }: HttpContext) {
    const settings=await this.getSettings()
    return view.render('admin/site_settings/form',{
      settings,
      menuItems:this.getMenu(settings).sort((a:any,b:any)=>(a.order??0)-(b.order??0)),
      fontOptions,
      fontSizes:[14,15,16,17,18,19,20],
      headingWeights:[400,500,600,700,800],
    })
  }

  async update({ request,response,session }: HttpContext) {
    const settings=await this.getSettings(); const payload=await request.validateUsing(siteSettingValidator)
    const qrCode=request.file('pixQrCode',{ size:'5mb', extnames:['png','jpg','jpeg','webp'] }); let pixQrCodePath=settings.pixQrCodePath
    if(qrCode){ if(!qrCode.isValid){session.flash('error','O QR Code deve ser uma imagem PNG, JPG ou WebP de até 5 MB.');return response.redirect().back()} const uploadDir=app.makePath('public/uploads/site');await mkdir(uploadDir,{recursive:true});const safeName=`${Date.now()}-${qrCode.clientName.replace(/[^a-zA-Z0-9._-]/g,'_')}`;await qrCode.move(uploadDir,{name:safeName});const newPath=`/uploads/site/${safeName}`;if(settings.pixQrCodePath?.startsWith('/uploads/site/'))await unlink(app.makePath('public',settings.pixQrCodePath.replace(/^\//,''))).catch(()=>undefined);pixQrCodePath=newPath }
    if(request.input('removePixQrCode')==='true'&&pixQrCodePath){if(pixQrCodePath.startsWith('/uploads/site/'))await unlink(app.makePath('public',pixQrCodePath.replace(/^\//,''))).catch(()=>undefined);pixQrCodePath=null}

    const menu=menuDefs.map(([key,label,href],index)=>({key,href,label:String(request.input(`menu_${key}_label`)||label).slice(0,40),visible:request.input(`menu_${key}_visible`)==='true',order:Number(request.input(`menu_${key}_order`)||index+1)})).sort((a,b)=>a.order-b.order)
    const fontHeading=allowedFonts.has(payload.fontHeading||'')?payload.fontHeading!:defaults.fontHeading; const fontBody=allowedFonts.has(payload.fontBody||'')?payload.fontBody!:defaults.fontBody; const fontUi=allowedFonts.has(payload.fontUi||'')?payload.fontUi!:defaults.fontUi
    settings.merge({siteName:payload.siteName,siteSubtitle:payload.siteSubtitle??null,address:payload.address??null,city:payload.city??null,state:payload.state?.toUpperCase()??null,postalCode:payload.postalCode??null,phone:payload.phone??null,whatsapp:payload.whatsapp??null,email:payload.email??null,instagramUrl:payload.instagramUrl??null,facebookUrl:payload.facebookUrl??null,youtubeUrl:payload.youtubeUrl??null,mapsUrl:payload.mapsUrl??null,openingHours:payload.openingHours??null,footerText:payload.footerText??null,homeEyebrow:payload.homeEyebrow??defaults.homeEyebrow,homeTitle:payload.homeTitle??defaults.homeTitle,homeSummary:payload.homeSummary??defaults.homeSummary,missionTitle:payload.missionTitle??defaults.missionTitle,missionText:payload.missionText??defaults.missionText,missionVisible:payload.missionVisible??false,valuesTitle:payload.valuesTitle??defaults.valuesTitle,valuesText:payload.valuesText??defaults.valuesText,valuesVisible:payload.valuesVisible??false,trajectoryTitle:payload.trajectoryTitle??defaults.trajectoryTitle,trajectoryText:payload.trajectoryText??defaults.trajectoryText,trajectoryVisible:payload.trajectoryVisible??false,trajectoryButtonText:payload.trajectoryButtonText??defaults.trajectoryButtonText,trajectoryButtonUrl:payload.trajectoryButtonUrl??defaults.trajectoryButtonUrl,contributionVisible:payload.contributionVisible??false,contributionTitle:payload.contributionTitle??defaults.contributionTitle,contributionText:payload.contributionText??defaults.contributionText,pixKey:payload.pixKey??null,pixBeneficiary:payload.pixBeneficiary??null,pixQrCodePath,themePrimary:payload.themePrimary??defaults.themePrimary,themeDark:payload.themeDark??defaults.themeDark,themeAccent:payload.themeAccent??defaults.themeAccent,themeBackground:payload.themeBackground??defaults.themeBackground,themeText:payload.themeText??defaults.themeText,fontHeading,fontBody,fontUi,fontSizeBase:payload.fontSizeBase??16,headingWeight:payload.headingWeight??600,publicMenuConfig:JSON.stringify(menu)})
    await settings.save();session.flash('success','Configurações atualizadas com sucesso.');return response.redirect('/admin/site-settings')
  }
}
