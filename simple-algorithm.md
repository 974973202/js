### 一个数组的全排列
```js
// 一个数组的全排列
var arr = [1, 2, 3];
//swap用来交换数组a中的两个元素
function swap(arr, p, q) {
  [arr[p], arr[q]] = [arr[q], arr[p]]
}

//全排列函数pai，在数组arr中，对p位置到q位置之间的元素进行全排列
function pai(arr, p, q) {
  if (p == q) {
    console.log(arr) //一个数的全排列就是自己，输出自己
  } else {
    for (let i = p; i < q; i++) {
      swap(arr, i, p);//把 arr 中的每个元素都作一次头元素
      pai(arr, p + 1, q);//对头元素后的数据再次递归实现全排列
      swap(arr, i, p);//排完之后要换回来，防止重复排列
    }
  }
}
pai(arr, 0, arr.length);
```

### 多叉树, 获取每一层的节点之和
```js
function layerSum(root) {
  if (root.children) {
    for (const item of root.children) {
      layerSum(item)
      root.value += item.value
    }
    return root.value
  }
  return root.value

}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] }
  ]
});

console.log(res);
```

### 特定数组按序合并
```js
// 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 
// 和 [A, B, C, D]，
// 合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]
let a1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let a2 = ['A', 'B', 'C', 'D'].map((item) => {
  return item + 3
})

let a3 = [...a1, ...a2].sort().map((item) => {
  if (item.includes('3')) {
    return item.split('')[0]
  }
  return item
})
```