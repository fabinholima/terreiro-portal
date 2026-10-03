import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.text('description').nullable()
      table.string('category', 80).nullable()
      table.timestamp('starts_at', { useTz: true }).notNullable()
      table.timestamp('ends_at', { useTz: true }).nullable()
      table.string('location', 200).nullable()
      table.string('status', 30).notNullable().defaultTo('scheduled')
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
