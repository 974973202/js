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



// const obj ={
//   a:1,
//   b:2,
// }
// for(c in obj){
//   console.log(c)
// }

const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];

function selectSort(array) {
  var min;
  for (var i = 0; i < array.length - 1; i++) {
    min = i; // 一开始默认当前为最小数的下标
    for (var j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) { // 记住最小数的下标，后面 《 前面
        min = j
      }
    }
    if (min != i) { // 最小值不是当前位置 则交换
      [array[min], array[i]] = [array[i], array[min]]
    }
  }
  return array;
}
console.log(selectSort(arr))


