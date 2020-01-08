// 插入排序
// 找到部分排序好的后一位元素与排序好的进行比较，插入


const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];
function directInsertionSort1(arr) {
  for (let i = 1; i < arr.length; i++) {
    let index = i - 1; // 待比较元素的下标
    let current = arr[i]; // 部分排序好的后一位元素
    while (index >= 0 && arr[index] > current) { // 前一位大于后一位
      arr[index + 1] = arr[index]; // 放后一位
      index--;
    }
    if (index + 1 != i) {
      arr[index + 1] = current;
    }
  }
  return arr
}
console.log(directInsertionSort1(arr))