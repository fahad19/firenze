var filename = __filename.split('/').pop().replace(/\.config\.js/, '.js');

module.exports = {
  entry: __dirname + '/../lib',
  output: {
    path: __dirname,
    filename: filename
  },
  output: {
    libraryTarget: 'this',
    library: 'firenze'
  },
  resolve: {
    extensions: [
      '',
      '.js'
    ]
  }
};
