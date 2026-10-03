import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import MenuItem from '#models/menu_item'

export default class Menu extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare location: string
  @column() declare isActive: boolean
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null

  @hasMany(() => MenuItem)
  declare items: HasMany<typeof MenuItem>
}
