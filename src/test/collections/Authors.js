module.exports = function (db) {
  return db.Collection({
    table: 'authors',

    modelClass: function () {
      require('../models/Author')(db)
    }
  });
};
