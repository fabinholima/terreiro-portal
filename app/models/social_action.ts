import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SocialAction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare status: 'planned' | 'active' | 'completed' | 'permanent' | 'cancelled'

  @column()
  declare goal: number | null

  @column()
  declare currentValue: number | null

  @column()
  declare unit: string | null

  @column.dateTime()
  declare startsAt: DateTime | null

  @column.dateTime()
  declare endsAt: DateTime | null

  @column()
  declare imagePath: string | null

  @column()
  declare isPublic: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  get progressPercent() {
    if (!this.goal || this.goal <= 0 || this.currentValue === null) return null
    return Math.min(100, Math.max(0, Math.round((Number(this.currentValue) / Number(this.goal)) * 100)))
  }
}
