/* eslint-disable new-cap */
import City from '../models/City';
import makeCountries from './Countries';

export default function (db) {
  const Countries = makeCountries(db);

  return db.createCollection({
    table: 'cities',

    modelClass: City,

    alias: 'City',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
      },
      country_id: {
        type: 'integer'
      },
      name: {
        type: 'string'
      },
      description: {
        type: 'text'
      },
      population: {
        type: 'integer'
      }
    },

    country: function () {
      return this.association()
        .manyToOne(Countries)
        .joinColumn('City.country_id', 'Country.id')
        .collection();
    }
  });
}
