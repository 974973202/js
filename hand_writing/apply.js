
Function.prototype.myApply = function (context, arr) {
  var context = Object(context) || window; // Object(null) -> {}
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = []; // [arr[0], arr[1]]
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
  thisArg[fn] = this; // 若 thisArg 是null?

  const result = thisArg[fn](...args);

  delete thisArg[fn];

  return result;
};

// 例一
const person = {
  fullName: function () {
    return this.firstName + ' ' + this.lastName;
  }
};
const person1 = {
  firstName: 'John',
  lastName: 'Doe'
};
const person2 = {
  firstName: 'Jane',
  lastName: 'Smith'
};
// 使用apply()在person1和person2上调用fullName()方法
console.log(person.fullName.apply(person1)); // 输出 "John Doe"
console.log(person.fullName.apply(person2)); // 输出 "Jane Smith"


// 例2:
function addNumbers(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
// 使用apply()调用addNumbers()函数，并传递numbers数组作为参数
console.log(addNumbers.apply(null, numbers)); // 输出 6


// 例3
const nums = [1, 2, 3, 4, 5];
// 使用apply()调用Math.max()函数，并传递numbers数组作为参数
console.log(Math.max.apply(null, nums)); // 输出 5


Function.prototype.applyx = function (ct, arr) {
  // const content = Object(ct) || window;
  // content.fn = this;

  // let result;
  // if(!arr) {
  //   result = content.fn()
  // }

  // delete content.fn
  // return result

  const content = Object(ct) || window;
  content.fn = this;

  let result;
  if (!arr) {
    result = content.fn()
  } else {
    const arg = [];
    for (let i = 0; i < arr.length; i++) {
      arg.push('arr[' + i + ']')
    }
    result = eval(`content.fn(${arg})`)
  }

  delete content.fn
  return result
}