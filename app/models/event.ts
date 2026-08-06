import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare category: string | null

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime | null

  @column()
  declare location: string | null

  @column()
  declare status: 'scheduled' | 'confirmed' | 'postponed' | 'cancelled' | 'completed'

  @column()
  declare isPublic: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
