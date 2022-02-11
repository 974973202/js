// one
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');

// ----------
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

// two  124536
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then(val => {
  console.log(val);
});

promise.then(() => {
  console.log(3);
  setTimeout(function() {
    console.log(7);
  });
});

console.log(4);

setTimeout(function() {
  console.log(6);
});


// 事件循环，消息队列与宏任务、微任务之间的关系是什么？

// 宏任务入队消息队列，可以将消息队列理解为宏任务队列
// 每个宏任务内有一个微任务队列，执行过程中微任务入队当前宏任务的微任务队列
// 宏任务微任务队列为空时才会执行下一个宏任务
// 事件循环捕获队列出队的宏任务和微任务并执行

// 事件循环会不断地处理消息队列出队的任务，而宏任务指的就是入队到消息队列中的任务，
// 每个宏任务都有一个微任务队列，宏任务在执行过程中，如果此时产生微任务，那么会将
// 产生的微任务入队到当前的微任务队列中，在当前宏任务的主要任务完成后，会依次出队
// 并执行微任务队列中的任务，直到当前微任务队列为空才会进行下一个宏任务。

// three
// 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 
// 和 [A, B, C, D]，
// 合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]
let a1 =  ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let a2 = ['A', 'B', 'C', 'D'].map((item) => {
  return item + 3
})

let a3 = [...a1, ...a2].sort().map((item) => {
  if(item.includes('3')){
    return item.split('')[0]
  }
  return item
})

// four
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
// ---
var b = 10;
(function c(){
    b = 20;
    console.log(b); 
})();

// five 
class A {
  constructor() {
      this.nameA = 'a'
  }
  validateA() {
      console.log('A')
  }
}

class B extends A {
  constructor() {
      super()
      this.nameB = 'b'
  }
  validateB() {
      console.log('B')
  }
}

class C extends B {
  constructor() {
      super()
      this.nameC = 'c'
  }
  validateC() {
      console.log('C')
  }
}

var c = new C()

function findMembers(obj, ...params) {
  const keys = Object.getOwnPropertyNames(obj)
  let members = keys.filter(item => {
      for (let i = 0; i < params.length; i++) {
          if (item.indexOf(params[i]) > -1) {
              return true
          }
      }
  })
  if (obj.__proto__) {
      return members.concat(findMembers(obj.__proto__, ...params))
  } else {
      return members
  }
}

const members = findMembers(c, 'name', 'validate')

console.log(members)