/* eslint-disable new-cap */
import {Promise} from '../../src';

import City from '../models/City';

export default function (db) {
  return db.createCollection({
    table: 'cities',

    modelClass: City,

    alias: 'City',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
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
    }
  });
};
