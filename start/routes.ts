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

// Public site
router.get('/', [HomeController, 'index']).as('home')
router.get('/o-terreiro', [PagesController, 'about']).as('pages.about')
router.get('/nossa-historia', [PagesController, 'history']).as('pages.history')
router.get('/umbanda', [PagesController, 'umbanda']).as('pages.umbanda')
router.get('/contato', [PagesController, 'contact']).as('pages.contact')
router.get('/agenda', [PublicEventsController, 'index']).as('events.index')
router.get('/galeria', [GalleryController, 'index']).as('gallery.index')
router.get('/acoes-sociais', [SocialActionsController, 'index']).as('social_actions.index')
router.get('/noticias', [PostsController, 'index']).as('posts.index')
router.get('/noticias/:slug', [PostsController, 'show']).as('posts.show')
router.get('/documentos', [DocumentsController, 'index']).as('documents.index')

// Authentication
router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')
    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

// Administration
router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')

    router.get('/admin', [DashboardController, 'index']).as('admin.dashboard')

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
    router
      .post('/admin/albums/:id/photos/:photoId', [AlbumsController, 'updatePhoto'])
      .as('admin.albums.photos.update')
    router
      .post('/admin/albums/:id/photos/:photoId/delete', [AlbumsController, 'deletePhoto'])
      .as('admin.albums.photos.destroy')
    router.post('/admin/albums/:id/delete', [AlbumsController, 'destroy']).as('admin.albums.destroy')

    router
      .get('/admin/social-actions', [AdminSocialActionsController, 'index'])
      .as('admin.social_actions.index')
    router
      .get('/admin/social-actions/create', [AdminSocialActionsController, 'create'])
      .as('admin.social_actions.create')
    router
      .post('/admin/social-actions', [AdminSocialActionsController, 'store'])
      .as('admin.social_actions.store')
    router
      .get('/admin/social-actions/:id/edit', [AdminSocialActionsController, 'edit'])
      .as('admin.social_actions.edit')
    router
      .post('/admin/social-actions/:id', [AdminSocialActionsController, 'update'])
      .as('admin.social_actions.update')
    router
      .post('/admin/social-actions/:id/delete', [AdminSocialActionsController, 'destroy'])
      .as('admin.social_actions.destroy')

    router.get('/admin/posts', [AdminPostsController, 'index']).as('admin.posts.index')
    router.get('/admin/posts/create', [AdminPostsController, 'create']).as('admin.posts.create')
    router.post('/admin/posts', [AdminPostsController, 'store']).as('admin.posts.store')
    router.get('/admin/posts/:id/edit', [AdminPostsController, 'edit']).as('admin.posts.edit')
    router.post('/admin/posts/:id', [AdminPostsController, 'update']).as('admin.posts.update')
    router.post('/admin/posts/:id/delete', [AdminPostsController, 'destroy']).as('admin.posts.destroy')

    router.get('/admin/documents', [AdminDocumentsController, 'index']).as('admin.documents.index')
    router
      .get('/admin/documents/create', [AdminDocumentsController, 'create'])
      .as('admin.documents.create')
    router.post('/admin/documents', [AdminDocumentsController, 'store']).as('admin.documents.store')
    router
      .get('/admin/documents/:id/edit', [AdminDocumentsController, 'edit'])
      .as('admin.documents.edit')
    router.post('/admin/documents/:id', [AdminDocumentsController, 'update']).as('admin.documents.update')
    router
      .post('/admin/documents/:id/delete', [AdminDocumentsController, 'destroy'])
      .as('admin.documents.destroy')
  })
  .use(middleware.auth())
