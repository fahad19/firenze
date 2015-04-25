module.exports = function (db) {
  return db.Collection({
    table: 'authors',
    modelClass: require('../models/Author')
  });
};
