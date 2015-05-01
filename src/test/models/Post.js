module.exports = function (db) {
  return db.Model({
    alias: 'Post',

    schema: {
      id: {
        type: 'integer' //'increments'
      },
      author_id: {
        type: 'integer'
      },
      title: {
        type: 'string'
      },
      body: {
        type: 'text'
      }
    },

    collectionClass: function () {
      return require('../collections/Posts')(db);
    }
  });
};
