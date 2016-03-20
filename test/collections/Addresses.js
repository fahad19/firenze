/* eslint-disable new-cap */
export default function (db) {
  return db.createCollection({
    table: 'addresses',

    alias: 'Address',

    displayField: 'description',

    schema: {
      id: {
        type: 'increments'
      },
      author_id: {
        type: 'integer'
      },
      description: {
        type: 'string'
      }
    }
  });
}
