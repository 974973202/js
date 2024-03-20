- webpack.config.js 
  - 编写loader和plugin
```js
// 必须有apply方法
class MyPlugin {
  constructor(options) {
    //接受参数   
    console.log(options);
  }
  //compiler：webpack实例例  
  apply(compiler) {
    //hooks.emit 定义在某个时刻   
    compiler.hooks.emit.tapAsync(
      "插件名称", // 类
      (compilation, cb) => {
        cb();
      }
    );
    // 同步的写法   
    // compiler.hooks.compile.tap(
    //   "插件名称",
    //   compilation => {
    //     console.log("开始了了");
    //   }
    // )
  }
}
```

- bundle.js
  - 实现webpack编译流程

- simplepack.config.js
  - 简易webpack
  - 入口在 lib/index.js