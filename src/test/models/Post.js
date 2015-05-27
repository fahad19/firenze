/*eslint camelcase: [2, {properties: "never"}]*/
var P = require('bluebird');

module.exports = function (db) {
  return db.createModelClass({
    alias: 'Post',

    displayField: 'title',

    schema: {
      id: {
        type: 'increments'
      },
      author_id: {
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
      }
    },

    collectionClass: function () {
      return require('../collections/Posts')(db);
    },

    afterDelete: function () {
      this.set('_field', 'afterDelete');
      return new P.resolve(true);
    }
  });
};
