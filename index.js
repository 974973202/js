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

// 普里姆算法(加点法)
var max = 10000
function Node(value) {
  this.value = value;
  this.neighbor = [];
}
var pointSet = [new Node('A'), new Node('B'), new Node('C'), new Node('D'), new Node('E')]
var distance = [
  [0, 4, 7, max, max],
  [4, 0, 8, 6, max],
  [7, 8, 0, 5, max],
  [max, 6, 5, 0, 7],
  [max, max, max, 7, 0],
]
function getIndex(str) {
  for (var i = 0; i < pointSet.length; i++) {
    if (str == pointSet[i].value) return i;
  }
  return -1
}
// 需要传入点的集合，边的集合，当前已经连接进入的集合
// 根据已有的点来判断，获取距离最短的点
function getMinDisNode(pointSet, distance, nowPointSet) {
  var fromNode = null; //线段起点
  var minDisNode = null; //线段终点
  var minDis = max;
  // 根据当前已有的这些点为起点，以此判断连接其他的点的距离是多少
  for (var i = 0; i < nowPointSet.length; i++) {
    var nowPointIndex = getIndex(nowPointSet[i].value)//获取当前节点的序号
    for (var j = 0; j < distance[nowPointIndex].length; j++) {
      var thisNode = pointSet[j]; //thisNode是distance的点但不是对象
      if (nowPointSet.indexOf(thisNode) < 0
        && distance[nowPointIndex][j] < minDis) { // 这个点不能是接入的点 && 点之间的距离是目前最短的
        fromNode = nowPointSet[i];
        minDisNode = thisNode;
        minDis = distance[nowPointIndex][j];
      }
    }
  }
  fromNode.neighbor.push(minDisNode)
  minDisNode.neighbor.push(fromNode)
  return minDisNode
}
function prim(pointSet, distance, start) {
  var nowPointSet = []
  nowPointSet.push(start)
  // 获取最小代价的边
  while (true) {
    var minDisNode = getMinDisNode(pointSet, distance, nowPointSet)
    nowPointSet.push(minDisNode);
    if (nowPointSet.length == pointSet.length) {
      break;
    }
  }
}
prim(pointSet, distance, pointSet[2])
console.log(pointSet)