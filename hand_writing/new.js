// new一个对象, 这个过程中发生了什么
// 1. 创建一个新对象，如：var obj = {};
// 2. 新对象的_proto_属性指向构造函数的原型对象。
// 3. 将构造函数的作用域赋值给新对象。（也所以this对象指向新对象）
// 4. 执行构造函数内部的代码，将属性添加给obj中的this对象。
// 5. 返回新对象obj。
var obj = new Object("name", "sansan");


// 他创建了一个全新的对象
// 他会被执行[[Prototype]] (也就是__proto__) 链接
// 它使this指向新创建的对象
// 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
// 如果函数没有返回对象类型Object(包含Function，Array，Date，RegExg，Error)，那么new表达式中的函数调用将返回对象引用
// 模拟 new
function New() {
  // 创建一个空的对象
  let obj = new Object()
  // 获得构造函数
  let c = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = c.prototype
  // 绑定 this，执行构造函数
  let result = c.apply(obj, arguments)
  // 确保 new 出来的是个对象
  return typeof result === 'object' ? result : obj
}

// 模拟Object.create()
// Object.create() 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

function create(proto) {
  function F() { }
  F.prototype = proto;
  return new F();
}