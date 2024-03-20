// - 题目：给定一个整数数组，其中第 i 个元素代表了第 i天的股票价格；
//        非负整数 fee 代表了交易股票的手续费用，求返回获得利润的最大值
// - 输入：arr: [1, 12, 13, 9, 15, 8, 6, 16]；fee: 2
// - 输出：22

const { reject } = require("../interview/myPromise");


// 字符串的最长公共前缀

// 无重复最长子串

function apply(context, arr) {
    let context = Object(context) || window;
    context.fn = this;

    let result;
    if (!arr) {
        result = context.fn();
    }else {
        const args = [];
        for (let i = 0; i < arr.length; i++) {
            args.push(`arr[${i}]`);
        }
        result = eval(`context.fn(${args})`)
    }

    delete context.fn;
    return result;
}

function call(context) {
    let context = Object(context) || window;
    context.fn = this;

    let args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push(`arguments[${i}]`)
    }
    const result = eval(`context.fn(${args})`)
    delete context.fn;
    return result;
}

Function.prototype.bind = function(context, ...args) {
    if (typeof this !== 'function'){
        throw new TypeError('Error');
    }
    const _this = this;
    const ctx = Object(context) || window;

    return function fn(...innerArg) {
        if (this instanceof fn) {
            return new _this(...args, ...innerArg)
        }
        return _this.apply(ctx, [...args, ...innerArg])
    }
}

Array.prototype.group = function(fn) {
    var result = {};
    for (var i = 0; i < this.length; i++) {
        const element = this[i];
        const category = fn(element, index, this);
        if (result[category]) {
            result[category].push(element)
        }else {
            result[category] = [element]
        }
    }
    return result;
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
}

function throttle(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }
    }
}

function _new () {
    let obj = new Object();
    let c = [].shift.call(arguments);
    obj.__proto__ = c.prototype;
    let result = c.apply(obj, arguments);
    return typeof result === 'object' ? result: obj;
}

function _instanceof(l, r) {
    let right = r.prototype;
    let left = l.__proto__;
    while(true) {
        if (left === null) return false;
        if(left === right) return true;
        left = left.__proto__
    }
}

const listener = {
    list: [],
    listen: (fn) => listener.list.push(fn),
    notify: (...args) => listener.list.forEach(fn => fn(...args))
}

// 观察者模式是一种紧耦合的模式，适用于一对多的依赖关系，主题和观察者之间直接通信。
// 发布订阅模式是一种松耦合的模式，适用于多对多的关系，通过消息代理进行通信。

class subject {
    constructor() {
        this.observers = [];
    }
    ob(fn) {
        if (fn && fn.update) {
            this.observers.push(fn);
        }
    }

    notify() {
        this.observers.forEach(fn => fn.update(...arguments))
    }
}

class Ob {
    update(...args) {
        console.log(...args);
    }
}

const s = new subject();
s.ob(new Ob());
s.notify('hello');

const padding = 'padding';
const fulfilled = 'fulfilled';
const rejected = 'rejected';

function _promise(fn) {

    const _this = this;
    _this.status = padding;

    _this.value = null;
    _this.error = null;

    _this.onfulfilledCb = [];
    _this.onrejectedCb = [];

    function resolve(value) {
        if (_this.status === padding) {
            _this.status = fulfilled;
            _this.value = value;
            _this.onfulfilledCb.forEach(fn => fn(value))
        }

    }

    function reject(error) {
        if (_this.status === padding) {
            _this.status = rejected;
            _this.error = error;
            _this.onrejectedCb.forEach(fn => fn(error))
        }
    }


    try {
        fn(resolve, reject);
    }catch (error) {
        reject(error)
    }
}

function _resolvePromise(bridgePromise, x, resolve, reject) {
    if (x instanceof _promise) {
        if(x.status === padding) {
            x.then(s => {
                _resolvePromise(bridgePromise, s, resolve, reject)
            }, e => reject(e))
        } else {
            x.then(resolve, reject);
        }
    } else {
        resolve(x);
    }
}

_promise.prototype.then = function (onFulfilled, onRejected) {
    const _this = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error } 

    let bridgePromise = new _promise((resolve, reject) => {
        if (_this.status === padding) {
            _this.onfulfilledCb.push((value) => {
                try {
                    let x = onFulfilled(value);
                    _resolvePromise(bridgePromise, x, resolve, reject)
                }catch (e) {
                    reject(e)
                }
            })
            _this.onRejectedCB.push((error) => {
                try {
                    let x = onRejected(error);
                    _resolvePromise(bridgePromise, x, resolve, reject)
                }catch (e) {
                    reject(e)
                }
            })
        }

        if (_this.status === fulfilled) {
            setTimeout(() => {
                try {
                    let x = onFulfilled(_this.value);
                    _resolvePromise(bridgePromise, x, resolve, reject)
                }catch (e) {
                    reject(e)
                }
            }, 0)
        }

        if (_this.status === rejected) {
            setTimeout(() => {
                try {
                    let x = onRejected(_this.error);
                    _resolvePromise(bridgePromise, x, resolve, reject)
                }catch (e) {
                    reject(e)
                }
            }, 0)
        }
    })

    return bridgePromise;
}

_promise.race = function (promises) {
    return new _promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(resolve, reject);
        })
    })
}

_promise.all = function(promises) {
    let result = [];
    let count = 0;
    for(let i = 0; i < promises.length; i++) {
        promises[i].then((data) => {
            result[i] = data;

            if (++count === promises.length) {
                resolve(result)
            }
        }, e => reject(e))
    }
}

function fb (n) {
    if (n == 1 || n == 2) {
        return 1
    }
    return fb(n-1) + fb(n-2)
}

function unique(arr) {
    return arr.filter((item, index, arr) => arr.indexOf(item) === index)
}

[...new Set(array)]