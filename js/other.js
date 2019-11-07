// 类数组转数组
// 1. Array.prototype.slice.call()
// 2. Array.from()
// 3. [...arguments]
// 4. Array.prototype.concat.apply([], arguments)

// 数组扁平化
// 1. Array.prototype.flat(context)  参数context表示深度Infinity展开任意深度的嵌套数组
// 2. JSON.stringify(arr).replace(/(\[|\])/g, '').split(',')
// 3. 递归
// var arr = [1, [2, [3, [4, 5]]], 6];
// let result = [];
// function test(arr) {
//   arr.forEach(ele => {
//     if (Array.isArray(ele)) {
//       test(ele)
//     } else {
//       result.push(ele)
//     }
//   });
//   return result
// }
// console.log(test(arr))