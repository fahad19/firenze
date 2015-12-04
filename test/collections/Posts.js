/* eslint-disable new-cap */
import {Promise} from '../../src';

import TimestampBehavior from '../behaviors/Timestamp';
import Post from '../models/Post';

export default function (db) {
  return db.createCollection({
    table: 'posts',

    modelClass: Post,

    alias: 'Post',

    displayField: 'title',

    schema: {
      id: {
        type: 'increments'
      },
      author_id: { //eslint-disable-line
        type: 'integer'
      },
      title: {
        type: 'string'
      },
      body: {
        type: 'text'
      },
      views: {
        type: 'integer'
      },
      note: {
        type: 'string'
      },
      created: {
        type: 'datetime'
      },
      updated: {
        type: 'datetime'
      }
    },

    behaviors: [
      TimestampBehavior
    ],

    afterDelete(model) {
      model.set('_field', 'afterDelete');
      return new Promise.resolve(true);
    }
  });
};
