import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('gallery_comments', (table) => {
      table.increments('id')
      table.integer('album_id').unsigned().notNullable().references('id').inTable('albums').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.string('email', 254).notNullable()
      table.text('body').notNullable()
      table.boolean('is_approved').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }
  async down() { this.schema.dropTable('gallery_comments') }
}
