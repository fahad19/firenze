'use strict';

module.exports = function (db) {
  return db.Collection({
    table: 'posts',
    modelClass: require('../models/Post')
  });
};