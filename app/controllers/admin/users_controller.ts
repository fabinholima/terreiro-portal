import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createAdminUserValidator, updateAdminUserValidator } from '#validators/admin_user'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.query().orderBy('full_name', 'asc').orderBy('email', 'asc')
    return view.render('admin/users/index', { users })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/users/form', { user: null })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAdminUserValidator)

    await User.create({
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: payload.role,
      isActive: request.input('isActive') !== 'false',
    })

    return response.redirect('/admin/users')
  }

  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('admin/users/form', { user })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateAdminUserValidator)
    const isActive = request.input('isActive') === 'true'

    const emailOwner = await User.query()
      .where('email', payload.email.toLowerCase())
      .whereNot('id', user.id)
      .first()

    if (emailOwner) {
      session.flash('errors', { email: 'Este e-mail já está em uso.' })
      return response.redirect().back()
    }

    if (user.role === 'admin' && user.isActive && (payload.role !== 'admin' || !isActive)) {
      const activeAdmins = await User.query().where('role', 'admin').where('is_active', true).count('* as total')
      if (Number(activeAdmins[0].$extras.total) <= 1) {
        session.flash('error', 'Não é possível remover ou desativar o último administrador ativo.')
        return response.redirect().back()
      }
    }

    user.fullName = payload.fullName
    user.email = payload.email.toLowerCase()
    user.role = payload.role
    user.isActive = isActive

    if (payload.password) {
      user.password = payload.password
    }

    await user.save()

    if (auth.user?.id === user.id && !user.isActive) {
      await auth.use('web').logout()
      return response.redirect('/login')
    }

    return response.redirect('/admin/users')
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user?.id === user.id) {
      session.flash('error', 'Você não pode excluir a própria conta.')
      return response.redirect('/admin/users')
    }

    if (user.role === 'admin' && user.isActive) {
      const activeAdmins = await User.query().where('role', 'admin').where('is_active', true).count('* as total')
      if (Number(activeAdmins[0].$extras.total) <= 1) {
        session.flash('error', 'Não é possível excluir o último administrador ativo.')
        return response.redirect('/admin/users')
      }
    }

    await user.delete()
    return response.redirect('/admin/users')
  }
}
