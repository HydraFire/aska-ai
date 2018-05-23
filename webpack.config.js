const webpack = require('webpack');

require('dotenv').load();
console.log(process.env.HOSTNAME)

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/public/`
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
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
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    }),
    // env plugin
    new webpack.DefinePlugin({
      'process.env.HOSTNAME': JSON.stringify(process.env.HOSTNAME)
    })
  ],
  
  devServer: {
    contentBase: `${__dirname}/public`,
    compress: true,
    port: 8080
  }
};
