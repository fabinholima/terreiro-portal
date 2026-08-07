/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

const HomeController = () => import('#controllers/home_controller')
const PublicEventsController = () => import('#controllers/events_controller')
const PagesController = () => import('#controllers/pages_controller')
const SeoController = () => import('#controllers/seo_controller')
const HealthController = () => import('#controllers/health_controller')
const LogoController = () => import('#controllers/logo_controller')
const DashboardController = () => import('#controllers/admin/dashboard_controller')
const EventsController = () => import('#controllers/admin/events_controller')
const AlbumsController = () => import('#controllers/admin/albums_controller')
const GalleryController = () => import('#controllers/gallery_controller')
const AdminSocialActionsController = () => import('#controllers/admin/social_actions_controller')
const SocialActionsController = () => import('#controllers/social_actions_controller')
const AdminPostsController = () => import('#controllers/admin/posts_controller')
const PostsController = () => import('#controllers/posts_controller')
const AdminDocumentsController = () => import('#controllers/admin/documents_controller')
const DocumentsController = () => import('#controllers/documents_controller')
const InstitutionalPagesController = () => import('#controllers/admin/institutional_pages_controller')
const SiteSettingsController = () => import('#controllers/admin/site_settings_controller')
const UsersController = () => import('#controllers/admin/users_controller')

router.get('/', [HomeController, 'index']).as('home')
router.get('/health', [HealthController, 'show']).as('health')
router.get('/images/logo-terreiro.png', [LogoController, 'show']).as('assets.logo')
router.get('/robots.txt', [SeoController, 'robots']).as('seo.robots')
router.get('/sitemap.xml', [SeoController, 'sitemap']).as('seo.sitemap')
router.get('/o-terreiro', [PagesController, 'about']).as('pages.about')
router.get('/nossa-historia', [PagesController, 'history']).as('pages.history')
router.get('/umbanda', [PagesController, 'umbanda']).as('pages.umbanda')
router.get('/contato', [PagesController, 'contact']).as('pages.contact')
router.get('/agenda', [PublicEventsController, 'index']).as('events.index')
router.get('/galeria', [GalleryController, 'index']).as('gallery.index')
router.get('/galeria/:slug', [GalleryController, 'show']).as('gallery.show')
router.get('/acoes-sociais', [SocialActionsController, 'index']).as('social_actions.index')
router.get('/noticias', [PostsController, 'index']).as('posts.index')
router.get('/noticias/:slug', [PostsController, 'show']).as('posts.show')
router.get('/documentos', [DocumentsController, 'index']).as('documents.index')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
    router.get('/admin', [DashboardController, 'index']).as('admin.dashboard')

    router.get('/admin/site-settings', [SiteSettingsController, 'edit']).as('admin.site_settings.edit').use(middleware.adminOnly())
    router.post('/admin/site-settings', [SiteSettingsController, 'update']).as('admin.site_settings.update').use(middleware.adminOnly())

    router.get('/admin/users', [UsersController, 'index']).as('admin.users.index').use(middleware.adminOnly())
    router.get('/admin/users/create', [UsersController, 'create']).as('admin.users.create').use(middleware.adminOnly())
    router.post('/admin/users', [UsersController, 'store']).as('admin.users.store').use(middleware.adminOnly())
    router.get('/admin/users/:id/edit', [UsersController, 'edit']).as('admin.users.edit').use(middleware.adminOnly())
    router.post('/admin/users/:id', [UsersController, 'update']).as('admin.users.update').use(middleware.adminOnly())
    router.post('/admin/users/:id/delete', [UsersController, 'destroy']).as('admin.users.destroy').use(middleware.adminOnly())

    router.get('/admin/institutional-pages', [InstitutionalPagesController, 'index']).as('admin.institutional_pages.index')
    router.get('/admin/institutional-pages/:id/edit', [InstitutionalPagesController, 'edit']).as('admin.institutional_pages.edit')
    router.post('/admin/institutional-pages/:id', [InstitutionalPagesController, 'update']).as('admin.institutional_pages.update')

    router.get('/admin/events', [EventsController, 'index']).as('admin.events.index')
    router.get('/admin/events/create', [EventsController, 'create']).as('admin.events.create')
    router.post('/admin/events', [EventsController, 'store']).as('admin.events.store')
    router.get('/admin/events/:id/edit', [EventsController, 'edit']).as('admin.events.edit')
    router.post('/admin/events/:id', [EventsController, 'update']).as('admin.events.update')
    router.post('/admin/events/:id/delete', [EventsController, 'destroy']).as('admin.events.destroy')

    router.get('/admin/albums', [AlbumsController, 'index']).as('admin.albums.index')
    router.get('/admin/albums/create', [AlbumsController, 'create']).as('admin.albums.create')
    router.post('/admin/albums', [AlbumsController, 'store']).as('admin.albums.store')
    router.get('/admin/albums/:id/edit', [AlbumsController, 'edit']).as('admin.albums.edit')
    router.post('/admin/albums/:id', [AlbumsController, 'update']).as('admin.albums.update')
    router.post('/admin/albums/:id/photos', [AlbumsController, 'upload']).as('admin.albums.photos.upload')
    router.post('/admin/albums/:id/photos/:photoId', [AlbumsController, 'updatePhoto']).as('admin.albums.photos.update')
    router.post('/admin/albums/:id/photos/:photoId/delete', [AlbumsController, 'deletePhoto']).as('admin.albums.photos.destroy')
    router.post('/admin/albums/:id/delete', [AlbumsController, 'destroy']).as('admin.albums.destroy')

    router.get('/admin/social-actions', [AdminSocialActionsController, 'index']).as('admin.social_actions.index')
    router.get('/admin/social-actions/create', [AdminSocialActionsController, 'create']).as('admin.social_actions.create')
    router.post('/admin/social-actions', [AdminSocialActionsController, 'store']).as('admin.social_actions.store')
    router.get('/admin/social-actions/:id/edit', [AdminSocialActionsController, 'edit']).as('admin.social_actions.edit')
    router.post('/admin/social-actions/:id', [AdminSocialActionsController, 'update']).as('admin.social_actions.update')
    router.post('/admin/social-actions/:id/delete', [AdminSocialActionsController, 'destroy']).as('admin.social_actions.destroy')

    router.get('/admin/posts', [AdminPostsController, 'index']).as('admin.posts.index')
    router.get('/admin/posts/create', [AdminPostsController, 'create']).as('admin.posts.create')
    router.post('/admin/posts', [AdminPostsController, 'store']).as('admin.posts.store')
    router.post('/admin/posts/editor-image-upload', [AdminPostsController, 'uploadEditorImage']).as('admin.posts.editor_image.upload')
    router.get('/admin/posts/:id/edit', [AdminPostsController, 'edit']).as('admin.posts.edit')
    router.post('/admin/posts/:id', [AdminPostsController, 'update']).as('admin.posts.update')
    router.post('/admin/posts/:id/featured-image/replace', [AdminPostsController, 'replaceFeaturedImage']).as('admin.posts.featured_image.replace')
    router.post('/admin/posts/:id/featured-image/delete', [AdminPostsController, 'deleteFeaturedImage']).as('admin.posts.featured_image.destroy')
    router.post('/admin/posts/:id/images/:index/dimensions', [AdminPostsController, 'updateImageDimensions']).as('admin.posts.images.dimensions')
    router.post('/admin/posts/:id/images/:index/replace', [AdminPostsController, 'replaceImage']).as('admin.posts.images.replace')
    router.post('/admin/posts/:id/images/:index/delete', [AdminPostsController, 'deleteImage']).as('admin.posts.images.destroy')
    router.post('/admin/posts/:id/delete', [AdminPostsController, 'destroy']).as('admin.posts.destroy')

    router.get('/admin/documents', [AdminDocumentsController, 'index']).as('admin.documents.index')
    router.get('/admin/documents/create', [AdminDocumentsController, 'create']).as('admin.documents.create')
    router.post('/admin/documents', [AdminDocumentsController, 'store']).as('admin.documents.store')
    router.get('/admin/documents/:id/edit', [AdminDocumentsController, 'edit']).as('admin.documents.edit')
    router.post('/admin/documents/:id', [AdminDocumentsController, 'update']).as('admin.documents.update')
    router.post('/admin/documents/:id/delete', [AdminDocumentsController, 'destroy']).as('admin.documents.destroy')
  })
  .use(middleware.auth())
