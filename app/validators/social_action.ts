import vine from '@vinejs/vine'

export const socialActionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(180),
    slug: vine.string().trim().minLength(3).maxLength(200),
    description: vine.string().optional(),
    status: vine.enum(['planned', 'active', 'completed', 'permanent', 'cancelled']),
    goal: vine.number().min(0).optional(),
    currentValue: vine.number().min(0).optional(),
    unit: vine.string().trim().maxLength(80).optional(),
    startsAt: vine.string().optional(),
    endsAt: vine.string().optional(),
    isPublic: vine.boolean(),
  })
)
