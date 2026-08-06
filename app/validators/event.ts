import vine from '@vinejs/vine'

export const eventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    description: vine.string().trim().optional(),
    category: vine.string().trim().maxLength(80).optional(),
    startsAt: vine.string(),
    endsAt: vine.string().optional(),
    location: vine.string().trim().maxLength(200).optional(),
    status: vine.enum(['scheduled', 'confirmed', 'postponed', 'cancelled', 'completed']),
    isPublic: vine.boolean(),
  })
)
