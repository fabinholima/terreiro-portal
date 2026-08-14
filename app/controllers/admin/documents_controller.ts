import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import { unlink } from 'node:fs/promises'
import Document from '#models/document'
import { documentValidator } from '#validators/document'

export default class DocumentsController {
  async index({ view }: HttpContext) {
    const documents = await Document.query().orderBy('document_date', 'desc').orderBy('created_at', 'desc')
    return view.render('admin/documents/index', { documents })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/documents/form', { document: null })
  }

  async store({ request, response, session }: HttpContext) {
    this.normalizeBody(request)
    const payload = await request.validateUsing(documentValidator)
    const file = request.file('file', { size: '20mb', extnames: ['pdf'] })

    if (!file || !file.isValid) {
      session.flash('error', 'Selecione um arquivo PDF válido de até 20 MB.')
      return response.redirect().back()
    }

    const safeName = file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${Date.now()}-${safeName}`
    await file.move(app.makePath('public/uploads/documents'), { name: fileName })

    await Document.create({
      title: payload.title,
      category: payload.category ?? null,
      version: payload.version ?? null,
      documentDate: payload.documentDate ? DateTime.fromISO(payload.documentDate) : null,
      description: payload.description ?? null,
      filePath: `/uploads/documents/${fileName}`,
      isPublic: payload.isPublic,
    })

    session.flash('success', 'Documento cadastrado com sucesso.')
    return response.redirect('/admin/documents')
  }

  async edit({ params, view }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    return view.render('admin/documents/form', { document })
  }

  async update({ params, request, response, session }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    this.normalizeBody(request)
    const payload = await request.validateUsing(documentValidator)
    const file = request.file('file', { size: '20mb', extnames: ['pdf'] })

    document.merge({
      title: payload.title,
      category: payload.category ?? null,
      version: payload.version ?? null,
      documentDate: payload.documentDate ? DateTime.fromISO(payload.documentDate) : null,
      description: payload.description ?? null,
      isPublic: payload.isPublic,
    })

    if (file) {
      if (!file.isValid) {
        session.flash('error', 'O novo arquivo deve ser um PDF válido de até 20 MB.')
        return response.redirect().back()
      }

      const oldPath = document.filePath
      const safeName = file.clientName.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${Date.now()}-${safeName}`
      await file.move(app.makePath('public/uploads/documents'), { name: fileName })
      document.filePath = `/uploads/documents/${fileName}`

      if (oldPath) {
        await unlink(app.makePath('public', oldPath.replace(/^\//, ''))).catch(() => undefined)
      }
    }

    await document.save()
    session.flash('success', 'Documento atualizado com sucesso.')
    return response.redirect('/admin/documents')
  }

  async destroy({ params, response, session }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    const filePath = document.filePath
    await document.delete()

    if (filePath) {
      await unlink(app.makePath('public', filePath.replace(/^\//, ''))).catch(() => undefined)
    }

    session.flash('success', 'Documento excluído com sucesso.')
    return response.redirect('/admin/documents')
  }

  private normalizeBody(request: HttpContext['request']) {
    const body = request.all()
    const normalizeOptional = (value: unknown) => {
      if (typeof value !== 'string') return value
      const trimmed = value.trim()
      return trimmed === '' ? undefined : trimmed
    }

    const publicValue = request.input('isPublic')
    const isPublic = Array.isArray(publicValue)
      ? publicValue.some((value) => value === 'true' || value === true)
      : publicValue === true || publicValue === 'true' || publicValue === '1' || publicValue === 'on'

    request.updateBody({
      ...body,
      category: normalizeOptional(body.category),
      version: normalizeOptional(body.version),
      documentDate: normalizeOptional(body.documentDate),
      description: normalizeOptional(body.description),
      isPublic,
    })
  }
}
