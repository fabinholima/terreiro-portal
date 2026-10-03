import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role', 20).notNullable().defaultTo('editor')
      table.boolean('is_active').notNullable().defaultTo(true)
    })

    // As contas já existentes passam a ser administradoras para não bloquear o painel.
    this.defer(async (db) => {
      await db.from(this.tableName).update({ role: 'admin', is_active: true })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('is_active')
    })
  }
}
