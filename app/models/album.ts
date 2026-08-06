import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Photo from '#models/photo'

export default class Album extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare title: string
  @column() declare slug: string
  @column() declare description: string | null
  @column.date() declare eventDate: DateTime | null
  @column() declare coverPath: string | null
  @column() declare isPublic: boolean
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null
  @hasMany(() => Photo) declare photos: HasMany<typeof Photo>
}
