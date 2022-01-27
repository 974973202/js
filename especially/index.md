https://xiaochen1024.com/courseware/60b4f11ab1aa91002eb53b18/61963bcdc1553b002e57bf13
- 时间复杂度指的是一个算法执行所耗费的时间
- 空间复杂度指运行完一个程序所需内存的大小
### 直接插入排序 折半插入排序 希尔排序 
```js
// 直接插入排序  找到部分排序好的后一位元素与排序好的进行比较，插入
const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];
function directInsertionSort1(arr) {
  for (let i = 1; i < arr.length; i++) {
    let index = i - 1; // 待比较元素的下标
    let current = arr[i]; // 部分排序好的后一位元素
    while (index >= 0 && arr[index] > current) { // 前一位大于后一位
      // console.log(arr[index], current, arr[index + 1], index)
      arr[index + 1] = arr[index]; // 放后一位
      index--;
    }
    if (index + 1 != i) { // index 一直减小
      arr[index + 1] = current;
    }
  }
  return arr
}
```

### 冒泡排序 快速排序 
```js
// 冒泡排序 两两交换
const arr= [9, 7, 4, 9, 7, 3, 2, 0, 2];
function bubbleSort(arr) {
  for(var i = 0; i < arr.length - 1; i++) {
    for(var j = 0; j < arr.length - i - 1; j++) { // 每完成一次排序完成必然选出最大的一位放后面，所以减i是最后面的数据不需要再次比较。减1是数组下标从0开始
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr;
}
// 总结
// 1、外层 for 循环控制循环次数
// 2、内层 for 循环进行两数交换，找每次的最大数，排到最后


```

### 简单选择排序 堆排序
```js
// 简单选择排序  记住最小数的下标，往前排
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
      var temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
    }
  }
  return array;
```

### 归并排序 基数排序


希快简堆不稳，快堆归nlogn