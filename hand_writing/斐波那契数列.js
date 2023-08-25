// 斐波那契数列  1、1、2、3、5、8、13、21、
// 这个数列从第3项开始，每一项都等于前两项之和
function fb(n) {
  if (n == 1 || n == 2) {
    return 1;
  }
  return fb(n - 1) + fb(n - 2)
}
function fb1(n) {
  if (n <= 1) {
  } else {
    return fb1(n - 1) + fb2(n - 2)
  }
}

function fb2(n) {
  var b = 1; // 记录 n - 1次的数
  var sum = 1;
  for (var i = 1; i < n; i++) {
    var tmp = sum;
    sum += b;
    b = tmp;
  }
  return sum;
}

// 递归
function factorial(n) {
  if (n === 1) return n;
  return n * factorial(n - 1);
}

// 这样会保存n调记录，复杂程度要吐血
// 如果可以改成写尾递归呢（只用保留一个调用记录）

// 尾递归
// 尾递归函数每子一层不再需要使用父一层的变量，
// 所以父一层执行完毕就会销毁栈记录，
// 避免了内存溢出节省了内存空间
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
factorial(5, 1); //输出120

