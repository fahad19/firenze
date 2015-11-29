/* eslint-disable new-cap */

var P = require('../../Promise');
var TimestampBehavior = require('../behaviors/Timestamp');
var Post = require('../models/Post');

module.exports = function (db) {
  return db.createCollectionClass({
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

    afterDelete: function (model) {
      model.set('_field', 'afterDelete');
      return new P.resolve(true);
    }
  });
};
