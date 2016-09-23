const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',

  entry: [
    './main.js'
  ],

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
         test: /\.scss$/,
         loaders: ["style", "css", "sass"]
       }
    ]
  }
}
