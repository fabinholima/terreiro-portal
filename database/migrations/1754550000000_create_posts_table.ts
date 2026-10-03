import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.text('summary').nullable()
      table.text('body').nullable()
      table.string('status', 30).notNullable().defaultTo('draft')
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
