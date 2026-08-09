import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('menus', (table) => {
      table.increments('id')
      table.string('name', 120).notNullable()
      table.string('location', 40).notNullable().unique()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('menu_items', (table) => {
      table.increments('id')
      table.integer('menu_id').unsigned().references('id').inTable('menus').onDelete('CASCADE').notNullable()
      table.integer('parent_id').unsigned().references('id').inTable('menu_items').onDelete('CASCADE').nullable()
      table.string('label', 80).notNullable()
      table.string('type', 20).notNullable().defaultTo('url')
      table.integer('page_id').unsigned().references('id').inTable('institutional_pages').onDelete('SET NULL').nullable()
      table.string('url', 500).nullable()
      table.integer('position').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)
      table.boolean('open_new_tab').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('menu_items')
    this.schema.dropTable('menus')
  }
}
