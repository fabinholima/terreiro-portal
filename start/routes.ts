/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

const EventsController = () => import('#controllers/admin/events_controller')
const AlbumsController = () => import('#controllers/admin/albums_controller')
const GalleryController = () => import('#controllers/gallery_controller')
const AdminSocialActionsController = () => import('#controllers/admin/social_actions_controller')
const SocialActionsController = () => import('#controllers/social_actions_controller')

router.on('/').render('pages/home').as('home')
router.get('/galeria', [GalleryController, 'index']).as('gallery')
router.get('/acoes-sociais', [SocialActionsController, 'index']).as('social_actions')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('/admin/events', [EventsController, 'index'])
    router.get('/admin/events/create', [EventsController, 'create'])
    router.post('/admin/events', [EventsController, 'store'])
    router.get('/admin/events/:id/edit', [EventsController, 'edit'])
    router.post('/admin/events/:id', [EventsController, 'update'])
    router.post('/admin/events/:id/delete', [EventsController, 'destroy'])

    router.get('/admin/albums', [AlbumsController, 'index'])
    router.get('/admin/albums/create', [AlbumsController, 'create'])
    router.post('/admin/albums', [AlbumsController, 'store'])
    router.get('/admin/albums/:id/edit', [AlbumsController, 'edit'])
    router.post('/admin/albums/:id', [AlbumsController, 'update'])
    router.post('/admin/albums/:id/photos', [AlbumsController, 'upload'])
    router.post('/admin/albums/:id/photos/:photoId', [AlbumsController, 'updatePhoto'])
    router.post('/admin/albums/:id/photos/:photoId/delete', [AlbumsController, 'deletePhoto'])
    router.post('/admin/albums/:id/delete', [AlbumsController, 'destroy'])

    router.get('/admin/social-actions', [AdminSocialActionsController, 'index'])
    router.get('/admin/social-actions/create', [AdminSocialActionsController, 'create'])
    router.post('/admin/social-actions', [AdminSocialActionsController, 'store'])
    router.get('/admin/social-actions/:id/edit', [AdminSocialActionsController, 'edit'])
    router.post('/admin/social-actions/:id', [AdminSocialActionsController, 'update'])
    router.post('/admin/social-actions/:id/delete', [AdminSocialActionsController, 'destroy'])
  })
  .use(middleware.auth())
