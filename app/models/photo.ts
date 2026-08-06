import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Album from '#models/album'

export default class Photo extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare albumId: number
  @column() declare path: string
  @column() declare caption: string | null
  @column() declare altText: string | null
  @column() declare credit: string | null
  @column() declare publicationAuthorized: boolean
  @column() declare position: number
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null
  @belongsTo(() => Album) declare album: BelongsTo<typeof Album>
}
