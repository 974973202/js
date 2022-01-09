const loaderUtils = require("loader-utils");
// 不能使用剪头函数
module.exports = function (source) {
  // console.log(this.query)
  const options = loaderUtils.getOptions(this);
  //定义⼀一个异步处理理，告诉webpack,这个loader⾥里里有异步事件,在⾥里里⾯面调⽤用下这个异步 
  // 通过this.async 返回一个异步loader 
  const callback = this.async();
  // 关掉loader缓存
  // this.cacheable(false)
  setTimeout(() => {
    const result = source.replace("webpack", options.name);
    callback(null, result);
  }, 3000);
};