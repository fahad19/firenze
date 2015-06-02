if (typeof Map === 'function') {
  module.exports = require('./src');
} else {
  module.exports = require('./lib');
}
