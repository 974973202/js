// bind()方法创建一个新的函数, 当被调用时，
// 将其this关键字设置为提供的值，在调用新函数时，
// 在任何提供之前提供一个给定的参数序列

// 返回一个函数
// 对于普通函数，绑定this指向
// 对于构造函数，要保证原函数的原型对象上的属性不能丢失

// instanceof 
// 1.判断一个实例是否属于某种类型 
// 2.在继承关系中用来判断一个实例是否属于它的父类型

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

