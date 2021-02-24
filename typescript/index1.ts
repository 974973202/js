// ts的优势
// 1.编写代码的时候能清楚的提示类型错误
// 2.有代码提示
// 3.代码语义更清晰易懂

// 函数类型() => number
const getTotal: () => number = () => {
  return 123;
};

// type annotation 类型注解，告诉ts变量是什么类型
// type inference 类型推断，ts自动分析变量类型
const count1 = 1;
const count2 = 2;
const total = count1 + count2;

let count3 = 1;

function getT(first: number, second: number) {
  return first + second;
}
const T = getT(1, 2);

const obj1 = {
  name: "lzx",
  age: 18,
};

// void 无返回值
function sayLzx(): void {
  console.log("lzx");
}

// never 无法返回
function errorLzx(): never {
  // throw new Error()
  while (true) {}
}

// 解构的写法
function add({ first, second }: { first: number; second: number }): number {
  return first + second;
}

const A = add({ first: 1, second: 2 });

// 基础类型, boolean, number, string, void, undefined, symbol, null

// 对象类型, {}, Class, function, []

interface Point {
  x: number;
  y: string;
}

const point: Point = {
  x: 123,
  y: "123",
};

const numberArr: number[] = [1, 2, 3];
const arr: (number | string)[] = [1, "2", 3];

// type alias 类型别名
type User = {
  name: string;
  age: number;
};

const objectArr: User[] = [
  {
    name: "dell",
    age: 28,
  },
];

// 元组 tuple 约束数组每一项具体的值
const teacherInfo: [string, string, number] = ["l", "z", 3];
const teacherList: [string, string, number][] = [
  ["l", "z", 3],
  ["l", "z", 3],
];
