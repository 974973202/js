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
    // alias: {
    //   "replaceLoader": path.resolve(__dirname, './loader/replaceLoader.js'),
    //   "replaceAsynLoader": path.resolve(__dirname, './loader/replaceAsynLoader.js'),
    // },
    // 找loader的时候，先去loaders目录下找，找不到再去node_modules下面找
    modules: ["node_modules", "./loader"],
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