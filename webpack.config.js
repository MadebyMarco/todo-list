const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    dom: './src/dom.js',
    logic: './src/logic.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};