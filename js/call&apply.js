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