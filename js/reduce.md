### reduce 语法
arr.reduce(callback, [initialValue])

- callback 详解
  reduce 为数组中的每一个元素依次执行回调函数callback，不包括数组中被删除或从未被赋值的元素，接受四个参数：
  - 「初始值」（或者上一次回调函数的返回值）
  - 「当前元素值」
  - 「当前索引」
  - 「调用 reduce 的数组」。

- initialValue(可选参数)
  当设置了initialValue参数时，callback 第一个参数 初始值将默认是 initialValue。

```js
var arr = [1, 2, 3, 4];
var sum = arr.reduce(function(prev, cur, index, arr) {
    console.log(prev, cur, index);
    // 1 2 1
    // 3 3 2
    // 6 4 3
    return prev + cur;
})
console.log(arr, sum); // [1, 2, 3, 4]  10

// 注意：如果这个数组为空，运用 reduce 是什么情况？ 
// 报错

// 但是要是我们设置了初始值就不会报错
// var  arr = [];
// var sum = arr.reduce(function(prev, cur, index, arr) {
//     console.log(prev, cur, index);
//     return prev + cur;
// }, 0)
```

### reduce 简单用法
1. 数组求和，求乘积
```js
var  arr = [1, 2, 3, 4];
var sum = arr.reduce((x,y)=>x+y)
var mul = arr.reduce((x,y)=>x*y)
console.log( sum ); //求和，10
console.log( mul ); //求乘积，24
```

2. 求数组项最大值
```js
var  arr = [1, 2, 3, 4];
var max = arr.reduce(function (prev, cur) {
    return Math.max(prev,cur);
});
console.log(max) // 4
```

3. 数组去重
```js
var  arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
var newArr = arr.reduce(function (prev, cur) {
    prev.indexOf(cur) === -1 && prev.push(cur);
    return prev;
},[]);
console.log(newArr) // [1, 2, 3, 4, 5]
```

### reduce 高级用法
1. 计算数组中每个元素出现的次数
```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
let nameNum = names.reduce((pre, cur)=>{
  if(cur in pre){
    pre[cur]++
  }else{
    pre[cur] = 1
  }
  return pre
}, {})
console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
```

2. 将二维数组转化为一维
```js
let arr = [[0, 1], [2, 3], [4, 5]]
let newArr = arr.reduce((pre,cur)=>{
    return pre.concat(cur)
},[])
console.log(newArr); // [0, 1, 2, 3, 4, 5]
```

3. 将多维数组转化为一维
```js
let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
const newArr = function(arr){
   return arr.reduce((pre,cur)=>pre.concat(
    Array.isArray(cur)
      ? newArr(cur)
      : cur
  ),[])
}
console.log(newArr(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]
```

4. 对象数组去重
```js
let data = [{
    name: 'tom',
    id: 1
  },
  {
    name: 'jack',
    id: 2
  },
  {
    name: 'sam',
    id: 3
  },
  {
    name: 'mike',
    id: 1
  },
  {
    name: 'amy',
    id: 2
  },
  {
    name: 'eric',
    id: 3
  }
]

let hash = {}
data = data.reduce((item, next) => {
  // 根据 id 去重
  if (!hash[next.id]) {
    hash[next.id] = true
    item.push(next)
  }
  return item
}, [])
console.log(hash) // {1: true, 2: true, 3: true}
console.log(data)
```

5. compose 函数
```js
function compose(...funs) {
    if (funs.length === 0) {
        return arg => arg;
    }
    if (funs.length === 1) {
       return funs[0];
    }
    return funs.reduce((a, b) => (...arg) => a(b(...arg)))
}
```

### reduce构造连续 Promise 回调
- reduce 是 es6 中的遍历叠加方法，在某些时候可以很方便的构造连续 Promise 回调

- 一个简单的例子：
假设现在有很多请求接口,他们之间存在依赖关系，必须等第一个请求结束后再去请求第二个，以此类推，这种需求该如何去实现 ？
```js
let list = [
  'www.baidu.com?a=1',
  'www.baidu.com?b=1',
  'www.baidu.com?c=1',
    ...
]
```
1. 使用async await结合for循环
```js
async function fun(){
  for(let i=0;i<list.length;i++){
    await axios.get(list[i]);
  }
}
```

2. reduce promise then
```js
list.reduce((pre,next)=>{
  return pre.then(()=>axios.get(next));
}, Promise.resolve())
```

3. reduce async await 
```js
list.reduce(async (pre,next)=>{
  await pre;//等待上一个Promise
  return axios.get(next);//返回一个新的Promise
},Promise.resolve())
```