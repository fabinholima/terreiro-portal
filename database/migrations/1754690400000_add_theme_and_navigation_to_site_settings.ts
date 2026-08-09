import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'site_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('theme_primary', 20).notNullable().defaultTo('#1E4620')
      table.string('theme_dark', 20).notNullable().defaultTo('#08351F')
      table.string('theme_accent', 20).notNullable().defaultTo('#D6A23C')
      table.string('theme_background', 20).notNullable().defaultTo('#FFFDF9')
      table.string('theme_text', 20).notNullable().defaultTo('#223028')
      table.string('font_heading', 80).notNullable().defaultTo('Georgia')
      table.string('font_body', 80).notNullable().defaultTo('Inter')
      table.string('font_ui', 80).notNullable().defaultTo('Inter')
      table.integer('font_size_base').notNullable().defaultTo(16)
      table.integer('heading_weight').notNullable().defaultTo(600)
      table.text('public_menu_config').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('theme_primary','theme_dark','theme_accent','theme_background','theme_text','font_heading','font_body','font_ui','font_size_base','heading_weight','public_menu_config')
    })
  }
}
