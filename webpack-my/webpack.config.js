const path = require('path');
const copyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js",
  },
  resolveLoader: {
    modules: ["node_modules", "./loader"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            // loader: path.resolve(__dirname, './loader/replaceLoader.js'),
            loader: "replaceLoader",
          },
          {
            loader: 'replaceAsynLoader',
            options: {
              name: '666666'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new copyrightWebpackPlugin({
      name: '啥啥啥'
    })
  ]
}