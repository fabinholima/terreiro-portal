import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class HealthController {
  async show({ response }: HttpContext) {
    try {
      await db.rawQuery('select 1')
      return response.ok({ status: 'ok', database: 'ok' })
    } catch {
      return response.status(503).send({ status: 'degraded', database: 'unavailable' })
    }
  }
}
