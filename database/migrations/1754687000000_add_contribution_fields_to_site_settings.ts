import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'site_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('contribution_visible').notNullable().defaultTo(false)
      table.string('contribution_title', 120).nullable()
      table.text('contribution_text').nullable()
      table.string('pix_key', 255).nullable()
      table.string('pix_beneficiary', 180).nullable()
      table.string('pix_qr_code_path', 500).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'contribution_visible',
        'contribution_title',
        'contribution_text',
        'pix_key',
        'pix_beneficiary',
        'pix_qr_code_path'
      )
    })
  }
}
