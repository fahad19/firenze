/* eslint-disable new-cap */
import {Promise} from '../../';

import TimestampBehavior from '../behaviors/Timestamp';
import Author from '../models/Author';
import makeAddresses from './Addresses';

export default function (db) {
  const Addresses = makeAddresses(db);

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
      },
      created: {
        type: 'datetime'
      },
      updated: {
        type: 'datetime'
      }
    },

    behaviors: [
      {
        class: TimestampBehavior,
        options: {}
      }
    ],

    address() {
      return this.association()
        .oneToOne(Addresses)
        .joinColumn('Author.id', 'Address.author_id')
        .collection();
    },

    posts() {
      const makePosts = require('./Posts').default;
      const Posts = makePosts(db);

      return this.association()
        .oneToMany(Posts)
        .joinColumn('Author.id', 'Post.author_id')
        .collection();
    },

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
}
