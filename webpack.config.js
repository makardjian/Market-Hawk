var path = require('path');
var INDEX_DIR = path.join(__dirname, '/client/src')
var PUBLIC_DIR = path.join(__dirname, '/public/');

module.exports = {
  entry: `${INDEX_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: PUBLIC_DIR
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        exclude: '/node_modules/',
        include : INDEX_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'env']
       }
      }
    ]
  }
};