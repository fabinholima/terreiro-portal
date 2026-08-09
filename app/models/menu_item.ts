import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Menu from '#models/menu'
import InstitutionalPage from '#models/institutional_page'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare menuId: number
  @column() declare parentId: number | null
  @column() declare label: string
  @column() declare type: 'url' | 'page'
  @column() declare pageId: number | null
  @column() declare url: string | null
  @column() declare position: number
  @column() declare isVisible: boolean
  @column() declare openNewTab: boolean
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null

  @belongsTo(() => Menu) declare menu: BelongsTo<typeof Menu>
  @belongsTo(() => InstitutionalPage, { foreignKey: 'pageId' }) declare page: BelongsTo<typeof InstitutionalPage>
  @belongsTo(() => MenuItem, { foreignKey: 'parentId' }) declare parent: BelongsTo<typeof MenuItem>
  @hasMany(() => MenuItem, { foreignKey: 'parentId' }) declare children: HasMany<typeof MenuItem>
}
