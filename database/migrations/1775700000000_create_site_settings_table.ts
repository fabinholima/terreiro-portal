import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'site_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('site_name', 180).notNullable().defaultTo('Terreiro de Umbanda Oxóssi e João Boiadeiro')
      table.string('site_subtitle', 180).nullable()
      table.string('address', 255).nullable()
      table.string('city', 120).nullable()
      table.string('state', 2).nullable()
      table.string('postal_code', 12).nullable()
      table.string('phone', 40).nullable()
      table.string('whatsapp', 40).nullable()
      table.string('email', 180).nullable()
      table.string('instagram_url', 500).nullable()
      table.string('facebook_url', 500).nullable()
      table.string('youtube_url', 500).nullable()
      table.string('maps_url', 1000).nullable()
      table.text('opening_hours').nullable()
      table.text('footer_text').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
