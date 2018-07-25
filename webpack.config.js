const webpack = require('webpack');

require('dotenv').load();

console.log(process.env.DEVICE);
console.log(process.env.HOSTNAME);

let entry = './src/index.js';
let filename = 'bundle.js';
if (process.env.DEVICE === 'Mobile') {
  entry = './mobile/index.js';
  filename = 'mobile-bundle.js';
}

module.exports = {
  devtool: 'source-map',
  entry,
  output: {
    filename,
    path: `${__dirname}/public/`
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2016']
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    // uglify js
    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    }),
    */
    // env plugin

    new webpack.DefinePlugin({
      'process.env.HOSTNAME': JSON.stringify(process.env.HOSTNAME)
    })
  ]
};
