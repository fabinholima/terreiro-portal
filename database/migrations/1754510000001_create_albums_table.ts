import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('albums', (table) => {
      table.increments('id')
      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.text('description').nullable()
      table.date('event_date').nullable()
      table.string('cover_path', 500).nullable()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('photos', (table) => {
      table.increments('id')
      table.integer('album_id').unsigned().notNullable().references('id').inTable('albums').onDelete('CASCADE')
      table.string('path', 500).notNullable()
      table.string('caption', 255).nullable()
      table.string('alt_text', 255).nullable()
      table.string('credit', 180).nullable()
      table.boolean('publication_authorized').notNullable().defaultTo(false)
      table.integer('position').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('photos')
    this.schema.dropTable('albums')
  }
}
