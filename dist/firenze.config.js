var filename = __filename.split('/').pop().replace(/\.config\.js/, '.js');
var fullConfig = require('./firenze.full.config');
var _ = require('lodash');

module.exports = _.merge(fullConfig, {
  output: {
    path: __dirname,
    filename: filename
  },
  externals: {
    lodash: '_',
    bluebird: 'P',
    async: 'async',
    validator: 'validator'
  }
});
