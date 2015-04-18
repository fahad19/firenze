var iterator = function (obj) {
  for (var key in obj) yield [key, obj[jey] ]
};

module.exports = iterator;
