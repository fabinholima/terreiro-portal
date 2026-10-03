import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const guards = options.guards ?? ['web']

    for (const guardName of guards) {
      const guard = ctx.auth.use(guardName)

      if (await guard.check()) {
        if (ctx.auth.user && !ctx.auth.user.isActive) {
          await guard.logout()
          ctx.session.flash('error', 'Esta conta foi desativada.')
          return ctx.response.redirect(this.redirectTo)
        }

        return next()
      }
    }

    return ctx.response.redirect(this.redirectTo)
  }
}
