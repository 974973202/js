### 事件循环，消息队列与宏任务、微任务之间的关系是什么？

- 宏任务入队消息队列，可以将消息队列理解为宏任务队列
- 每个宏任务内有一个微任务队列，执行过程中微任务入队当前宏任务的微任务队列
- 宏任务微任务队列为空时才会执行下一个宏任务
- 事件循环捕获队列出队的宏任务和微任务并执行

- 事件循环会不断地处理消息队列出队的任务，而宏任务指的就是入队到消息队列中的任务，
- 每个宏任务都有一个微任务队列，宏任务在执行过程中，如果此时产生微任务，那么会将
- 产生的微任务入队到当前的微任务队列中，在当前宏任务的主要任务完成后，会依次出队
- 并执行微任务队列中的任务，直到当前微任务队列为空才会进行下一个宏任务。


// one
```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout



// two
// async function async1() {
//   console.log('async1 start')  // 2
//   await async2()
//   console.log('async1 end')   // 8
// }
// async function async2() {
//   console.log('async2')    // 3
// }
// console.log('script start')  // 1
// setTimeout(function () {
//   console.log('setTimeout0')  // 10
// })
// setTimeout(function () {
//   console.log('setTimeout3')  // 11
// }, 3)
// setImmediate(() => console.log('setImmediate'));  // 12
// process.nextTick(() => console.log('nextTick'));  // 7
// async1();
// new Promise(function (resolve) {
//   console.log('promise1')    // 4
//   resolve();
//   console.log('promise2')    // 5
// }).then(function () {
//   console.log('promise3')   // 9
// })
// console.log('script end')     // 6

// two  1245367
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then(val => {
  console.log('xx');
});

promise.then(() => {
  console.log(3);
  setTimeout(function () {
    console.log(7);
  });
});

console.log(4);

setTimeout(function () {
  console.log(6);
});
```


