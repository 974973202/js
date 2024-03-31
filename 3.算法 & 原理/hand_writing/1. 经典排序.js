const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];

// 简单选择排序  记住最小数的下标，往前排
function selectSort(array) {
  let min;
  for(let i = 0; i < array.length; i ++) {
    min = i;
    for(let j =i + 1; j < array.length; j ++) {
      if (array[j] < array[i]) min = j;
    }
    if (min != i) {
      [arr[i], arr[min]] = [arr[min], arr[i]]
    }
  }
  return array
}

// 冒泡排序 两两交换
// 总结
// 1、外层 for 循环控制循环次数
// 2、内层 for 循环进行两数交换，找每次的最大数，排到最后
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) { // 第一个for是遍历
    for (let j = 0; j < arr.length - i - 1; j++) { // 第二个for是比较
      // 每完成一次排序完成必然选出最大的一位放后面，所以减i是最后面的数据不需要再次比较。减1是数组下标从0开始
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr;
}

// 快速排序1 递归 选取中间元素做比较
function quickSort(arr) {
  if (arr.length < 1) {
    return arr;
  }
  const pivot = arr[0];
  const left = [];
  const right = [];
  for (let i = 0; i< arr.length; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

// 快排2 标准版
// 通过一趟排序，将待排记录分割成独立的两部分，
// 其中一部分记录的关键字均比另外一部分记录的关键字小，
// 则可分别对着两部分记录继续进行排序，以达到整个序列有序的目的
const quickSort = (array) => {

  const sort = (arr, L = 0, R = arr.length - 1) => {
    //如果左边的索引大于等于右边的索引说明整理完毕
    if (L >= R) return;

    // 1
    const baseVal = arr[R]; // 最后一个数为基准值
    
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