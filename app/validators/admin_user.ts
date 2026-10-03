import vine from '@vinejs/vine'

const baseFields = {
  fullName: vine.string().trim().minLength(2).maxLength(120),
  email: vine.string().trim().email().maxLength(254),
  role: vine.enum(['admin', 'editor'] as const),
}

export const createAdminUserValidator = vine.compile(
  vine.object({
    ...baseFields,
    email: vine.string().trim().email().maxLength(254).unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(64).confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
)

export const updateAdminUserValidator = vine.compile(
  vine.object({
    ...baseFields,
    password: vine.string().minLength(8).maxLength(64).confirmed({
      confirmationField: 'passwordConfirmation',
    }).optional(),
  })
)
