module.exports = function (db) {
  return db.createModelClass({
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
      }
    },

    collectionClass: function () {
      return require('../collections/Authors')(db);
    }
  });
};
