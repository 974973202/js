// 1）Plugin的本质是一个 node 模块，这个模块导出一个JavaScript 类
// 2）它的原型上需要定义一个apply 的方法
// 3）通过compiler获取webpack内部的钩子，获取webpack打包过程中的各个阶段
// 钩子分为同步和异步的钩子，异步钩子必须执行对应的回调
// 4）通过compilation操作webpack内部实例特定数据
// 5）功能完成后，执行webpack提供的cb回调

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