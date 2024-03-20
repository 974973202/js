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
    while (index >= 0 && arr[index] > current) {
      // 前一位大于后一位
      // console.log(arr[index], current, arr[index + 1], index)
      arr[index + 1] = arr[index]; // 放后一位
      index--;
    }
    if (index + 1 != i) {
      // index 一直减小
      arr[index + 1] = current;
    }
  }
  return arr;
}

// 折半插入排序
function binsertSort(arr) {
  var low, high, j, temp;
  for (var i = 1; i < arr.length; i++) {
    // 1
    temp = arr[i];
    low = 0;
    high = i - 1;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      if (temp > arr[mid]) { // 插入值大于中间值
        low = mid + 1;
      } else { // 插入值小于中间值
        high = mid - 1;
      }
    }
    for (j = i; j > low; --j) {
      // 2
      arr[j] = arr[j - 1]; // 右移
    }
    // 3
    arr[j] = temp;
  }
}

// 希尔排序。取增量递减 间隔排序
function shellSort(arr) {
  var temp,
    gap = 1;

  while (gap < arr.length / 5) {
    //动态定义间隔序列 /5 等于 1和6比
    gap = gap * 5 + 1;
  }
  console.log(gap);
  for (gap; gap > 0; gap = Math.floor(gap / 5)) {
    console.log(gap);
    for (var i = gap; i < arr.length; i++) {
      // 1
      temp = arr[i];
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        // 2
        arr[j + gap] = arr[j];
      }
      //3
      arr[j + gap] = temp;
    }
  }
  return arr;
}
```

### 冒泡排序 快速排序

```js
// 冒泡排序 两两交换
// 总结
// 1、外层 for 循环控制循环次数
// 2、内层 for 循环进行两数交换，找每次的最大数，排到最后
const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];
function bubbleSort(arr) {
  for (var i = 0; i < arr.length - 1; i++) { // 第一个for是遍历
    for (var j = 0; j < arr.length - i - 1; j++) { // 第二个for是比较
      // 每完成一次排序完成必然选出最大的一位放后面，所以减i是最后面的数据不需要再次比较。减1是数组下标从0开始
      if (arr[j] > arr[j + 1]) {
        // var temp = arr[j];
        // arr[j] = arr[j + 1];
        // arr[j + 1] = temp;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr;
}


// 快速排序1 递归 选取中间元素做比较
const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];

function quickSort(arr) {
  if (arr.length < 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat([pivot], quickSort(right));
}

// 快排2 标准版
// 通过一趟排序，将待排记录分割成独立的两部分，
// 其中一部分记录的关键字均比另外一部分记录的关键字小，
// 则可分别对着两部分记录继续进行排序，以达到整个序列有序的目的
const quickSort = (array) => {
  const sort = (arr, leftIndex = 0, rightIndex = arr.length - 1) => {
    //如果左边的索引大于等于右边的索引说明整理完毕
    if (leftIndex >= rightIndex) return;
    let L = leftIndex;
    let R = rightIndex;
    
    // 1
    const baseVal = arr[R]; // 取无序数组最后一个数为基准值
    while (L < R) {
      //把所有比基准值小的数放在左边大的数放在右边
      while (L < R && arr[L] <= baseVal) {
        // 找到一个比基准值大的数交换 arr[L] 比 baseVal 小就能进去，进不去的时候。arr[L]就大于baseVal
        L++;
      }
      // 2
      arr[R] = arr[L]; // 将较大的值放在右边如果没有比基准值大的数就是将自己赋值给自己（i 等于 j）  此时i空
      while (R > L && arr[R] >= baseVal) {
        //找到一个比基准值小的数交换
        R--;
      }
      // 3
      arr[L] = arr[R]; // 将较小的值放在左边如果没有找到比基准值小的数就是将自己赋值给自己（i 等于 j）  此时j空
    }
    // 4
    arr[R] = baseVal; // 将基准值放至中央位置完成一次循环（这时候 R 等于 L ）
    sort(arr, left, R - 1); // 将左边的无序数组重复上面的操作
    sort(arr, R + 1, right); // 将右边的无序数组重复上面的操作
  };
  const newArr = array.concat(); // 为了保证这个函数是纯函数拷贝一次数组
  sort(newArr);
  return newArr;
};
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
}


/*方法说明：堆排序
@param  array 待排序数组*/
function heapSort(array) {
    console.time('堆排序耗时');
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
        //建堆
        var heapSize = array.length, temp;
        for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
            heapify(array, i, heapSize);
        }

        //堆排序
        for (var j = heapSize - 1; j >= 1; j--) {
            temp = array[0];
            array[0] = array[j];
            array[j] = temp;
            heapify(array, 0, --heapSize);
        }
        console.timeEnd('堆排序耗时');
        return array;
    } else {
        return 'array is not an Array!';
    }
}
/*方法说明：维护堆的性质
@param  arr 数组
@param  x   数组下标
@param  len 堆大小*/
function heapify(arr, x, len) {
    if (Object.prototype.toString.call(arr).slice(8, -1) === 'Array' && typeof x === 'number') {
        var l = 2 * x + 1, r = 2 * x + 2, largest = x, temp;
        if (l < len && arr[l] > arr[largest]) {
            largest = l;
        }
        if (r < len && arr[r] > arr[largest]) {
            largest = r;
        }
        if (largest != x) {
            temp = arr[x];
            arr[x] = arr[largest];
            arr[largest] = temp;
            heapify(arr, largest, len);
        }
    } else {
        return 'arr is not an Array or x is not a number!';
    }
}
var arr=[91,60,96,13,35,65,46,65,10,30,20,31,77,81,22];
```

### 归并排序 基数排序

```js
// 归并排序 长度为n的输入序列分成两个长度为n/2的子序列
function mergeSort(arr) {
  //采用自上而下的递归方法
  var len = arr.length;
  if (len < 2) {
    return arr;
  }
  var middle = Math.floor(len / 2), // 8 4 2 1归并
    left = arr.slice(0, middle),
    right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var result = [];
  console.time("归并排序耗时");
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length) result.push(left.shift());

  while (right.length) result.push(right.shift());
  console.timeEnd("归并排序耗时");
  return result;
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(mergeSort(arr));

// 基数排序 从数值最后位向前
/**
 * 基数排序适用于：
 *  (1)数据范围较小，建议在小于1000
 *  (2)每个数值都要大于等于0
 * @author xiazdong
 * @param  arr 待排序数组
 * @param  maxDigit 最大位数
 */
//LSD Radix Sort

function radixSort(arr, maxDigit) {
  var mod = 10;
  var dev = 1;
  var counter = [];
  console.time("基数排序耗时");
  for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (var j = 0; j < arr.length; j++) {
      var bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    var pos = 0;
    for (var j = 0; j < counter.length; j++) {
      var value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  console.timeEnd("基数排序耗时");
  return arr;
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(radixSort(arr, 2));
```

希快简堆不稳，快堆归 nlogn
