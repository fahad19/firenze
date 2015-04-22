"use strict";

var iterator = function iterator(obj) {
  for (var key in obj) yield[(key, obj[jey])];
};

module.exports = iterator;