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

// 1
function unique(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if(arr.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result;
}

function unique(arr) {
  const result = [];
  for(let i = 0; i < arr.length; i++) {
    if(arr.indexOf(arr[i]) === -1) {
      result.push(arr[i])
    }
  }
  return result;
}

// 2
function fn(n) {
  if(n==1 &&n==2) {
    return 1
  }
  return fn(n-1)+fn(n-2)
}
// 3
function flat(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
// 交集
[...new Set(arr1)].filter(item => new Set(arr2).has(item));
// 节流 规定时间一次
function throttle(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if(!timeout) {
      timeout = setTimeout(()=> {
        timeout = null
        func.apply(context, args);
      },wait)
    }
  }
}

// 防抖 停止触发执行
function debounce(func, wait) {
  let timeout;
  return function () {
    let args = arguments;
    let context = this;
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(()=> {
      func.apply(context, args)
    },wait)
  }
}

// ### 最小生成树
// - Prim (选近的边相连)
// - Kruskal (选最小的边相连)
// ### 最短路径
// - Dijkstra
// - Floyd
// ### 拓扑排序(AOV) 检测有向无环

// 发布订阅
const listener = {};
listener.List = [];
listener.listen = function (fn) {
  this.listener.List.push(fn)
}
listener.trigger = function () {
  for (let i = 0; i < listener.List.length; i++) {
    const fn = listener.List[i];
    fn.apply(this,arguments);
  }
}

listener.listen((a,b) => console.log(a,b));

listener.trigger(1, 2)

// 观察者模式
class Subject() {
  constructor() {
    this.observers = [];
  }
  ob(fn) {
    if(fn && fn.update) {
      this.observers.push(fn)
    }
  }

  notify() {
    this.observers.forEach(ele => {
      ele.update()
    })
  }
}

class Ob{
  update() {
    console.log(12)
  }
}

suject = new Subject()
obj1 = new Ob()

suject.ob(obj1)
suject.notify()

// 广
function scopeSearch(root, target) {
  if(root == null) return false;
  let childRoot = []; // 当前层所有子节点的节点
  for(let i = 0; i < root.length; i ++) {
    if(root[i].value == target) {
      return true
    } else {
      childRoot.push(root[i].left)
      childRoot.push(root[i].right)
    }
  }
  return scopeSearch(childRoot, target)
}

// 深
function deepSearch(root, target) {
  if (root == null) return false;
  if (root.value == target) return true;
  var left = deepSearch(root.left, target);
  var right = deepSearch(root.right, target);
  return left || right;
}

function bubbleSort(arr) {
  for(let i = 0; i < arr.length - 1; i++) {
    for(let j = 0; j < arr.length - i-1; j++) {
      if(arr[j]> arr[j+1]) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr
}

function quickSort(arr) {
  let midIndex = Math.floor(arr.length/2);
  let mid = arr.splice(midIndex, 1)[0];
  let right = []
  let left = []
  for(let i = 0; i < arr.length; i ++) {
    if(arr[i] > mid) { // 前比后大，去右边
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return quickSort(left).concat([mid], quickSort(right))
}

// 圣杯模式继承
function extend(Target, Origin) {
  function F() {};
  F.prototype = Origin.prototype;
  Target.prototype = new F();

  Target.prototype.constructor = Target;
  Target.prototype.uber = Origin.prototype;
}

// join slice ... concat indexOf includes
// animation keyframes transition transform-style compositor

// DOMcontentLoaded

function Clone(obj) {
  if(!obj) return obj
    let target = Array.isArray(obj) ? [] : {};
    for(let key in obj) {
      if(obj.hasOwnProperty(key)) {
        if(typeof obj[key] == 'object' && obj != null){
          target[key] =  Clone(obj[key])
        } else {
          target[key] =obj[key]
        }
      }
    }
    return target;
}