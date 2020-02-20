## webpack
### 为什么需要构建工具？
转换 ES6 语法
转换 JSX
CSS 前缀补全/预处理器
压缩混淆
图⽚压缩

### 配置文件名称
- webpack 默认配置⽂件：webpack.config.js
- 可以通过webpack --config指定配置⽂件

### webpack 配置组成
```javascript
module.exports = {
  entry: './src/index.js', // 打包的⼊⼝⽂件
  output: './dist/main.js', // 打包的输出
  mode: 'production', // 环境
  module: {
    rules: [ // Loader 配置
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [], // 插件配置
}
```

### 安装webpack和webpack-cli
- 创建空⽬录和package.json
- 安装webpack和webpack-cli
```
  npm install webpack webpack-cli --save-dev
  检查是否安装成功：./node_modules/.bin/webpack -v
```
- 通过npm run build运⾏构建webpack，原理：模块局部安装会在node_modules/.bin ⽬录创建软链接

### 核心概念
1. Entry⽤来指定 webpack 的打包⼊⼝
2. Output⽤来告诉 webpack 如何将编译后的⽂件输出到磁盘
3. Loaders webpack 开箱即用只支持 JS 和 JSON 两种文件类型，通过 Loaders 去支持其它文
件类型并且把它们转化成有效的模块，并且可以添加到依赖图中。
  - 本身是一个函数，接受源文件作为参数，返回转换的结果。
4. Plugins 插件⽤于 bundle ⽂件的优化，资源管理和环境变量注⼊。作⽤于整个构建过程
```javascript
CommonsChunkPlugin // 将chunks相同的模块代码提取成公共js
CleanWebpackPlugin // 清理构建目录
ExtracTextWebpackPlugin // 将CSS文件从bunlde文件里提取成一个独立的CSS文件
CopyWebpackPlugin // 将文件或者文件夹拷贝到构建的输出目录
HtmlWebpackPlugin // 创建html文件去承载输出的bunlde
UglifyjsWebpackPlugin // 压缩js
ZipWebpackPlugin // 将打包出的资源生成一个zip包
```
5. Mode ⽤来指定当前的构建环境是：production、development 还是 none
 - 设置 mode 可以使⽤ webpack 内置的函数，默认值为 production
6. Mode 的内置函数功能
 - development 开启NamedChunksPlugin和NamedModulesPlugin（这两个插件在模块热更新阶段很实用，会在控制台打印出是哪个模块发生了热更新，模块路径）
 - production FlagDependencyUsagePlugin，FlagIncludeChunksPlugin，ModuleConcatnationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsFlagPlugin和TerserPlugin（这些插件会在生产阶段会默认做一些代码的压缩）
7. webpack 中的⽂件监听 是在发现资源代码发生改变时，自动重新构建出新的文件
 - 开启文件监听模式的2种方式：(浏览器不会自动刷新，需手动刷新页面)
 - 1. webpack --watch
 - 2. 在配置webpack.config.js 文件中添加watch: true
 ```javascript
  module.exports = {
		// 默认false，也就是不开启
		watch: true,
		// 只有当开启监听模式时，watchOptions才会有效
		watchOptions: {    
			ignored: /node_modules/,    //（默认为空） 不监听的文件或者文件夹，支持正则匹配
			aggregateTimeout: 300，   //（默认值300） 监听到文件变化后等300毫秒再去执行
			poll: 1000   //，默认每秒询问文件有没有变化1000次
		}
  }
 ```
8. ⽂件监听的原理分析
 - 轮询判断⽂件的最后编辑时间是否变化
 - 某个⽂件发⽣了变化，并不会⽴刻告诉监听者，⽽是先缓存起来，等aggregateTimeout

### 热更新
1. webpack-dev-server
 - 使用WDS不用手动刷新浏览器
 - WDS不会输出文件，而是存放在内存中（输出的放在内存里面，而不是像watch输出放在本地磁盘文件里，所以WDS的构建速度较快）
 - WDS结合HotModeuleReplacementPlugin插件使用
 - webpack-dev-server --open每次构建完成后自动开启浏览器窗口
 ```javascript
  module.exports = {
		// .....
	 	plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      contentBase: './dist',     //  服务的基本目录
      hot: true,     // 是否热更新
      open: true    // 是否在每次构建完成后自动开启浏览器窗口（如果命令里不带--open）
    }
  }
 ```
2. webpack-dev-middleware
 - WDM将webpack输出文件传输给服务器，适用于灵活的定制场景
```javascript
  const express = require('express');
  const webpack = require('webpack');
  const webpackDevMiddleware= require('webpack-dev-middleware');
  const app = express();
  const config = require('./webpack.config.js');const compiler = webpack(config);app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!\n');
  });
```

### 热更新的原理分析
 1. webpack Compile(编译器)：将js原代码编译成打包好输出的文件（Bundle）
 2. HMR Server：将热更新文件传输给HMR Runtime
 3. Bundle Server： 提供文件中在浏览器的访问（正常在浏览器上访问是通过文件路径访问，通过webpack热更新可以通过服务器访问，比如localhost：8080/bundle.js）
 4. HMR Runtime ： 会注入到浏览器与服务器建立连接，更新为文件变化

### ⽂件指纹
 1. 文件指纹指的是打包输出的文件名后缀(就是hash)
 - 作用：
 - 1. 版本的管理（比如项目发布的时候，只需要把改变后的文件发布上去）
 - 2. 设置文件指纹后，对于没有修改的文件可以用浏览器本地缓存，加速页面的访问

 2. 3种常见的文件指纹：
 - 1. Hash 和整个项目的构建相关，只要项目文件有修改，这个项目构建的hash值就会改变（比如，有a,b两个页面，我修改了a页面的js，那么b页面的js文件后缀(即hash)也会发生变化。其实没有必要的）
 - 2. Chunkhash 和webpack打包的chunk有关，不同的entry会生成不同的chunkhash 值
 - 3. Contenhash 根据文件内容来定义hash，文件内容不变，则contenthash不变（一般css文件使用contenthash）

 3. js的文件指纹设置：设置output的filename，使用[chunkhash]
 ```javascript
  module.exports = {
		entry: {
			app : './src/app.js',
			search: './src/search.js'
		},
		output: {
			filename: '[name].[chunkhash:8].js',
			path: __dirname + '/dist'
		}
  }
 ```

 4. css的文件指纹：
 - npm i mini-css-extract-plugin -D
 - 设置MiniCssExtract Plugin的filename
 - 使用[contenthash]
 ```javascript
  module.exports = {
    // ...
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniExtractPlugin.loader,  //取代style-loader
            'css-loader'
          ]
        }
      ]
 	  },
   	plugins: [
   		new MiniExtractPlugin({
   			filename: '[name][contenthash:8].css'      // 指定hash值有几位
   		})
   	]
  }
 ```

 5. 注意：chunkhash无法与热更新HotModuleReplacementPlugin一起使用

### 代码压缩
1. html⽂件的压缩
 - npm i html-webpack-plugin -D 设置压缩参数
2. CSS压缩
- npm i optimize-css-assets-webpack-plugin cssnano -D
- 使用optimize-css-assets-webpack-plugin 同时使用cssnanocss处理器
```javascript
  module.exports = {
		// .....
		plugins: [
			new OptimizeCssAssetsWebpackPlugin({
				assetNameRegExp: /\.css$/g,
				cssProcessor: require('cssnano')
			})
		]
  }
```
3. JS压缩
- 在webpack4里面，mode: 'production'模式下其实webpack内置了uglifyjs-webpack-plugin,默认打包出来的文件是进行压缩过的。所以不需要配置

### 补齐css
 - autoprefixer ⾃动补⻬ CSS3 前缀

### 响应式布局 
1. 使⽤px2rem-loader
2. [使⽤⼿淘的lib-flexible库]https://github.com/amfe/lib-flexible

### 资源内联的意义
1. 代码层⾯：⻚⾯框架的初始化脚本, 上报相关打点,  css 内联避免⻚⾯闪动
2. 请求层⾯：减少 HTTP ⽹络请求数 ⼩图⽚或者字体内联 (url-loader)

### HTML 和 JS 内联
1. raw-loader 内联 html
```javascript
<script>${require(' raw-loader!babel-loader!. /meta.html')}</script>
```
2. raw-loader 内联 JS
```javascript
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>
```

### CSS 内联
1. ⽅案⼀：借助 style-loader
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top', // 样式插入到 <head>
              singleton: true, //将所有的style标签合并成一个
            }
          },
          "css-loader",
          "sass-loader"
        ],
      },
    ]
  },
};
```
2. ⽅案⼆：html-inline-css-webpack-plugin

### 多⻚⾯打包
1. 多⻚⾯应⽤(MPA)概念
- 每⼀次⻚⾯跳转的时候，后台服务器都会给返回⼀个新的 html ⽂档，这种类型的⽹站也就是多⻚⽹站，也叫做多⻚应⽤
2. 多⻚⾯打包基本思路
- 每个⻚⾯对应⼀个 entry，⼀个 html-webpack-plugin
```javascript
module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  }
};
```
- 缺点：每次新增或删除⻚⾯需要改 webpack 配置
3. 多⻚⾯打包通⽤⽅案
- 动态获取 entry 和设置 html-webpack-plugin 数量
- 利⽤ glob.sync 
```javascript
  entry: glob.sync(path.join(__dirname, './src/*/index.js')),
```

### 基础库分离
1. 思路：将 react、react-dom 基础包通过 cdn 引⼊，不打⼊ bundle 中 
2. ⽅法：使⽤ html-webpack-externals-plugin
```javascript
  new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: 'react',
        entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        global: 'React',
      },
      {
        module: 'react-dom',
        entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        global: 'ReactDOM',
      },
    ],
  }),
```

### 公共脚本分离
1. 利⽤ SplitChunksPlugin 进⾏公共脚本分离
- Webpack4 内置的，替代CommonsChunkPlugin插件
- chunks 参数说明：
	- async 异步引⼊入的库进⾏行行分离(默认)
	- initial 同步引⼊入的库进⾏行行分离
	- all 所有引⼊入的库进⾏行行分离(推荐)
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000, // 文件多大进行打包
      maxSize: 0,
      minChunks: 1, // 应用超过几次进行打包
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
};
```
2. 利⽤ SplitChunksPlugin 分离基础包
- minChunks: 设置最⼩引⽤次数为2次
- minuSize: 分离的包体积的⼤⼩
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
};
```

### tree shaking(摇树优化)
- 概念：1 个模块可能有多个⽅法，只要其中的某个⽅法使⽤到了，则整个⽂件都会被打到
bundle ⾥⾯去，tree shaking 就是只把⽤到的⽅法打⼊ bundle ，没⽤到的⽅法会在
uglify 阶段被擦除掉
- 使⽤：webpack 默认⽀持，在 .babelrc ⾥设置 modules: false 即可production mode的情况下默认开启
- 要求：必须是 ES6 的语法，CJS 的⽅式不⽀持

### Tree-shaking 原理
- 利用 ES6 模块的特点:
	- 只能作为模块顶层的语句出现
	- import 的模块名只能是字符串常量
	- import binding 是 immutable的
- 代码擦除： uglify 阶段删除⽆用代码

### 代码分割
1. scope hosting
- 原理：将所有模块的代码按照引⽤顺序放在⼀个函数作用域里，然后适当的重命名⼀些变量以防⽌变量名冲突
- 对比: 通过 scope hosting 可以减少函数声明代码和内存开销
2. scope hosting 使用
- webpack mode 为 production 默认开启
- 必须是 ES6 语法，CJS(CommonJS) 不支持
3. 代码分割的意义
- 抽离相同代码到⼀个共享块
- 脚本懒加载，使得初始下载的代码更小

### 懒加载JS脚本的方式
1. CommonJS：require.ensure
2. ES6：动态import（⽬前还没有原⽣⽀持，需要babel转换）
 - 如何使⽤动态import?
 ```
  安装babel 插件npm install @babel/plugin-syntax-dynamic-import --save-dev
  ES6：动态import（⽬前还没有原⽣⽀持，需要babel转换）
  {
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
 ```

### webpack 制定ESLint规范
1. ⽅案⼀：webpack 与CI/CD集成
 - 本地开发阶段增加precommit钩⼦
 - 安装husky  npm install husky --save-dev
 - 增加npmscript，通过lint-staged增量检查修改的⽂件
```javascript
"scripts": {
  "precommit": "lint-staged"
},
"lint-staged": {
  "linters": {
    "*.{js,scss}": ["eslint --fix", "git add"]
  }
}
```

2. ⽅案⼆：webpack 与ESLint集成
 使⽤eslint-loader，构建时检查JS规范
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          "eslint-loader"
        ]
      }
    ]
  }
}
```

### webpack ssr
- 打包存在的问题
1. 浏览器的全局变量(Node.js中没有document, window)
  - 组件适配：将不兼容的组件根据打包环境进⾏适配
  - 请求适配：将fetch或者ajax发送请求的写法改成isomorphic-fetch或者axios
2. 样式问题(Node.js⽆法解析css)
 - ⽅案⼀：服务端打包通过ignore-loader 忽略掉CSS的解析
 - ⽅案⼆：将style-loader 替换成isomorphic-style-loader 

* 如何解决样式不显示的问题？
  - 使⽤打包出来的浏览器端html为模板设置占位符，动态插⼊组件
* ⾸屏数据如何处理？
  - 服务端获取数据
  - 替换占位符

### 当前构建时的⽇志显示
1. 展示⼀⼤堆⽇志，很多并不需要开发者关注
2. 统计信息 stats
> "errors-only" 只在发生错误时输出
> "minimal" 只在发生错误或有新的编译时输出
> "none" 没有输出
> "normal" 标准输出
> "verbose" 全部输出  

### 如何优化命令⾏的构建⽇志
- 使⽤friendly-errors-webpack-plugin
- success: 构建成功的⽇志提示
- warning: 构建警告的⽇志提示
- error: 构建报错的⽇志提示
- stats 设置成errors-only
```javascript
plugins: [
  new FriendlyErrorsWebpackPlugin() 
],
stats: 'errors-only'
```

### 如何主动捕获并处理构建错误？
- compiler 在每次构建结束后会触发done这个hook
- process.exit主动处理构建报错
```javascript
function () {
  this.hooks.done.tap('done', (stats) => {
    if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
      console.log('build error');process.exit(1);
    }
  })
}
```

### 发布到 npm 
> 添加用户： npm adduser 
> 升级版本 
> 升级补丁版本号：npm version patch 
> 升级小版本号：npm version minor 
> 升级大版本号：npm version major 
> 发布版本：npm publish

### 多进程/多实例构建优化
- 使用 HappyPack 解析资源
- 使用 thread-loader 解析资源
 - 原理：每次 webpack 解析一个模块，thread- loader 会将它及它的依赖分配给 worker 线程中

### 并行压缩
- 使用 parallel-uglify-plugin 插件
- uglifyjs-webpack-plugin 开启 parallel 参数
- terser-webpack-plugin 开启 parallel 参数

### DLLPlugin分包
### 缓存
- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存
- 使用 cache-loader 或者 hard-source-webpack-plugin

### 体积优化策略总结 
- Scope Hoisting 
- Tree-shaking 
- 公共资源分离 
- 图片压缩 
- 动态 Polyfill