module.exports = function (db) {
  return db.Model({
    alias: 'Post',

    schema: {
      id: {
        type: 'integer'
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
    }
  });
};
