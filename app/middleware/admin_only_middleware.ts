import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminOnlyMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user || !user.isActive || user.role !== 'admin') {
      return response.forbidden('Acesso restrito a administradores.')
    }

    return next()
  }
}
