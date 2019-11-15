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

  const result = thisArg[fn](...arg);

  delete thisArg[fn];

  return result;
};
