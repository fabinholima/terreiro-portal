import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery(`
      UPDATE photos
      SET publication_authorized = true
      WHERE album_id IN (
        SELECT id FROM albums WHERE is_public = true
      )
    `)
  }

  async down() {
    // Correção de dados sem reversão automática para não ocultar fotos publicadas posteriormente.
  }
}
