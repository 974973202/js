css 选择器优先级
important > style > id > class = [] = : > p = :: > *

bfc
1. 决定元素内容如何定位
2. 与其他元素的相互作用关系

触发条件
overflow: hidden, float: left/right; 
处于同一个bfc下，元素上下之间可能发生重叠

bfc解决的问题
1. 垂直外边距重叠问题
2. 去除浮动，
3. 两列布局

css 清除浮动
clear: both;
overflow: hidden;
::after {
  content: '',
  clear: both,
  display: block,
}

伪元素和伪类的区别：
伪元素创建一个文档树外的元素 :: after before
伪类是操作文档树已有的元素 :

flex:
flex是flex-grow 最大比例 flex-shrink 最小比例 flex-basis 多余空间

css 动画
transition animation的区别
transition不能立即执行
animation 不能用事件触发

灵活的用animation
from to 效果的用transition

css3D  transform-style: preserve-3d;

js动画和css动画的区别
js实现的是帧动画
css实现的是补间动画

补间动画一般只经过合成线程compositor thread,
而帧动画要先经过main thread的处理然后经过compositor thread合成线程

DOMContentLoaded
如果页面存在css和js并且js在css后面，则DOMContentLoaded会在css加载完后执行
其他情况DOMContentLoaded都不会等待css加载。html加载完便执行

同源策略，域名协议端口

http1.0和http1.1
1. 缓存处理 - 强缓存和协商缓存 - 
http1.0使用If-Modified-Since, Expires; 
http1.1使用Entity Etag，
If-Unmodified-Since, If-Match, If-None-Match
2. 带宽优化及网络连接的使用
3. 错误通知的管理
4. Host头处理
5. 长连接

http2.0和http1.x的区别
1. 新的二进制格式传输数据
2. 多路复用 。。。。 
3. header压缩
4. 服务端推送

http缓存
强缓存（200）大于协商缓存（304）

强缓存
http1.0 Expires
http1.1 Cache-control

Cache-control指定指令来实现缓存机制
- private 客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age=t：缓存内容将在t秒后失效
- no-cache：需要使用协商缓存来验证缓存数据
- no-store：所有内容都不会缓存

协商缓存
  1. 若本地资源是最新的，那么返回 304 （考点!）
  2. 若比对后，需要从服务器获取最新资源，那就是正常的 200
 - Last-modified If-Modified-Since
  - 采用资源最后修改时间来判断，单位精度秒
  1. Last-Modified：服务器资源的最新更新时间 Tue, 14 Jan 2020 09:18:29 GMT
  2. If-Modified-Since：请求头中将上次的 Last-Modified 的值写入到请求头的 If-Modified-Since 字段
  3. 这个判断方式是 **http1.0** 的产物，因为时间精度是秒，若文件的更新频率在秒级以内，就会出现文件不一致。

 - ETag If-None-Match
  - 为了解决上面的那个问题， **http1.1** 加了这组标记
  1. ETag：服务器根据内容生成唯一的字符串标识
  2. If-None-Match：发起协商，把本地记录的 hash 标识传给服务器，服务器进行判断比较

session和cookie
- cookie客户端， 容易被盗取
- session服务端，用户量太大消耗资源，一般session都存在当前服务器上，然后后端不止一台服务器，然后登陆信息的session太多的话，就需要通过反向代理，然后又通过轮询，ip哈希

进程是CPU资源分配的最小单位，线程是CPU调度的最小单位

浏览器性能监控：performance


# webpack
擦除无用代码 tree shaking
代码分割  scope hosting
基础库分离
公共脚本分离 SplitChunksPlugin
懒加载JS脚本的方式 = 动态import

构建优化
多进程/多实例构建优化 HappyPack / thread-loader
并行压缩
DLLPlugin分包
缓存


loader - 本身是一个函数，接受源文件作为参数，返回转换的结果
1. 通过this.async 返回一个异步loader 
  const callback = this.async();
2. 同步的话this.callback

Plugins - 打包构建相关
1. //compiler：webpack实例例  
  apply(compiler){
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
    // 同步的写法   
    // compiler.hooks.compile.tap(
    //   "CopyrightWebpackPlugin",
    //   compilation => {
    //     console.log("开始了了");
    //   }
    // )
  }

webpack文件监听（不会自动刷新，需要手动刷新）
1. webpack --watch
2. 在配置webpack.config.js 文件中添加watch: true

webpack⽂件监听的原理分析
 - 轮询判断⽂件的最后编辑时间是否变化
 - 某个⽂件发⽣了变化，并不会⽴刻告诉监听者，⽽是先缓存起来，等aggregateTimeout


webpack热更新（不用手动刷新浏览器）
- webpack-dev-server（输出的放在内存里面，而不是像watch输出放在本地磁盘文件里，所以WDS的构建速度较快）
WDS结合HotModeuleReplacementPlugin插件使用
- webpack-dev-middleware  WDM将webpack输出文件传输给服务器，适用于灵活的定制场景

小程序 - 具体查阅  小程序.md
调用云函数 wx.cloud.callFunction
查云数据库 wx.cloud.database().collection('xx')



# js
不改变原数组的方法6种
1. join()
2. cancat()
3. ...
4. indexOf()
5. includes() 
6. slice()

### common.js 和 es6 中模块引入的区别
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJs 是单个值导出，ES6 Module可以导出多个
4. CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5. CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined

克隆deepClone
```js
function isObject(obj) {
  return typeof obj == 'object' && obj !== null
}

function deepClone (obj) {
  if(!obj) return obj;
  var target = Array.isArray(obj) ? [] : {}
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      if(isObject(obj[prop])) {
        target[prop] = deepClone(obj[prop])
      } else {
        target[prop] = obj[prop]
      }
    }
  }
  return target;
}
```

# 网络安全





