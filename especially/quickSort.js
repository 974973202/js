// 快速排序
// 通过一趟排序，将待排记录分割成独立的两部分，
// 其中一部分记录的关键字均比另外一部分记录的关键字小，
// 则可分别对着两部分记录继续进行排序，以达到整个序列有序的目的

const arr= [9, 7, 4, 9, 7, 3, 2, 0, 2];

function quickSort(arr) {
  if(arr.length < 1) {
    return arr
  }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return quickSort(left).concat([pivot], quickSort(right))
}
console.log(quickSort(arr))