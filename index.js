// async function async1() {
//   console.log('async1 start')
//   await async2()
//   console.log('async1 end')
// }
// async function async2() {
//   console.log('async2')
// }
// console.log('script start')
// setTimeout(function () {
//   console.log('setTimeout0')
// })
// setTimeout(function () {
//   console.log('setTimeout3')
// }, 3)
// setImmediate(() => console.log('setImmediate'));
// process.nextTick(() => console.log('nextTick'));
// async1();
// new Promise(function (resolve) {
//   console.log('promise1')
//   resolve();
//   console.log('promise2')
// }).then(function () {
//   console.log('promise3')
// })
// console.log('script end')

// const path = require('path');
// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd());
// console.log(path.resolve('./'));


//  function test1(Test) {
//     Test.prototype._init = function(ele) {
//      console.log(ele, this)
//    }
//  }



// const fun = (val, cb) => {
//   cb(null, 456)
// }

// fun('123', function (err, data){
//   console.log(data)
// })

// let a = [{ id: 1, name: 'zhang' }, { id: 2, name: 'li' }, { id: 3, name: 'chun' }];

// let b = [{ id: 1, age: 10 }, { id: 2, a: 99 }, { id: 4, age: 20, name: 'xx' }, { id: 5, age: 30 }];
// let arr = []
// b.forEach(x => a.forEach(y => {
//   if (y.id === x.id) {
//     arr.push({ ...x, ...y })
//   }
// }));
// let arr1 = b.filter(x => a.every(y => y.id !== x.id));
// let arr2 = a.filter(x => b.every(y => y.id !== x.id));
// console.log([...arr, ...arr1, ...arr2])



function curry(fn) {
  return function other(arg) {
    if(arg.length >= fn.lenght) {
      fn(...arg)
    } else {
      return (...arg) => other(...arg, ...rest)
    }
  }
}

function create() {
  let obj = new Object();
  let Con = [].shift.call(arguments);
  obj.__proto__ = Con.prototype;
  let result = Con.apply(obj, arguments)
  return typeof result === 'object'? result : obj
}


function debounce(func, wait, immediate){
  let timeout;
  return function () {
    let context  = this;
    let args = arguments;
    if(timeout) clearTimeout(timeout);
    if(immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if(callNow) func.apply(context, args);
    } else {
      setTimeout(() => {
        func.apply(context, wait)
      }, wait)
    }
  }
}

