const webpack = require('webpack');

module.exports = {
  entry: [ 'regenerator-runtime/runtime', './src/index.js' ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '*', '.js' ]
  },
  output: {
    path: __dirname + '/js',
    publicPath: '/',
    filename: 'app.js'
  },
  devtool: 'inline-source-map',
  watch: true,
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ]
};
