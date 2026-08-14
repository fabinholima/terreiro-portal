import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('featured_image_width').nullable()
      table.integer('featured_image_height').nullable()
      table.string('featured_image_fit', 20).notNullable().defaultTo('contain')
      table.integer('content_image_width').nullable()
      table.integer('content_image_height').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'featured_image_width',
        'featured_image_height',
        'featured_image_fit',
        'content_image_width',
        'content_image_height'
      )
    })
  }
}
