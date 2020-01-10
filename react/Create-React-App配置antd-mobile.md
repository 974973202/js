### 使用Create-React-App脚手架搭建antd-mobile的开发环境

- npx create-react-app my-app cd my-app npm run eject
> npm run build 之后生成的打包文件只能在根目录访问，这样放在服务器目录就访问不到了，为了你们不要和我一样打包后在哭着百度解决方案，在这里一并放出：

- config文件夹下面找到paths.js文件，打开后大约在34~39行前后有如下代码：
```javascript
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}
```
- 将这句修改为：(仔细看，最后面的"/"前面加了一个".")
```javascript
const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : './');
```

- 下面进行LESS CSS预处理器配置，antd-mobile依赖LESS模块，不安装和配置好，样式是不会起作用的，在项目根目录运行如下命令：
```
  yarn add less less-loader --dev
```

> 注意: less 和 less-loader 都是需要安装的，不然在启动项目时就会报Error in Cannot find module 'less' 原因是npm @ 3不能再解析peerDependencies了，OK安装后，我们还要着手配置下，打开config文件夹中的webpack.config.dev.js或者webpack.config.js文件，搜索“exclude:”  找到大概这么一行
```
  exclude: [/.js$/, /.html$/, /.json$/], loader: require.resolve('file-loader')
  或
  { 
    loader: require.resolve('file-loader'), 
    exclude: [/.(js|mjs|jsx|ts|tsx)$/, /.html$/, /.json$/], 
    options: { 
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },

  在exclude: 后面的数组中加入一项   /.less$/   这行变为
    exclude: [/.js$/, /.html$/, /.json$/,/.less$/],
  或
    exclude: [/.(js|mjs|jsx|ts|tsx)$/, /.html$/, /.json$/, /.less$/],
```

- 然后找到如下代码
```
  {
    test: /.(js|mjs|jsx|ts|tsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve('babel-preset-react-app/webpack-overrides'),
      plugins: [
        ['import', { libraryName: 'antd-mobile', style: true }], //添加的 
        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
              },
            },
          },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: isEnvProduction,
      compact: isEnvProduction,
    },
  },
```
- 在plugins中添加 ['import', { libraryName: 'antd-mobile', style: true }],

- 在其最后一个花括号下加入
```
  {
    test: /.less$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'), {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          // https://webpack.js.org/guides/migrating/#complex-options 
          plugins: () => [pxtorem({ rootValue: 100, propWhiteList: [], }),
          autoprefixer({ browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'], }),],
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: { modifyVars: { "@primary-color": "#1DA57A" }, },
      },
    ],
  },
```
然后 yarn add babel-plugin-import --dev yarn add antd-mobile yarn start 运行完毕！！

