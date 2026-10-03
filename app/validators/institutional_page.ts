import vine from '@vinejs/vine'

export const institutionalPageValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).maxLength(160).optional(),
    eyebrow: vine.string().trim().maxLength(120).optional(),
    summary: vine.string().trim().optional(),
    body: vine.string().trim().minLength(10),
  })
)
