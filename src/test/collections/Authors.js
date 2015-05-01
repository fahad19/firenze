module.exports = function (db) {
  return db.Collection({
    table: 'authors',

    modelClass: function () {
      return require('../models/Author')(db);
    }
  });
};
