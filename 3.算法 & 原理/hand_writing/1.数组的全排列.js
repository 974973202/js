// 一个数组的全排列
var arr = [1, 2, 3];
//swap用来交换数组a中的两个元素
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]]
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