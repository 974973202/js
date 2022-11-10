// 最佳实践是：默认使用 const，只有当确实需要改变变量的值的时候才使用 let

// Let和const
// 1.不存在变量提升 其实是存在变量提升的，是先放入暂时性死区中，等执行到的时候才从暂时性死区中移除
// 2.暂时性死区
// 3.不允许重复声明
// 4.块作用域

// const 变量指向的那个内存地址所保存的数据不变

const test = '吉'

console.log('字符串长度：'， text.length);
console.log('使用正则测试：'， /^.$/.test(text));
console.log('得到第一个码元：'， text.charCodeAt(0));
console.log('得到第二个码元：'， text.charCodeAt(1));

// 吉： \ud842\udfb7
console.log('得到第一个码元：'， text.charCodeAt(0).toString(16));
console.log('得到第二个码元：'， text.charCodeAt(1).toString(16));
console.log('得到第一个码点：'， text.codePointAt(0));
console.log('得到第二个码点：'， text.codePointAt(1));

/**
 * 判断字符串char 是32位还是16位
 * @param {*} char
 */
function is32bit(char， i = 0) {
  // 如果码点大于16位最大值则是32位
  return char.codePointAt(i) > 0xffff;
}
/**
 * 得到一个字符串码点的真实长度
 * @param {*} str
 */
function getLengthOfCodePoint(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    // i 索引码元
    if (is32bit(str, i)) {
      i++
    };
    len++;
  }
  return len;
}

// Object.freeze对象冻结

解构赋值

字符串新增方法
传统上，JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。
Str.includes()：返回布尔值，表示是否找到了参数字符串。
Str.startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
Str.endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

repeat方法返回一个新字符串，表示将原字符串重复n次。
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"

ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
上面代码中，padStart()和padEnd()一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。
如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串

数值的扩展
Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。
Number.isNaN()用来检查一个值是否为NaN。
Number.isInteger()用来判断一个数值是否为整数
Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。
Math对象的扩展
Math.trunc方法用于去除一个数的小数部分，返回整数部分
Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。
它会返回五种值。
参数为正数，返回 + 1；
参数为负数，返回 - 1；
参数为 0，返回0；
参数为 - 0，返回 - 0;
其他值，返回NaN

函数的扩展
数组的扩展
Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array - like object）和可遍历（iterable）的对象
Array.of方法用于将一组值，转换为数组。
fill方法使用给定值，填充一个数组。
数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
它接受三个参数。
target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

数组实例的find方法，用于找出第一个符合条件的数组成员
fill方法使用给定值，填充一个数组。

对象的扩展
Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
ES6 一共有 5 种方法可以遍历对象的属性。
（1）for...in
for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
（2）Object.keys(obj)
Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
（3）Object.getOwnPropertyNames(obj)
Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
（4）Object.getOwnPropertySymbols(obj)
Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
（5）Reflect.ownKeys(obj)
Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

super，指向当前对象的原型对象。

对象的新增方法
Object.is它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
// +0 === -0 //true
// NaN === NaN // false
// Object.is(+0, -0) // false
// Object.is(NaN, NaN) // true

Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）Object.assign方法实行的是浅拷贝，而不是深拷贝。
Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
Object.setPrototypeOf方法的作用与__proto__相同，用来设置一个对象的prototype对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。Object.getPrototypeOf()与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。
Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。
Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
Object.entries()方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。