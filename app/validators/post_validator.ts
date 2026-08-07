import vine from '@vinejs/vine'

export const postValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    summary: vine.string().trim().optional(),
    body: vine.string().optional(),
    status: vine.enum(['draft', 'published', 'archived'] as const),
    publishedAt: vine.string().optional(),
  })
)
