import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

type ImageSetting = { width?: number | null; height?: number | null }
type ImageSettings = Record<string, ImageSetting>

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

  @column()
  declare featuredImageWidth: number | null

  @column()
  declare featuredImageHeight: number | null

  @column()
  declare featuredImageFit: 'contain' | 'cover'

  @column({
    prepare: (value: string[] | string | null | undefined) => {
      if (Array.isArray(value)) return JSON.stringify(value)
      if (typeof value === 'string') return value
      return JSON.stringify([])
    },
    consume: (value: unknown) => {
      if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === 'string')
            : value
              ? [value]
              : []
        } catch {
          return value ? [value] : []
        }
      }
      return []
    },
  })
  declare imagePaths: string[]

  @column()
  declare imageDisplaySize: 'small' | 'medium' | 'large' | 'full'

  @column()
  declare contentImageWidth: number | null

  @column()
  declare contentImageHeight: number | null

  @column({
    prepare: (value: ImageSettings | string | null | undefined) => {
      if (typeof value === 'string') return value
      return JSON.stringify(value ?? {})
    },
    consume: (value: unknown): ImageSettings => {
      if (value && typeof value === 'object' && !Array.isArray(value)) return value as ImageSettings
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
        } catch {
          return {}
        }
      }
      return {}
    },
  })
  declare imageSettings: ImageSettings

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
