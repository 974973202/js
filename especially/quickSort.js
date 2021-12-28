// 快速排序
// 通过一趟排序，将待排记录分割成独立的两部分，
// 其中一部分记录的关键字均比另外一部分记录的关键字小，
// 则可分别对着两部分记录继续进行排序，以达到整个序列有序的目的

// const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];

// function quickSort(arr) {
//   if (arr.length < 1) {
//     return arr
//   }
//   var pivotIndex = Math.floor(arr.length / 2);
//   var pivot = arr.splice(pivotIndex, 1)[0];
//   var left = [];
//   var right = [];
//   for (var i = 0; i < arr.length; i++) {
//     if (arr[i] < pivot) {
//       left.push(arr[i])
//     } else {
//       right.push(arr[i])
//     }
//   }

//   return quickSort(left).concat([pivot], quickSort(right))
// }
// console.log(quickSort(arr))

// 标准版快速排序
const quickSort = (array) => {
  const sort = (arr, left = 0, right = arr.length - 1) => {
    if (left >= right) {//如果左边的索引大于等于右边的索引说明整理完毕
      return
    }
    let i = left
    let j = right
    const baseVal = arr[j] // 取无序数组最后一个数为基准值
    while (i < j) {//把所有比基准值小的数放在左边大的数放在右边
      while (i < j && arr[i] <= baseVal) { // 找到一个比基准值大的数交换 arr[i] 比 baseVal 小就能进去，进不去的时候。arr[i]就大于baseVal
        i++
      }
      arr[j] = arr[i] // 将较大的值放在右边如果没有比基准值大的数就是将自己赋值给自己（i 等于 j）  此时i空
      while (j > i && arr[j] >= baseVal) { //找到一个比基准值小的数交换
        j--
      }
      arr[i] = arr[j] // 将较小的值放在左边如果没有找到比基准值小的数就是将自己赋值给自己（i 等于 j）  此时j空
    }
    arr[j] = baseVal // 将基准值放至中央位置完成一次循环（这时候 j 等于 i ）
    sort(arr, left, j - 1) // 将左边的无序数组重复上面的操作
    sort(arr, j + 1, right) // 将右边的无序数组重复上面的操作
  }
  const newArr = array.concat() // 为了保证这个函数是纯函数拷贝一次数组
  sort(newArr)
  return newArr
}
console.log(quickSort([9, 7, 4, 9, 7, 3, 2, 0, 2]))

































public static void sort(int[] array, int left, int right) {
  if (left > right) {
    return;
  }
  
  int base = array[left]; // base中存放基准数
  int i = left, j = right;
  while (i != j) {
    while (array[j] >= base && i < j) {  // 顺序很重要，先从右边开始往左找，直到找到比base值小的数
      j--;
    }
    while (array[i] <= base && i < j) { // 再从左往右边找，直到找到比base值大的数
      i++;
    }
    if (i < j) { // 上面的循环结束表示找到了位置或者(i>=j)了，交换两个数在数组中的位置
      int tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }
  // 将基准数放到中间的位置（基准数归位）
  array[left] = array[i];
  array[i] = base;
  // 递归，继续向基准的左右两边执行和上面同样的操作
  // i的索引处为上面已确定好的基准值的位置，无需再处理
  sort(array, left, i - 1);
  sort(array, i + 1, right);
}

public static void main(String[] args) {
  int[] a = { 1, 2, 4, 5, 7, 4, 5 , 3 , 9 , 0};
  quickSort(a);
}  
public static void quickSort(int[] a) {
  if (a.length > 0) {
    sort(a, 0, a.length - 1);
  }
}  
