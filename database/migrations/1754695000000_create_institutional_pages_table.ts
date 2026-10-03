import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'institutional_pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug', 80).notNullable().unique()
      table.string('title', 180).notNullable()
      table.string('eyebrow', 120).nullable()
      table.text('summary').nullable()
      table.text('body').notNullable()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
