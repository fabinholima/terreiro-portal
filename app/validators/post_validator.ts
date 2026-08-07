import vine from '@vinejs/vine'

export const postValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    summary: vine.string().trim().optional(),
    body: vine.string().optional(),
    status: vine.enum(['draft', 'published', 'archived'] as const),
    publishedAt: vine.string().optional(),
    imageDisplaySize: vine.enum(['small', 'medium', 'large', 'full'] as const).optional(),
    featuredImageWidth: vine.number().min(100).max(3000).optional(),
    featuredImageHeight: vine.number().min(100).max(3000).optional(),
    featuredImageFit: vine.enum(['contain', 'cover'] as const).optional(),
    contentImageWidth: vine.number().min(100).max(3000).optional(),
    contentImageHeight: vine.number().min(100).max(3000).optional(),
  })
)
