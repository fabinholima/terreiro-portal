import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

function consumeImagePaths(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'string') {
    if (!value.trim()) return []

    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string')
      }
    } catch {
      return [value]
    }
  }

  return []
}

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare summary: string | null

  @column()
  declare body: string | null

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare featuredImagePath: string | null

  @column({
    prepare: (value: string[] | null | undefined) => JSON.stringify(value ?? []),
    consume: (value: unknown) => consumeImagePaths(value),
  })
  declare imagePaths: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
