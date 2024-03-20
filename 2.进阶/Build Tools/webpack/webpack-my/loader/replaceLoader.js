// 在 Loader 的运行过程中，如果发现该 Loader 上有pitch属性，会先执行 pitch 阶段，再执行 normal 阶段。

function customLoader(source, map, meta) {
  console.log(this.data.a); //这里可以拿到值为1

  console.log(this.query, source, 'xxx')
  // return source.replace('666666', 'lz x')
  const json = source.replace('666666', 'lllllll');
  this.callback(null, json)
}

// 在pitching阶段，如果执行到该Loader的pitch属性函数有返回值，就直接结束pitching阶段，并直接跳到该Loader pitching阶段的前一个Loader的normal阶段继续执行（若无前置Loader，则直接返回）
customLoader.pitch = function (remainingRequest, previousRequest, data) {
  // remainingRequest 代表未执行过pitch阶段的loader
  // previousRequest代表的是之前执行过pitch阶段的loader
  // 可以用于数据传递
  this.data.a = 1;//注入参数
  console.log("customLoader的pitch阶段");
};

module.exports = customLoader;

// Loader的四种类型
// 前置(pre)、普通(normal)、行内(inline)、后置(post)。
// module: {
//   rules: [
//     {
//       test: /\.css$/,
//       use: ["css-loader"],
//       enforce: "pre", //这里也可以是post，默认不写就是normal
//     },
//   ],
// },