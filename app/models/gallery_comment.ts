import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Album from '#models/album'

export default class GalleryComment extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare albumId: number
  @column() declare name: string
  @column() declare email: string
  @column() declare body: string
  @column() declare isApproved: boolean
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null
  @belongsTo(() => Album) declare album: BelongsTo<typeof Album>
}
