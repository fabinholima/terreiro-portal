import type { HttpContext } from '@adonisjs/core/http'

export default class SocialActionsController {
  async index({ response }: HttpContext) {
    return response.notFound('Página não disponível')
  }
}
