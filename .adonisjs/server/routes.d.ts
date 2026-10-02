import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'assets.logo': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'pages.about': { paramsTuple?: []; params?: {} }
    'pages.history': { paramsTuple?: []; params?: {} }
    'pages.umbanda': { paramsTuple?: []; params?: {} }
    'pages.contact': { paramsTuple?: []; params?: {} }
    'pages.contact.send': { paramsTuple?: []; params?: {} }
    'pages.custom': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'gallery.index': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'social_actions.index': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.site_settings.edit': { paramsTuple?: []; params?: {} }
    'admin.site_settings.update': { paramsTuple?: []; params?: {} }
    'admin.menus.index': { paramsTuple?: []; params?: {} }
    'admin.menus.items.store': { paramsTuple?: []; params?: {} }
    'admin.menus.items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.menus.items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.index': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.create': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.store': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.index': { paramsTuple?: []; params?: {} }
    'admin.events.create': { paramsTuple?: []; params?: {} }
    'admin.events.store': { paramsTuple?: []; params?: {} }
    'admin.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.index': { paramsTuple?: []; params?: {} }
    'admin.albums.create': { paramsTuple?: []; params?: {} }
    'admin.albums.store': { paramsTuple?: []; params?: {} }
    'admin.albums.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.upload': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.publish_all': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'photoId': ParamValue} }
    'admin.albums.photos.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'photoId': ParamValue} }
    'admin.albums.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.index': { paramsTuple?: []; params?: {} }
    'admin.social_actions.create': { paramsTuple?: []; params?: {} }
    'admin.social_actions.store': { paramsTuple?: []; params?: {} }
    'admin.social_actions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.index': { paramsTuple?: []; params?: {} }
    'admin.posts.create': { paramsTuple?: []; params?: {} }
    'admin.posts.store': { paramsTuple?: []; params?: {} }
    'admin.posts.editor_image.upload': { paramsTuple?: []; params?: {} }
    'admin.posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.featured_image.replace': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.featured_image.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.images.dimensions': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.images.replace': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.images.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.index': { paramsTuple?: []; params?: {} }
    'admin.documents.create': { paramsTuple?: []; params?: {} }
    'admin.documents.store': { paramsTuple?: []; params?: {} }
    'admin.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'assets.logo': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'pages.about': { paramsTuple?: []; params?: {} }
    'pages.history': { paramsTuple?: []; params?: {} }
    'pages.umbanda': { paramsTuple?: []; params?: {} }
    'pages.contact': { paramsTuple?: []; params?: {} }
    'pages.custom': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'gallery.index': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'social_actions.index': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.site_settings.edit': { paramsTuple?: []; params?: {} }
    'admin.menus.index': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.index': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.create': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.index': { paramsTuple?: []; params?: {} }
    'admin.events.create': { paramsTuple?: []; params?: {} }
    'admin.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.index': { paramsTuple?: []; params?: {} }
    'admin.albums.create': { paramsTuple?: []; params?: {} }
    'admin.albums.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.index': { paramsTuple?: []; params?: {} }
    'admin.social_actions.create': { paramsTuple?: []; params?: {} }
    'admin.social_actions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.index': { paramsTuple?: []; params?: {} }
    'admin.posts.create': { paramsTuple?: []; params?: {} }
    'admin.posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.index': { paramsTuple?: []; params?: {} }
    'admin.documents.create': { paramsTuple?: []; params?: {} }
    'admin.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'assets.logo': { paramsTuple?: []; params?: {} }
    'seo.robots': { paramsTuple?: []; params?: {} }
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'pages.about': { paramsTuple?: []; params?: {} }
    'pages.history': { paramsTuple?: []; params?: {} }
    'pages.umbanda': { paramsTuple?: []; params?: {} }
    'pages.contact': { paramsTuple?: []; params?: {} }
    'pages.custom': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'events.index': { paramsTuple?: []; params?: {} }
    'gallery.index': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'social_actions.index': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.site_settings.edit': { paramsTuple?: []; params?: {} }
    'admin.menus.index': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.create': { paramsTuple?: []; params?: {} }
    'admin.users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.index': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.create': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.index': { paramsTuple?: []; params?: {} }
    'admin.events.create': { paramsTuple?: []; params?: {} }
    'admin.events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.index': { paramsTuple?: []; params?: {} }
    'admin.albums.create': { paramsTuple?: []; params?: {} }
    'admin.albums.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.index': { paramsTuple?: []; params?: {} }
    'admin.social_actions.create': { paramsTuple?: []; params?: {} }
    'admin.social_actions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.index': { paramsTuple?: []; params?: {} }
    'admin.posts.create': { paramsTuple?: []; params?: {} }
    'admin.posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.index': { paramsTuple?: []; params?: {} }
    'admin.documents.create': { paramsTuple?: []; params?: {} }
    'admin.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'pages.contact.send': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.site_settings.update': { paramsTuple?: []; params?: {} }
    'admin.menus.items.store': { paramsTuple?: []; params?: {} }
    'admin.menus.items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.menus.items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.store': { paramsTuple?: []; params?: {} }
    'admin.institutional_pages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.institutional_pages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.store': { paramsTuple?: []; params?: {} }
    'admin.events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.store': { paramsTuple?: []; params?: {} }
    'admin.albums.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.upload': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.publish_all': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.albums.photos.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'photoId': ParamValue} }
    'admin.albums.photos.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'photoId': ParamValue} }
    'admin.albums.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.store': { paramsTuple?: []; params?: {} }
    'admin.social_actions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.social_actions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.store': { paramsTuple?: []; params?: {} }
    'admin.posts.editor_image.upload': { paramsTuple?: []; params?: {} }
    'admin.posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.featured_image.replace': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.featured_image.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.images.dimensions': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.images.replace': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.images.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'index': ParamValue} }
    'admin.posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.store': { paramsTuple?: []; params?: {} }
    'admin.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}