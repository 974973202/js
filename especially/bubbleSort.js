// 冒泡排序
// 性能
// 时间复杂度： 平均时间复杂度O(n*n) 、最好情况O(n)、最差情况O(n*n)
// 空间复杂度： O(1) 
// 稳定性：稳定

// 时间复杂度指的是一个算法执行所耗费的时间
// 空间复杂度指运行完一个程序所需内存的大小
// 稳定指，如果a=b,a在b的前面，排序后a仍然在b的前面
// 不稳定指，如果a=b，a在b的前面，排序后可能会交换位置

// 总结
// 1、外层 for 循环控制循环次数
// 2、内层 for 循环进行两数交换，找每次的最大数，排到最后

const arr= [9, 7, 4, 9, 7, 3, 2, 0, 2];

function bubbleSort(arr) {
  for(var i = 0; i < arr.length - 1; i++) {
    for(var j = 0; j < arr.length - i - 1; j++) {
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
console.log(bubbleSort(arr))