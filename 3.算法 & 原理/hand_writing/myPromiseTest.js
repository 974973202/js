let MyPromise = require("./myPromise")
let fs = require("fs")

// let p = new MyPromise((resolve, reject) => {
//   // fs.readFile('../file/1.txt', "utf8", function(err, data) {
//   //     err ? reject(err) : resolve(data)
//   // });
//   resolve('111')
// });
// let f1 = function(data) {
//   console.log(data)
//   return new MyPromise((resolve, reject) => {
//       // fs.readFile('../file/2.txt', "utf8", function(err, data) {
//       //     err ? reject(err) : resolve(data)
//       // });
//       setTimeout(()=> {
//         reject('333')
//       }, 1000)
//   });
// }
// let f2 = function(data) {
//   console.log(data)
//   return new MyPromise((resolve, reject) => {
//       // fs.readFile('../file/3.txt', "utf8", function(err, data) {
//       //     err ? reject(err) : resolve(data)
//       // });
//       setTimeout(()=> {
//         resolve('5555')
//       }, 1000)
//   });
// }
// let f3 = function(data) {
//   console.log(data);
// }
// let errorLog = function(error) {
//   console.log('error' + error)
// }
// p.then(f1, errorLog).then(f2, errorLog).then(f3, errorLog).catch(errorLog)

MyPromise.resolve().then(() => {
  console.log(0);
  return MyPromise.resolve(4)
}).then(res => {
  console.log(res);
})

MyPromise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() => {
  console.log(6);
})