// 1 ----------------------
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4)
}).then(res => {
  console.log(res);
})

Promise.resolve().then(() => {
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

// 0 1 2 3 4 5 6 

// 2 ----------------------
Promise.resolve().then(() => {
  console.log(0);
  return { then(resolve) { resolve(4) } };
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
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

// 0 1 2 4 3 5 6 

// 3 -------------------------------------
const p1 = new Promise((resolve, reject) => {
  reject(0)
})
console.log(1);
setTimeout(() => {
  p1.then(undefined, console.log)
}, 0)
console.log(2);
// 1
// 2
// 输出报错 UnhandledPromiseRejection: This error originated either

// 4 -----------------------------------------
const p2 = new Promise((resolve, reject) => {
  reject(0)
})
console.log(1);
p2.then(undefined, console.log)
console.log(2);
// 1
// 2
// 0