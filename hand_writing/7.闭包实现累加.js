function add() {
  let sum = 0;
  function innerAdd(num) {
    sum += num;
    return sum;
  }
  return innerAdd;
}

const addFunc = add();
console.log(addFunc(1)); // 输出 1
console.log(addFunc(2)); // 输出 3
console.log(addFunc(3)); // 输出 6