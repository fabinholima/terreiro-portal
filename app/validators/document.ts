import vine from '@vinejs/vine'

export const documentValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    category: vine.string().trim().maxLength(80).optional(),
    version: vine.string().trim().maxLength(40).optional(),
    documentDate: vine.string().optional(),
    description: vine.string().trim().optional(),
    isPublic: vine.boolean(),
  })
)
