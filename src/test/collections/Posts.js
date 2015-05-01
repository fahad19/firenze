module.exports = function (db) {
  return db.Collection({
    table: 'posts',

    modelClass: function () {
      return require('../models/Post')(db)
    }
  });
};
