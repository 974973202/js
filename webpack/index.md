## webpack
https://juejin.im/post/5e6f4b4e6fb9a07cd443d4a5

### Webpack 的构建流程主要有哪些环节  Webpack 打包的整个过程
1. 初始化参数：根据用户在命令窗口输入的参数以及 webpack.config.js 文件的配置，得到最后的配置。
2. 开始编译：根据上一步得到的最终配置初始化得到一个 compiler 对象，注册所有的插件 plugins，插件开始监听 webpack 构建过程的生命周期的环节（事件），不同的环节会有相应的处理，然后开始执行编译。
3. 确定入口：根据 webpack.config.js 文件中的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。
4. 编译模块：递归过程中，根据文件类型和 loader 配置，调用相应的 loader 对不同的文件做不同的转换处理，再找出该模块依赖的模块，然后递归本步骤，直到项目中依赖的所有模块都经过了本步骤的编译处理。
5. 编译过程中，有一系列的插件在不同的环节做相应的事情，比如 UglifyPlugin 会在 loader 转换递归完对结果使用 UglifyJs 压缩覆盖之前的结果；再比如 clean-webpack-plugin ，会在结果输出之前清除 dist 目录等等。
6. 完成编译并输出：递归结束后，得到每个文件结果，包含转换后的模块以及他们之间的依赖关系，根据 entry 以及 output 等配置生成代码块 chunk。
7. 打包完成：根据 output 输出所有的 chunk 到相应的文件目录

### Webpack的打包流程
1）webpack从项目的entry入口文件开始递归分析，调用所有配置的 loader对模块进行编译
因为webpack默认只能识别js代码，所以如css文件、.vue结尾的文件，必须要通过对应的loader解析成js代码后，webpack才能识别
2）利用babel(babylon)将js代码转化为ast抽象语法树，然后通过babel-traverse对ast进行遍历
3）遍历的目的找到文件的import引用节点
因为现在我们引入文件都是通过import的方式引入，所以找到了import节点，就找到了文件的依赖关系
4）同时每个模块生成一个唯一的id，并将解析过的模块缓存起来，如果其他地方也引入该模块，就无需重新解析，最后根据依赖关系生成依赖图谱
5）递归遍历所有依赖图谱的模块，组装成一个个包含多个模块的 Chunk(块)
6）最后将生成的文件输出到 output 的目录中

### Loader 和 Plugin 有哪些不同
Loader，文件加载器：对文件进行转换。主要是用来解析和检测对应资源，负责源文件从输入到输出的转换，它专注于实现资源模块加载
```js
const loaderUtils = require("loader-utils");
// 不能使用剪头函数
module.exports = function (source) {
  // console.log(this.query)
  const options = loaderUtils.getOptions(this);
  //定义⼀一个异步处理理
  // 通过this.async 返回一个异步loader 
  const callback = this.async();
  // 关掉loader缓存
  // this.cacheable(false)
  setTimeout(() => {
    const result = source.replace("webpack", options.name);
    callback(null, result);
  }, 3000);
};
```

Plugin，插件：扩展器增强功能。主要是通过webpack内部的钩子机制，在webpack构建的不同阶段执行一些额外的工作，它的插件是一个函数或者是一个包含apply方法的对象，接受一个compile对象，通过webpack的钩子来处理资源
```js
apply(compiler) {
    //hooks.emit 定义在某个时刻   
    // 同步的写法   
    // compiler.hooks.compile.tap
    // 异步的写法
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin", // 类
      (compilation, cb) => {
        console.log(compilation.assets, '123456789')
        compilation.assets["copyright.txt"] = {
          source: function () {
            return "hello copy";
          },
          size: function () {
            return 20;
          }
        };
        cb();
      }
    );
    
  }
```

### 常见webpack工具名称
- 抽离css：mini-css-extract-plugin
- 公共脚本分离：SplitChunksPlugin代替CommonsChunkPlugin webpack4内置
- uglify阶段删除⽆用代码：tree shaking
- 代码分割：scope hosting
- 多进程/多实例构建优化：HappyPack  thread-loader
- 并行压缩
  - 使用 parallel-uglify-plugin 插件
  - uglifyjs-webpack-plugin 开启 parallel 参数
  - terser-webpack-plugin 开启 parallel 参数
- 速度分析：speed-measure-webpack-plugin
- 体积分析: webpack-bundle-analyzer
- 预编译资源模块：使用DLLPlugin
- 基础库分离：html-webpack-externals-plugin
- 利用缓存：
 - babel-loader开启缓存
 - erser-webpack-plugin：开启缓存
 - 使用 cache-loader 或者 hard-source-webpack-plugin

### 为什么需要构建工具？
转换 ES6 语法
转换 JSX
CSS 前缀补全/预处理器
压缩混淆
图⽚压缩

### webpack调试代码问题用 source-map  平时构建用eval

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
5. Mode ⽤来指定当前的构建环境是：production、development 还是 none
 - 设置 mode 可以使⽤ webpack 内置的函数，默认值为 production
6. Mode 的内置函数功能
 - development 开启NamedChunksPlugin和NamedModulesPlugin（这两个插件在模块热更新阶段很实用，会在控制台打印出是哪个模块发生了热更新，模块路径）
 - production FlagDependencyUsagePlugin，FlagIncludeChunksPlugin，ModuleConcatnationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsFlagPlugin和TerserPlugin（这些插件会在生产阶段会默认做一些代码的压缩）
7. webpack 中的⽂件监听 是在发现资源代码发生改变时，自动重新构建出新的文件
 - 开启文件监听模式的2种方式：(**浏览器不会自动刷新，需手动刷新页面**)
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
      open: true,   // 是否在每次构建完成后自动开启浏览器窗口（如果命令里不带--open）
      hotOnly: true, // true为模块刷新，不刷新浏览器
      proxy: {
        "/api": {
          target: 'xxx'
        }
      },
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
- Scope Hoisting 代码分割
- Tree-shaking 摇树，擦除无用代码
- 公共资源分离 SplitChunksPlugin
- 图片压缩 
- 动态 Polyfill

### webpack打包分析
- 初级分析: webpack内置的stats(构建的统计信息)
 - 可以在 package.json 中使用 stats，也可以在 Node API 中使用 stats
```javascript
  webpack --config webpack.prod.js --json > stats.json
```

- 速度分析：speed-measure-webpack-plugin（分析整个打包总耗时&每个插件和loader的耗时情况）
```javascript
  const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
  const smp = new SpeedMeasurePlugin();

  const webpackConfig = smp.wrap({
    // ...
    plugins: [
      new MyPlugin(),
      new MyOtherPlugin()
    ]
  })
```

- 体积分析: webpack-bundle-analyzer分析依赖的第三方模块文件和业务里面的组件代码大小（可视化）
```javascript
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports = {
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
```

### webpack 速度优化
- 使用高版本的webpack
 - webpack4 增加了一个叫mode的配置项
 - production默认值会提供一系列有效的默认值以便部署应用
 - optimization.splitChunks总是启用

- 多进程构建
 - happypack：每次 webapck 解析一个模块，HappyPack 会将它及它的依赖分配给 worker 线程中
 ```javascript
  exports.plugins = [
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [ 'babel-loader' ]
    }),
    new HappyPack({
      id: 'styles',
      threads: 2,
      loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
    })
  ];

  exports.module.rules = [
    {
      test: /\.js$/,
      use: 'happypack/loader?id=jsx'
    },
    {
      test: /\.less$/,
      use: 'happypack/loader?id=styles'
    }
  ]
 ```

 - thread-loader：每次 webpack 解析一个模块，thread- loader 会将它及它的依赖分配给 worker 线程中
 ```javascript
 module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve("src"),
          use: [
          {
            loader: "thread-loader"
            options: {
              workers: 2  // worker的数量，默认是cpu核心数
            }
          }
        }
      ]
    }
  }
 ```

- 多进程并行压缩代码
 - terser-webpack-plugin：开启parallel参数
 ```javascript
  const TerserPlugin = require('terser-webpack-plugin');
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true
        })
      ]
    }
  }
 ```

- 预编译资源模块
 - 使用DLLPlugin 进行分包,DllReferencePlugin对manifest.json引用,将react,react-dom,redux,react-redux等基础包和业务基础包打包成一个文件
 webpack.dll.config.js文件:
 ```javascript
  const path = require('path');
  const webpack = require('webpack');
  module.exports = {
    context: process.cwd,
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.styl', '.css'],
      modules: [__dirname, 'node_modules']
    },
    entry: {
      vendor: [
        'react',
        'react-dom',
        'react-router-dom'
      ]
    },
    output: {
      path: path.resolve(__dirname, './dist/lib'),
      filename: '[name].js',
      library: '[name]'
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.resolve(__dirname, '.', '[name]-manifest.json'),
        name: '[name]'
      })
    ]
  };
 ```
 - 运行 webpack --config webpack.dll.config.js --mode production
 - 生成vendor-manifest.json文件
 - webpack.config.js文件:
 ```javascript
  module.exports = {
    plugins: [
      new webpack.DllReferencePlugin({
          manifest: require('./vendor-manifest.json')
        })
    ]
  }
 ```
 - html: <script type="text/javascript" src="./lib/vendor.js"></script>

- 基础库分离
 - 通过html-webpack-externals-plugin，然后在html里面直接引入组件库的cdn链接
 ```javascript
  const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
  moudles.export = {
    plugins: [
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry: '//11.url.cn/now/lib/16.2.0/react.min.js',
            global: 'React'
          }
        ]
      })
    ]
  }
 ```
 - html: <script type="text/javascript" src="https://11.url.cn/now/lib/16.2.0/react.min.js"></script>

- 利用缓存：第一次构建花费正常的时间，第二次构建速度将显著加快
 - babel-loader开启缓存
 ```javascript
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: 'node_modules',
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  }
 ```

 - erser-webpack-plugin：开启缓存
 ```javascript
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true
        })
      ]
    }
  }
 ```

 - 使用 cache-loader 或者 hard-source-webpack-plugin
 ```javascript
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            'cache-loader',
            'babel-loader'
          ],
          include: path.resolve('src')
        }
      ]
    }
  }
 ```

- 缩小构建目标
 - babel-loader不解析node-modules   exclude: "node-modules"
 - 减少文件搜索范围

### 体积优化
- Scope Hoisting
 - 将所有模块的代码按照引⽤顺序放在⼀个函数作⽤域里，然后适当的重命名⼀些变量以防⽌变量名冲突
 - webpack4  mode 为 production 默认开启
 - plugins: [ new webpack.optimize.ModuleConcatenationPlugin() ]

- 使用Tree shaking擦除无用的javaScript和css
 - 概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到 bundle ⾥去，tree shaking 就是只把用到的方法打⼊ bundle ，没⽤到的方法会在 uglify 阶段被擦除掉
 - 使⽤：webpack production mode的情况下默认开启
 - 要求： 必须是 ES6 的语法，CJS的方式不支持

- CSS：purgecss-webpack-plugin 和 mini-css-extract-plugin 配合使用

- 图片压缩  配置image-webpack-loade
 - loader: "image-webpack-loader"

- 使用动态polyfill-service或者browserlist
 - 根据浏览器的UA来判断当前浏览器缺失哪些特性，进而进行补强