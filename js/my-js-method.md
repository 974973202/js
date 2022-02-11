1. new
2. call & apply
3. bind
4. 防抖 debounce
5. 节流 throttle
6. deepClone, real deepCopy

### new
```js
// new一个对象, 这个过程中发生了什么
// 1. 创建一个新对象，如：var obj = {};
// 2. 新对象的_proto_属性指向构造函数的原型对象。
// 3. 将构造函数的作用域赋值给新对象。（也所以this对象指向新对象）
// 4. 执行构造函数内部的代码，将属性添加给obj中的this对象。
// 5. 返回新对象obj。
var obj = new Object("name","sansan");


// 他创建了一个全新的对象
// 他会被执行[[Prototype]] (也就是__proto__) 链接
// 它使this指向新创建的对象
// 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
// 如果函数没有返回对象类型Object(包含Function，Array，Date，RegExg，Error)，那么new表达式中的函数调用将返回对象引用
// 模拟 new
function create() {
  // 创建一个空的对象
  let obj = new Object()
  // 获得构造函数
  let Con = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = Con.prototype
  // 绑定 this，执行构造函数
  let result = Con.apply(obj, arguments)
  // 确保 new 出来的是个对象
  return typeof result === 'object' ? result : obj
}

// 模拟Object.create()
// Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

function create(proto){
  function F(){
      F.prototype = proto;
      return new F();
  }
}
```

### call & apply
```js
// call() 方法在使用一个指定的 this 值和
// 若干个指定的参数值的前提下调用某个函数或方法

Function.prototype.myCall = function(context) {
  // 若 context为null 指向window 而window下挂载着fn方法  可使用 Symbol()
  var context = context || window;
  context.fn = this;

  var args = [];
  for(var i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`);
  };
  
  // 数组加字符串，数字自动调用toString()方法 
  // 例如：[1,2,3] + '123' = '1,2,3123'
  var result = eval(`context.fn(${args})`); // eval可换es6 ...
  delete context.fn;
  return result;
}
Function.prototype.mycall = function(thisArg) {
  // this指向调用call的对象
  if (typeof this !== 'function') {
    // 调用call的若不是函数则报错
    throw new TypeError('Error');
  }
  // 声明一个 Symbol 属性，防止 fn 被占用
  const fn = Symbol('fn')
  const args = [...arguments].slice(1);
  thisArg = thisArg || window;
  // 将调用call函数的对象添加到thisArg的属性中
  thisArg[fn] = this;
  // 执行该属性
  const result = thisArg[fn](...args);
  // 删除该属性
  delete thisArg[fn];
  // 返回函数执行结果
  return result;
}

Function.prototype.myApply = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
      result = context.fn();
  }
  else {
      var args = [];
      for (var i = 0; i < arr.length; i++) {
          args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result;
}
Function.prototype.myapply = function(thisArg) {
  if (typeof this !== 'function') {
    throw this + ' is not a function';
  }
  const args = arguments[1];
  const fn = Symbol('fn')
  thisArg[fn] = this;

  const result = thisArg[fn](...args);

  delete thisArg[fn];

  return result;
};
```

### bind
```js
// bind()方法创建一个新的函数, 当被调用时，
// 将其this关键字设置为提供的值，在调用新函数时，
// 在任何提供之前提供一个给定的参数序列

// 返回一个函数
// 对于普通函数，绑定this指向
// 对于构造函数，要保证原函数的原型对象上的属性不能丢失

// ES6  new.target是instanceof的改进
// 1.判断一个实例是否属于某种类型 
// 2.在继承关系中用来判断一个实例是否属于它的父类型

/**
 * 模仿实现 instanceof
 * @param   left  [左侧参数为一个实例对象]
 * @param   right [右侧为要判断的构造器函数]
 * @return  [true / false]
 */
function myinstanceof (left, right) {
  let prototype = right.prototype; // 获取目标原型对象 /取 right 的显示原型

  left = left.__proto__; // left 实例  right 构造函数
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if(left == null) {
      return false;
    } else if (left == prototype) {
      return true;
    }
    left = left.__proto__
  }
}

Function.prototype.myBind = function (context, ...args) {
  // 异常处理
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }
  // 保存this的值，它代表调用 bind 的函数
  var self = this;
  var fNOP = function () { };

  var fbound = function () {
    self.apply(this instanceof self 
      ? this : context,
      args.concat(Array.prototype.slice.call(arguments)));
  }

  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();

  return fbound;
}

```

### 防抖 debounce
```js
// 防抖 debounce
// 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，
// 如果在 n 秒内又触发了事件，则会重新计算函数执行时间

// 通俗来说 无论你触发多少次 我只在停止触发的时间内给你执行一次

/**
 * 非立即执行版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */

function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait);
  }
}

/**
 * 立即执行版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function debounce1(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait)

    if (callNow) func.apply(context, args)
  }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce2(func, wait, immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    }else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait);
    }
  }
}
```

### 节流 throttle
```js
// 节流 throttle
// 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
// 节流会稀释函数的执行频率。
// 对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版

// 通俗来说 无论你触发多少次 我只在规定时间内给你执行一次

/**
 * 时间戳版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function throttle(func, wait) {
  let previous = 0;
  return function () {
    let now = Date.now();
    let context = this;
    let args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}

/**
 * 定时器版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function throttle1(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args)
      }, wait)
    }

  }
}

// 时间戳版的函数触发是在时间段内开始的时候，
// 而定时器版的函数触发是在时间段内结束的时候

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle2(func, wait, type) {
  let previous = 0;
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
```

### deepClone, real deepCopy
```js
// deepClone
// 1. 判断是否是对象类型 typeof
// 2. for in 遍历
// 3. 判断是否是自身属性
// 4. 判断内属性是否是对象类型 typeof 是 继续deepClone 否 直接赋值

function deepClone(obj) {
  if(!isObject(obj)) return obj;

  var target = Array.isArray(obj) ? [] : {};

  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      if(isObject(obj[prop])) {
        target[prop] = deepClone(obj[prop])
      } else {
        target[prop] = obj[prop]
      }
    }
  }

  return target
}

function isObject(obj) {
  return typeof obj == 'object' && obj != null
}

// real deepCopy  拷贝array object function
function getType(obj) {
  const str = Object.prototype.toString.call(obj);
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    // 判断是否是dom元素，如div等
    return 'element';
  }
  return map[str];
}

function deepCopy(ori) {
  const type = getType(ori);
  let copy;
  switch (type) {
    case 'array':
      return copyArray(ori, type, copy);
    case 'object':
      return copyObject(ori, type, copy);
    case 'function':
      return copyFunction(ori, type, copy);
    default:
      return ori;
  }
}

function copyArray(ori, type, copy = []) {
  for (const [index, value] of ori.entries()) {
    copy[index] = deepCopy(value);
  }
  return copy;
}

function copyObject(ori, type, copy = {}) {
  for (const [key, value] of Object.entries(ori)) {
    copy[key] = deepCopy(value);
  }
  return copy;
}

function copyFunction(ori, type, copy = () => {}) {
  // const fun = eval(ori.toString()); // Function statements require a function name
  const fun = eval("(" + ori.toString() + ")");
  fun.prototype = ori.prototype
  return fun
}
const newobj = deepCopy({
  'a': 1,
  'b': '1',
  'c': function() {},
  'd': null,
  'e': [],
  'f': {},
  "g": new Date(),
})
console.log(newobj)
```