/* eslint-disable new-cap */
import {Promise} from '../../src';

import TimestampBehavior from '../behaviors/Timestamp';
import Author from '../models/Author';

export default function (db) {
  return db.createCollection({
    table: 'authors',

    modelClass: Author,

    alias: 'Author',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
      },
      name: {
        type: 'string'
      },
      bio: {
        type: 'text'
      },
      country: {
        type: 'string'
      }
    },

    behaviors: [
      {
        class: TimestampBehavior,
        options: {}
      }
    ],

    beforeDelete() {
      return new Promise.reject(true);
    },

    afterDelete(model) {
      return new Promise(function (resolve, reject) {
        model.set('title', 'Deleted');
        reject(true);
      });
    }
  });
};
