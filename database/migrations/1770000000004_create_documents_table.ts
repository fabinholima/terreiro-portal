import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('category', 100).nullable()
      table.string('version', 40).nullable()
      table.date('document_date').nullable()
      table.text('description').nullable()
      table.string('file_path', 500).nullable()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
