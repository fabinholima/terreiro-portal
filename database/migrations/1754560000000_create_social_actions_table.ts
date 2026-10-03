import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 180).notNullable()
      table.string('slug', 200).notNullable().unique()
      table.text('description').nullable()
      table.string('status', 30).notNullable().defaultTo('planned')
      table.decimal('goal', 12, 2).nullable()
      table.decimal('current_value', 12, 2).nullable()
      table.string('unit', 80).nullable()
      table.timestamp('starts_at', { useTz: true }).nullable()
      table.timestamp('ends_at', { useTz: true }).nullable()
      table.boolean('is_public').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
