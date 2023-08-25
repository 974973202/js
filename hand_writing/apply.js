
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
Function.prototype.myapply = function (thisArg) {
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