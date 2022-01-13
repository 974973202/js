// https://juejin.im/post/5c41297cf265da613356d4ec
// MyPromise
// 支持同步任务
// 支持三种状态
// 支持链式调用.then
// 支持串行异步任务

//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {

  let _this = this; // 缓存当前this的实例
  _this.value = null; // 成功时的值
  _this.error = null; // 失败时的值
  _this.status = PENDING; // 初始状态
  // _this.onFulfilled = null; // 成功的回调函数
  // _this.onRejected = null; // 失败的回调函数
  _this.onFulfilledCB = []; // 成功的回调函数 改为数组存储，后续链式调用
  _this.onRejectedCB = []; // 失败的回调函数

  function resolve(value) {
    // if (value instanceof MyPromise) {
    //   return value.then(resolve, reject);
    // }
    // 如果状态是pending才去修改状态为fulfilled并执行成功逻辑
    if (_this.status === PENDING) {
      // 利用setTimeout特性将具体执行放到then之后,支持同步方法
      // setTimeout(() => {
      _this.status = FULFILLED;
      _this.value = value;
      // _this.onFulfilled(_this.value); // resolve时执行成功回调
      _this.onFulfilledCB.forEach(Cb => Cb(_this.value)); // resolve时执行成功回调
      // }, 0)
    }
  }

  function reject(error) {
    // 如果状态是pending才去修改状态为rejected并执行失败逻辑
    if (_this.status === PENDING) {
      // 利用setTimeout特性将具体执行放到then之后,支持同步方法
      // setTimeout(() => {
      _this.status = REJECTED;
      _this.error = error;
      // _this.onRejected(_this.error); // resolve时执行成功回调
      _this.onRejectedCB.forEach(Cb => Cb(_this.error)); // resolve时执行成功回调
      // }, 0)
    }
  }

  // fn(resolve, reject)
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }

}

// 用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
function _resolvePromise(bridgePromise, x, resolve, reject) {
  // 判断x 是不是一个 MyPromise 对象
  if (x instanceof MyPromise) {
    // 如果这个promise是pending状态，
    // 就在它的then方法里继续执行resolvePromise解析它的结果，
    // 直到返回值不是一个pending状态的promise为止
    if (x.status === PENDING) {
      x.then(s => {
        _resolvePromise(bridgePromise, s, resolve, reject);
      }, e => {
        reject(e)
      })
    } else {
      x.then(resolve, reject)
    }

  } else {
    // 如果x是一个普通值，就让bridgePromise的状态fulfilled，并把这个值传递下去
    resolve(x)
  }
}

/** Promise的then方法实现链式调用的原理是：返回一个新的Promise */ 
MyPromise.prototype.then = function (onFulfilled, onRejected) {

  // 不支持串行异步任务
  // if (this.status === PENDING) {
  //   // this.onFulfilled = onFulfilled;
  //   // this.onRejected = onRejected;
  //   this.onFulfilledCB.push(onFulfilled);
  //   this.onRejectedCB.push(onRejected);
  // } else if (this.status === FULFILLED) {
  //   //如果状态是fulfilled，直接执行成功回调，并将成功值传入
  //   onFulfilled(this.value)
  // } else {
  //   //如果状态是rejected，直接执行失败回调，并将失败原因传入
  //   onRejected(this.error)
  // }

  // 支持串行异步任务
  let _this = this; // -> MyPromise

  // 防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };

  let bridgePromise = new MyPromise((resolve, reject) => {
    if (_this.status === FULFILLED) {
      console.log('FULFILLED')
      setTimeout(() => {
        try {
          let x = onFulfilled(_this.value);
          // resolvePromise用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
          _resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0)
    }

    if (_this.status === REJECTED) {
      console.log('REJECTED')
      setTimeout(() => {
        try {
          let x = onRejected(_this.error);
          // resolvePromise用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
          _resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0)
    }

    if (_this.status === PENDING) {
      console.log('PENDING')
      _this.onFulfilledCB.push((value) => {
        try {
          let x = onFulfilled(value);
          _resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      _this.onRejectedCB.push((error) => {
        try {
          let x = onRejected(error);
          _resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
  })

  return bridgePromise; // Promise的then方法实现链式调用的原理是：返回一个新的Promise
}

MyPromise.prototype.catch = function (onRejected) {
  console.log('catch')
  return this.then(null, onRejected)
}

MyPromise.all = function (promises) {
  return new MyPromise(function (resolve, reject) {
    let result = [];
    let count = 0;
    for (let i = 0; i < promises.length; i++) {
      console.log(promises[i])
      promises[i].then(function (data) {
        // console.log('data', data)
        result[i] = data;
        if (++count == promises.length) {
          resolve(result);
        }
      }, function (error) {
        reject(error);
      });
    }
  });
}

MyPromise.race = function (promises) {
  return new MyPromise(function (resolve, reject) {
    promises.forEach(function (promise, index) {
      promise.then(resolve, reject);
    });
  });
}

MyPromise.resolve = function (value) {
  return new MyPromise(resolve => {
    resolve(value);
  });
}

MyPromise.reject = function (error) {
  return new MyPromise((resolve, reject) => {
    reject(error);
  });
}


module.exports = MyPromise;