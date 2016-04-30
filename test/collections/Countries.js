/* eslint-disable new-cap */
export default function (db) {
  return db.createCollection({
    table: 'countries',

    alias: 'Country',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
      },
      name: {
        type: 'string'
      }
    }
  });
}
