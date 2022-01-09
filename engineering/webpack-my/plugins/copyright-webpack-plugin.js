class CopyrightWebpackPlugin {
  constructor(options) {
    //接受参数   
    console.log(options);
  }
  //compiler：webpack实例例  
  apply(compiler) {
    //hooks.emit 定义在某个时刻   
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
}
module.exports = CopyrightWebpackPlugin;