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

// interface 和 type 相类似，但并不完全一致
interface Person {
  // readonly name: string; // 只读不能改
  name: string;
  age?: number;
  [propName: string]: any; // 其他属性
  say(): string;
}

// private, protected, public 访问类型
// public 允许我在类的内外被调用（默认）
// private 允许在类内被使用，类外例如new XX不允许
// protected 允许在类内及继承的子类中使用


// 想让外部只生成一个事例
// static 属性、方法直接挂在类上
// 单例模式
class Demo {
  private static instance: Demo;
  private constructor(public name: string) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Demo('dell lee');
    }
    return this.instance;
  }
}

const demo1 = Demo.getInstance();
const demo2 = Demo.getInstance();
console.log(demo1.name);
console.log(demo2.name);

// 抽象类 abstract
// 子类如果继承了抽象类的父类，必须实现父类的抽象类的方法
abstract class Geom {
  width: number;
  getType() {
    return 'Gemo';
  }
  abstract getArea(): number;
}

class Circle extends Geom {
  getArea() {
    return 123;
  }
}

// 联合类型和保护类型
interface Bird {
  fly: boolean;
  sing: () => string;
}
interface Dog {
  fly: boolean;
  bark: () => string;
}
function trainAnimal(animal: Bird | Dog) {
  if (animal.fly) {
    // animal.sing() 
    // 类型断言
    (animal as Bird).sing();
  }
  (animal as Dog).bark()
}
// in 语法做类型保护
function trainAnimal1(animal: Bird | Dog) {
  if ('sing' in animal) {
    animal.sing() 
  } else {
    animal.bark()
  }
}
// typeof 做类型保护
// instanceof  定义类的类型


// 枚举
enum Status {
  OFFLINE, // 默认0
  ONLINE, // 1
  DELETED // 2
}


// 定义全局变量
// declare var $: (param: () => void) => void;

// 定义全局函数
interface JqueryInstance {
  html: (html: string) => {};
}

declare function $(readyFunc: () => void): void;
declare function $(selector: string): JqueryInstance;
