/* eslint-disable new-cap */
import {Promise} from '../../';

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
        type: 'increments',
        primary: true
      },
      author_id: { //eslint-disable-line
        type: 'integer',
        nullable: true
      },
      title: {
        type: 'string',
        nullable: false,
        unique: true,
        length: 100
      },
      body: {
        type: 'text',
        nullable: true,
        default: null
      },
      views: {
        type: 'integer',
        unsigned: true,
        default: 0
      },
      note: {
        type: 'string',
        comment: 'extra notes'
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
}
