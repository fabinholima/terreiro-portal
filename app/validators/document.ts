import vine from '@vinejs/vine'

export const documentValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    category: vine.string().trim().maxLength(100).optional(),
    version: vine.string().trim().maxLength(40).optional(),
    documentDate: vine.string().optional(),
    description: vine.string().trim().optional(),
    isPublic: vine.boolean(),
  })
)
