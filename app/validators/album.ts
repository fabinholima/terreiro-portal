import vine from '@vinejs/vine'

export const albumValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    description: vine.string().optional(),
    eventDate: vine.string().optional(),
    isPublic: vine.boolean(),
  })
)
