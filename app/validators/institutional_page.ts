import vine from '@vinejs/vine'

export const institutionalPageValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    eyebrow: vine.string().trim().maxLength(120).optional(),
    summary: vine.string().trim().optional(),
    body: vine.string().trim().minLength(10),
  })
)
