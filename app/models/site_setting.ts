import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SiteSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteName: string

  @column()
  declare siteSubtitle: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare phone: string | null

  @column()
  declare whatsapp: string | null

  @column()
  declare email: string | null

  @column()
  declare instagramUrl: string | null

  @column()
  declare facebookUrl: string | null

  @column()
  declare youtubeUrl: string | null

  @column()
  declare mapsUrl: string | null

  @column()
  declare openingHours: string | null

  @column()
  declare footerText: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
