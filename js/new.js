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

