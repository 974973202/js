// 一 类数组转数组
// 1. Array.prototype.slice.call()
// 2. Array.from()
// 3. [...arguments]
// 4. Array.prototype.concat.apply([], arguments)

// 二 数组扁平化
// 1. Array.prototype.flat(context)  参数context表示深度Infinity展开任意深度的嵌套数组
// 2. JSON.stringify(arr).replace(/(\[|\])/g, '').split(',')
// 3. 递归
// var arr = [1, [2, [3, [4, 5]]], 6];
// let result = [];
// function test(arr) {
//   arr.forEach(ele => {
//     if (Array.isArray(ele)) {
//       test(ele)
//     } else {
//       result.push(ele)
//     }
//   });
//   return result
// }
// console.log(test(arr))

// 三 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
// 1. Object.prototype.toString.call()
// 每一个继承 Object 的对象都有 toString 方法，如果 toString 方法没有重写的话，会返回 [Object type]，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 toString 方法时，会直接返回都是内容的字符串，所以我们需要使用call或者apply方法来改变toString方法的执行上下文。

// const an = ['Hello','An'];
// an.toString(); // "Hello,An"
// Object.prototype.toString.call(an); // "[object Array]"
// 这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined 。

// Object.prototype.toString.call('An') // "[object String]"
// Object.prototype.toString.call(1) // "[object Number]"
// Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
// Object.prototype.toString.call(null) // "[object Null]"
// Object.prototype.toString.call(undefined) // "[object Undefined]"
// Object.prototype.toString.call(function(){}) // "[object Function]"
// Object.prototype.toString.call({name: 'An'}) // "[object Object]"
// Object.prototype.toString.call() 常用于判断浏览器内置对象时。

// 更多实现可见 谈谈 Object.prototype.toString

// 2. instanceof
// instanceof  的内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

// 使用 instanceof判断一个对象是否为数组，instanceof 会判断这个对象的原型链上是否会找到对应的 Array 的原型，找到返回 true，否则返回 false。

// []  instanceof Array; // true
// 但 instanceof 只能用来判断对象类型，原始类型不可以。并且所有对象类型 instanceof Object 都是 true。

// []  instanceof Object; // true
// 3. Array.isArray()
// 功能：用来判断对象是否为数组

// instanceof 与 isArray

// 当检测Array实例时，Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 iframes

// var iframe = document.createElement('iframe');
// document.body.appendChild(iframe);
// xArray = window.frames[window.frames.length-1].Array;
// var arr = new xArray(1,2,3); // [1,2,3]

// // Correctly checking for Array
// Array.isArray(arr);  // true
// Object.prototype.toString.call(arr); // true
// // Considered harmful, because doesn't work though iframes
// arr instanceof Array; // false
// Array.isArray() 与 Object.prototype.toString.call()

// Array.isArray()是ES5新增的方法，当不存在 Array.isArray() ，可以用 Object.prototype.toString.call() 实现。

// if (!Array.isArray) {
//   Array.isArray = function(arg) {
//     return Object.prototype.toString.call(arg) === '[object Array]';
//   };
// }

// 四

const path = require('path');
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));