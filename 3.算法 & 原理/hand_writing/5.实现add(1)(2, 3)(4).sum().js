
// 实现 add(1)(2, 3)(4).sum()  输出10
function add(num) {
  let numbers = [num];

  function innerAdd(...args) {
    numbers.push(...args);
    return innerAdd;
  }

  innerAdd.sum = function () {
    return numbers.reduce((acc, val) => acc + val, 0);
  };

  return innerAdd;
}

console.log(add(1)(2, 3)(4).sum()); // 输出 10
