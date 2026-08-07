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

  @column()
  declare homeEyebrow: string | null

  @column()
  declare homeTitle: string | null

  @column()
  declare homeSummary: string | null

  @column()
  declare missionTitle: string | null

  @column()
  declare missionText: string | null

  @column()
  declare missionVisible: boolean

  @column()
  declare valuesTitle: string | null

  @column()
  declare valuesText: string | null

  @column()
  declare valuesVisible: boolean

  @column()
  declare trajectoryTitle: string | null

  @column()
  declare trajectoryText: string | null

  @column()
  declare trajectoryVisible: boolean

  @column()
  declare trajectoryButtonText: string | null

  @column()
  declare trajectoryButtonUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
