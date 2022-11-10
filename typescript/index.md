```ts
// interface 和 type 相类似，但并不完全一致
// type与interface 核心的区别在于 type 一旦定义就不能再添加新的属性，而 interface 总是可扩展的。
 // type 可以使用元组类型   interface 能够合并声明

// 扩展interface  --  extends
// 扩展type  --  &    // &符号 就是将多个类型合并为一个类型。

// type 一旦定义就不能再添加新的属性
// 枚举
enum Status {
  OFFLINE, // 默认0
  ONLINE, // 1
  DELETED // 2
}

// typeof 获取一个变量或对象的类型
let p = {
  name: 'zs',
  age:10
}
function p1(parmas: typeof p) {  //它会去解析p。 然后变成 parmas : { name:string, age:number}
  console.log(p.age)
  console.log(p.name)
}

// keyof
// keyof 获取当前属性组成的联合类型  作用是获取键
let obj = { name: 'l', age: 18 }
type keyobj = keyof typeof obj; // name age

 interface IUser {
  name: string;
  age?: number;
  class?: string;
  sex: string;
}

type keys = keyof IUser; // "name" | "age" | "class" | "sex"



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



// 定义全局变量
// declare var $: (param: () => void) => void;

// 定义全局函数
interface JqueryInstance {
  html: (html: string) => {};
}

declare function $(readyFunc: () => void): void;
declare function $(selector: string): JqueryInstance;
```

public，任何地方
private，只能在类的内部访问
protected，能在类的内部访问和子类中访问
Readonly 属性设置为只读

const和readonly的区别
const用于变量，readonly用于属性
const在运行时检查，readonly在编译时检查
使用const变量保存的数组，可以使用push，pop等方法。但是如果使用ReadonlyArray<number>声明的数组不能使用push，pop等方法

extends 继承
namespace 命名空间
declare 声明形式


函数重载
重载签名：就是对参数形式的不同书写，可以定义多种模式。
实现签名：对函数内部方法的具体实现

枚举(enum)：对代码具有侵入式

### Record
<!-- type Record<K extends keyof any, T> = {[P in K]: T}; -->
Record能够快速创建对象类型。它的使用方式是Record<K, V>，能够快速的为object创建统一的key和value类型
```js
const person: Record<string, string> = {
  name: 'l',
  age: 18 // X --- value type should string
} 

interface IUser {
  name: string;
  age?: number;
  class?: string;
  sex: string;
}
type IRH = Record<keyof IUser, string>
let hh: IRH = {
  name: '6',
  age: '6',
  class: '6',
  sex: '0'
}
```
### Pick
Pick：主要作用是从一组属性中拿出某个属性，并将其返回
Pick的使用方法是Pick<P, K>，如（P）类型中拥有name,age,desc三个属性，那么K为 name则最终将取到只有name的属性，其他的将会被排出。
### Omit
Omit：主要作用是从一组属性中排除某个属性，并将排除属性后的结果返回。
Omit的使用方法是Omit<P, K>，与Pick的结果是相反的，如果说Pick是取出，那么Omit则是过滤的效果.
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type IOF = Omit<IUser, 'sex'>
let ff: IOF = {
  name: '4',
  age: 4,
  class: '4',
}
```
### Exclude
Exclude：从一个联合类型中排除掉属于另一个联合类型的子集
来看下，Exclude使用形式是Exclude<T, S>，如果T中的属性在S不存在那么就会返回
```js
interface A {
  show: boolean,
  hidden: boolean,
  status: string
}
interface B {
  show: boolean,
  name: string
}
type outPut = Exclude<keyof A, keyof B> // hidden  status  name
```
### Extract
Extract：跟Exclude相反，从从一个联合类型中取出属于另一个联合类型的子集
举一反三，如果Exclude是取差集，那么Extract就是取交集。会返回两个联合类型中相同的部分。
### Partial
Partial是一个将类型转为可选类型的工具，对于不明确的类型来说，需要将所有的属性转化为可选的?.形式，转换成为可选的属性类型
```js
interface Person {
  name: string,
}
const a: Partial<Person> = {} // name?: string | undefined
```

### Required：将传入的属性变为必选项
```ts
type Required<T> = { [P in keyof T]-?: T[P] };
type IRC = Required<IUser>;

let cc: IRC = {
  name: '2',
  age: 2,
  class: '2',
  sex: '0'
}
```

### never, void 的区别
```js
// never，never表示永远不存在的类型。比如一个函数总是抛出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。函数的返回值就是never类型。
// void, 没有显示的返回值的函数返回值为void类型。如果一个变量为void类型，只能赋予undefined或者null
```

### any unknown
<!-- any 会绕过类型检查，直接可用，而 unkonwn 则必须要在判断完它是什么类型之后才能继续用，会使我们的代码更加安全。 -->





<!-- TypeScript不会防止屎山的出现，也没有大多数人传言中的那么香。
只是很多吹捧的人会把屎山说香。它只是一个类型系统，并没有传的那么神乎其神，
能做的只是杜绝了很多奇技淫巧，让代码可以在一个较为正常的环境下进行开发。 -->