import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'site_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('home_eyebrow', 120).nullable()
      table.string('home_title', 180).nullable()
      table.string('home_summary', 255).nullable()
      table.string('mission_title', 120).nullable()
      table.text('mission_text').nullable()
      table.boolean('mission_visible').notNullable().defaultTo(true)
      table.string('values_title', 120).nullable()
      table.text('values_text').nullable()
      table.boolean('values_visible').notNullable().defaultTo(true)
      table.string('trajectory_title', 120).nullable()
      table.text('trajectory_text').nullable()
      table.boolean('trajectory_visible').notNullable().defaultTo(true)
      table.string('trajectory_button_text', 120).nullable()
      table.string('trajectory_button_url', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'home_eyebrow',
        'home_title',
        'home_summary',
        'mission_title',
        'mission_text',
        'mission_visible',
        'values_title',
        'values_text',
        'values_visible',
        'trajectory_title',
        'trajectory_text',
        'trajectory_visible',
        'trajectory_button_text',
        'trajectory_button_url'
      )
    })
  }
}
