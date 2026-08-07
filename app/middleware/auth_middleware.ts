import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Protects authenticated routes and redirects browser requests to /login
 * instead of surfacing the default 401 Unauthorized page.
 */
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
        return next()
      }
    }

    return ctx.response.redirect(this.redirectTo)
  }
}
