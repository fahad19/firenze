module.exports = function (db) {
  return db.createCollectionClass({
    table: 'authors',

    modelClass: function () {
      return require('../models/Author')(db);
    }
  });
};
