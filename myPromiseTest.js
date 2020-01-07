let P = require("./myPromise")
let fs = require("fs")

let p = new P((resolve, reject) => {
  // fs.readFile('../file/1.txt', "utf8", function(err, data) {
  //     err ? reject(err) : resolve(data)
  // });
  resolve('111')
});
let f1 = function(data) {
  console.log(data)
  return new P((resolve, reject) => {
      // fs.readFile('../file/2.txt', "utf8", function(err, data) {
      //     err ? reject(err) : resolve(data)
      // });
      setTimeout(()=> {
        reject('333')
      }, 1000)
  });
}
let f2 = function(data) {
  console.log(data)
  return new P((resolve, reject) => {
      // fs.readFile('../file/3.txt', "utf8", function(err, data) {
      //     err ? reject(err) : resolve(data)
      // });
      setTimeout(()=> {
        resolve('5555')
      }, 1000)
  });
}
let f3 = function(data) {
  console.log(data);
}
let errorLog = function(error) {
  console.log('error' + error)
}
p.then(f1, errorLog).then(f2, errorLog).then(f3, errorLog).catch(errorLog)