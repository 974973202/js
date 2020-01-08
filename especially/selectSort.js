// 选择排序
// 找小的，一个个比较排前面

const arr = [9, 7, 4, 9, 7, 3, 2, 0, 2];

function selectSort(array) {
  var length = array.length, min;
  for (var i = 0; i < length - 1; i++) {
    min = i;
    for (var j = i + 1; j < length; j++) {
      if (array[j] < array[min]) { // 记住最小数的下标
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