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
  // .then().then().then()
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };

  let bridgePromise = new MyPromise((resolve, reject) => {
    if (_this.status === FULFILLED) {
      console.log('FULFILLED')
      setTimeout(() => { // 加 setTimeout 是为了让 _resolvePromise 的第一个参数bridgePromise有效
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
        if (++count == promises.length) { // 都是成功 
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
  return new MyPromise(resolve => resolve(value));
}

MyPromise.reject = function (error) {
  return new MyPromise((resolve, reject) => reject(error));
}

MyPromise.reject = function (cb) {
  return this.then((value) => {
    return MyPromise.resolve(cb()).then(value => value)
  }, (error) => {
    return MyPromise.resolve(cb()).then(error => { throw error })
  })
}

/**
 * 首先了解Promise.allSettled什么作用和用法
 * 相对于 Promise.all 需要所有promise都成功时才 resolve或者有一个失败时进行reject
 * Promise.allSettled则不区分这些promise是resolve还是reject了，只要都执行完毕了，那Promise.allSettled就会返回
 * 返回数据格式如下[{status:"fulfilled", value:result},{status:"rejected", reason:error} ]
 */
MyPromise.allSettled = function (promises) {
  // 用一个Promise封装，以便于在全部待执行promise执行完后，统一进行结果处理
  return new MyPromise((resolve, reject) => {
    // 简单的入参校验
    if (!Array.isArray(promises)) {
      reject(new TypeError("arguments must be an array"))
    }

    const promiseLen = promises.length;
    const res = [];
    // 记录执行完的Promise数量
    let count = 0;
    for (let i = 0; i < promiseLen; i++) {
      //熟悉的Promise.resolve ，这里Promise.resolve()的入参是promiseArr[i]，它是个Promise对象
      // Promise.resolve(Promise对象)则会把入参Promise对象原样返回 具体看这里https://www.cnblogs.com/polk6/p/14781550.html
      MyPromise.resolve(promises[i])
        .then((value) => {
          res[i] = {
            status: 'fulfilled',
            value
          }
        })
        .catch((reason) => {
          res[i] = {
            status: 'rejected',
            reason
          }
        })
        .finally(() => {
          // 利用finally在Promise执行完之后无论resolve还是reject都会执行的特性，做全部Promise执行统计
          count++;
          // 判断执行完了就调用最外层包装的Promise的resolve，进行统一的结果返回
          if (count == promiseLen) {
            resolve(res)
          }
        })
    }
  })
}

MyPromise.finally = function (callback) {
  return this.then(
    value => {
      callback();
      return value;
    },
    reason => {
      callback();
      throw reason;
    }
  );
};


module.exports = MyPromise;