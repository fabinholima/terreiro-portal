import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
import SocialAction from '#models/social_action'
import { socialActionValidator } from '#validators/social_action'

function optionalString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length ? normalized : undefined
}

function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return undefined
  const normalized = Number(value)
  return Number.isFinite(normalized) ? normalized : undefined
}

function booleanValue(value: unknown) {
  if (Array.isArray(value)) return value.some((item) => item === true || item === 'true' || item === '1' || item === 'on')
  return value === true || value === 'true' || value === '1' || value === 'on'
}

export default class SocialActionsController {
  async index({ view }: HttpContext) {
    const actions = await SocialAction.query().orderBy('created_at', 'desc')
    return view.render('admin/social_actions/index', { actions })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/social_actions/form', { action: null })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await this.validatePayload(request)
    const imagePath = await this.saveImage(request)

    await SocialAction.create({
      title: payload.title,
      slug: payload.slug,
      description: payload.description ?? null,
      status: payload.status,
      goal: payload.goal ?? null,
      currentValue: payload.currentValue ?? null,
      unit: payload.unit ?? null,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
      isPublic: payload.isPublic,
      imagePath,
    })

    session.flash('success', 'Ação social cadastrada com sucesso.')
    return response.redirect('/admin/social-actions')
  }

  async edit({ params, view }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    return view.render('admin/social_actions/form', { action })
  }

  async update({ params, request, response, session }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    const payload = await this.validatePayload(request)
    const newImagePath = await this.saveImage(request)

    if (newImagePath && action.imagePath && newImagePath !== action.imagePath) {
      await this.deletePublicFile(action.imagePath)
    }

    action.merge({
      title: payload.title,
      slug: payload.slug,
      description: payload.description ?? null,
      status: payload.status,
      goal: payload.goal ?? null,
      currentValue: payload.currentValue ?? null,
      unit: payload.unit ?? null,
      startsAt: payload.startsAt ? DateTime.fromISO(payload.startsAt) : null,
      endsAt: payload.endsAt ? DateTime.fromISO(payload.endsAt) : null,
      isPublic: payload.isPublic,
      imagePath: newImagePath ?? action.imagePath,
    })

    await action.save()
    session.flash('success', 'Ação social atualizada com sucesso.')
    return response.redirect('/admin/social-actions')
  }

  async destroy({ params, response, session }: HttpContext) {
    const action = await SocialAction.findOrFail(params.id)
    if (action.imagePath) await this.deletePublicFile(action.imagePath)
    await action.delete()
    session.flash('success', 'Ação social excluída com sucesso.')
    return response.redirect('/admin/social-actions')
  }

  private async validatePayload(request: HttpContext['request']) {
    const raw = request.all()

    return socialActionValidator.validate({
      title: raw.title,
      slug: raw.slug,
      description: optionalString(raw.description),
      status: raw.status,
      goal: optionalNumber(raw.goal),
      currentValue: optionalNumber(raw.currentValue),
      unit: optionalString(raw.unit),
      startsAt: optionalString(raw.startsAt),
      endsAt: optionalString(raw.endsAt),
      isPublic: booleanValue(raw.isPublic),
    })
  }

  private async saveImage(request: HttpContext['request']) {
    const file = request.file('image', { size: '12mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
    if (!file) return null

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    await file.move(app.makePath('public/uploads/social-actions'), { name: safeName })
    return `/uploads/social-actions/${safeName}`
  }

  private async deletePublicFile(publicPath: string) {
    if (!publicPath.startsWith('/uploads/social-actions/')) return
    try {
      await unlink(app.makePath('public', publicPath.replace(/^\//, '')))
    } catch {}
  }
}
