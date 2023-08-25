// await 是求值，对promise求值

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


```js
// await 只能阻塞promise对象
async function test() {
  await test1()
  console.log(2)
}

test() // 2 1

function test1() {
  setTimeout(() => {
    console.log(1)
  }, 3000)
}
```

```js
// 等待执行
async function test() {
  await test1()
  console.log(2)
}

test() // 1 2

function test1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1)
      resolve(1) // resolve返回的值可在await里接收
    }, 3000)
  })
}
```

```js
// async await 原理
function* myGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}

const gen = myGenerator()
gen.next().value.then(val => {
  console.log(val) // 1
  gen.next().value.then(val => {
    console.log(val) // 2 
    gen.next().value.then(val => {
      console.log(val) // 3
    })
  })
})
```

```js
// ---------------  async await 原理2

function run(gen) {
  var g = gen()                     //由于每次gen()获取到的都是最新的迭代器,因此获取迭代器操作要放在step()之前,否则会进入死循环

  function step(val) {              //封装一个方法, 递归执行next()
    var res = g.next(val)           //获取迭代器对象，并返回resolve的值
    if (res.done) return res.value   //递归终止条件
    res.value.then(val => {         //Promise的then方法是实现自动迭代的前提
      step(val)                     //等待Promise完成就自动执行下一个next，并传入resolve的值
    })
  }
  step()  //第一次执行
}

function* myGenerator() {
  console.log(yield Promise.resolve(1))   //1
  console.log(yield Promise.resolve(2))   //2
  console.log(yield Promise.resolve(3))   //3
}

run(myGenerator)

//  run 方法优化
function run(gen) {
  //把返回值包装成promise
  return new Promise((resolve, reject) => {
    var g = gen()

    function step(val) {
      //错误处理
      try {
        var res = g.next(val)
      } catch (err) {
        return reject(err);
      }
      if (res.done) {
        return resolve(res.value);
      }
      //res.value包装为promise，以兼容yield后面跟基本类型的情况
      Promise.resolve(res.value).then(
        val => {
          step(val);
        },
        err => {
          //抛出错误
          g.throw(err)
        });
    }
    step();
  });
}
```

### await是如何实现暂停执行  手写async await的最简实现（20行搞定）
```js
function asyncToGenerator(generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        const { value, done } = generatorResult
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
        }
      }
      step("next")
    })
  }
}
```

```js
// generatorFunc是 generator函数
function asyncToGenerator(generatorFunc) {
  // 返回的是一个新的函数
  return function () {
    // 先调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = generatorFunc.apply(this, arguments)
    // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
        let generatorResult
        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = generatorResult
        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是在最后一次调用next后才会为true
          // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
          // 这个value也就是generator函数最后的返回值
          return resolve(value)
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回 { value: Promise, done: false } 的结构，
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(
            // 这个value对应的是yield后面的promise
            value
          ).then(
            // value这个promise被resove的时候，就会执行next
            // 并且只要done不是true的时候 就会递归的往下解开promise
            // 对应gen.next().value.then(value => {
            //    gen.next(value).value.then(value2 => {
            //       gen.next()
            //
            //      // 此时done为true了 整个promise被resolve了
            //      // 最外部的test().then(res => console.log(res))的then就开始执行了
            //    })
            // })
            function onResolve(val) {
              step("next", val)
            },
            // 如果promise被reject了 就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw(err)
            // 那么自然就被catch到 然后把promise给reject掉啦
            function onReject(err) {
              step("throw", err)
            },
          )
        }
      }
      step("next")
    })
  }
}
```

### 实现 isAsyncFunction 函数来判断是否是异步函数
```js
function isAsyncFunction(func) {
  return func[Symbol.toStringTag] === 'AsyncFunction'
}
```

### processTasks(...task) {}
```js
/**
 * 1. 依次顺产执行一系列任务
 * 2，所有任务全部完成后可以得到每个任务的执行结果
 * 3，需要返回两个方法，start 用于启动任务，pause 用于暂停任务
 * 4，每个任务具有原子性，即不可中断，只能在两个任务之间中断
 * @param {...Function] tasks 务列表，每个任务无参、异步
 */


/**
 * 解析：
 * 1. 我们按顺序执行任务，也就是说必须等待上一个任务完成才能执行下一个任务
 * 2. 在任务未完成时不可中断，如果在任务进行中进行中断操作并不会立即中断，而会在任务进行完毕后中断。
 */

import { useEffect } from 'react';

let processor: any;
function processTasks(tasks: Promise<any>[]) {
  let isRunning = false; // 判断是否继续执行的状态
  const result: any[] = []; // 存储执行结果
  let prom: Promise<unknown> | null = null;
  let i = 0; // 用于判断执行到第几个，便于继续执行

  return {
    start() {
      return new Promise(async (resolve, reject) => {
        if (prom) {
          console.log(prom, 'promprom');

          prom.then(resolve, reject);
          return;
        }
        if (isRunning) return;
        isRunning = true;
        while (i < tasks.length) {
          try {
            console.log(i, '执行中');
            result.push(await tasks[i]());
            console.log(i, '执行完成');
          } catch (error) {
            isRunning = false;
            reject(error);
            prom = Promise.reject(error);
            return;
          }

          i++;

          if (!isRunning && i < tasks.length) {
            console.log('执行中断');
            return;
          }
        }
        console.log('全部执行完成');
        isRunning = false;
        resolve(result);
        prom = Promise.resolve(result);
      });
    },
    stop() {
      isRunning = false;
    },
  };
}

function AwaitTest() {
  useEffect(() => {
    const tasks = [];
    // 生成几个异步函数
    for (let i = 0; i < 5; i++) {
      tasks.push(
        () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve(i);
            }, 1000)
          )
      );
    }
    processor = processTasks(tasks);
  }, []);

  return (
    <div>
      <button
        onClick={async () => {
          const results = await processor.start();
          console.log('任务执行完成', results);
        }}
      >
        开始任务
      </button>
      <button
        onClick={() => {
          console.log('点击暂停');
          processor.stop();
        }}
      >
        暂停任务
      </button>
    </div>
  );
}

export default AwaitTest;

```