import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_actions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('image_path', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image_path')
    })
  }
}
