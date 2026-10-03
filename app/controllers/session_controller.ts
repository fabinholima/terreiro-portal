import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    if (!user.isActive) {
      session.flash('error', 'Esta conta está inativa. Procure um administrador.')
      return response.redirect().toRoute('session.create')
    }

    await auth.use('web').login(user)
    return response.redirect('/admin')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}
