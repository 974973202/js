## ts 是一门静态类型语言，但它要编译成为 js 这个弱类型语言来执行，所以它管得了编译时，却管不了运行时

### interface 和 type
- type与interface 核心的区别在于 type 一旦定义就不能再添加新的属性，而 interface 总是可扩展的。
- type 可以使用元组类型 联合类型
- type 语句中还可以使用 typeof 获取实例的 类型进行赋值
- interface 能够合并声明
- 扩展interface  --  extends
- 扩展type  --  &符号 就是将多个类型合并为一个类型。

### enum 枚举
```ts
// 枚举
enum Status {
  OFFLINE, // 默认0
  ONLINE, // 1
  DELETED // 2
}

enum Status {
  OFFLINE = 'offline', 
  ONLINE = 'online', 
  DELETED = 'delete'
}
```

### typeof
- typeof 获取一个变量或对象的类型
- typeof 类型推断
```ts
const p = {
  name: 'zs',
  age: 10,
};
// 它会去解析p。 然后变成 parmas : { name:string, age:number}
function p1(parmas: typeof p) {
  console.log(parmas.age);
  console.log(parmas.name);
}
```

### keyof
- keyof 获取当前属性组成的联合类型  作用是获取键
```ts
const obj = { name: 'l', age: 18 };
type keyobj = keyof typeof obj; // type keyobj = "name" | "age"
interface IUser {
  name: string;
  age?: number;
  class?: string;
  sex: string;
}
type keys = keyof IUser; // type keys = "name" | "age" | "class" | "sex"
```

### in 一般配合 keyof使用，是遍历key值的效果
```ts
type keysobj = {
  [key in keyof IUser]: any
}
// type keysobj = {
//     name: any;
//     age?: any;
//     class?: any;
//     sex: any;
// }
```

### infer
- 可以用 infer 声明一个类型变量并且对它进行使用
- infer是一个关键字，用于在条件类型中推断类型变量。它通常与extends关键字一起使用
- infer 出现在extends 上
```ts
/** 
 *  在类型定义中，使用了条件类型的语法 T extends (param: infer P) => any ? P : T。
 *  这个条件类型表示如果T是一个函数类型，那么将函数参数的类型P作为结果类型；
 *  否则，将T作为结果类型。
 * */ 
type inferType<T> = T extends (param: infer P) => any ? P : T

type MyFunction = (param: string) => void;
type MyNumber = number;

type Result1 = inferType<MyFunction>; // Result1的类型为string
type Result2 = inferType<MyNumber>; // Result2的类型为number

// MyFunction是一个函数类型，它的参数类型是string，所以Result1的类型为string。
// 而MyNumber是一个普通的number类型，所以Result2的类型为number

type ArrayElementType<T> = T extends (infer U)[] ? U : never;
```

### private, protected, public, static, abstract
- public 允许我在类的内外被调用（默认）
- private 允许在类内被使用，类外例如new XX不允许
- protected 允许在类内及继承的子类中使用
- static 属性、方法直接挂在类上
- abstract 子类如果继承了抽象类的父类，必须实现父类的抽象类的方法
- 
```ts
// static 单例模式
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

// abstract
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
```

### 联合类型和保护类型
```ts
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
```

### 定义全局变量 & 定义全局函数
- declare 声明形式
```ts
// 定义全局变量
declare var $: (param: () => void) => void;
// 定义全局函数
interface JqueryInstance {
  html: (html: string) => {};
}
declare function $(readyFunc: () => void): void;
declare function $(selector: string): JqueryInstance;
```

### 函数重载
重载签名：就是对参数形式的不同书写，可以定义多种模式。
实现签名：对函数内部方法的具体实现

### extends 继承 类型约束
```ts
interface ILengthwise {
  length: number;
}
function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// 现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
loggingIdentity(3);  // Error, number doesn't have a .length property
// 这时我们需要传入符合约束类型的值，必须包含必须的属性：
loggingIdentity({length: 10, value: 3});
```

### implements和extends
1. implements和extends是用来定义类之间关系的关键字
2. implements关键字用于类实现接口。当一个类实现一个接口时，它必须实现接口中定义的所有属性和方法。这可以确保类具有接口所需的行为
3. extends关键字用于类继承。一个类可以从另一个类继承属性和方法。子类可以访问父类的公共成员，也可以重写父类的方法。一个类只能继承自一个类，但可以实现多个接口

### namespace 命名空间

### never, void 的区别
```js
// never，never表示永远不存在的类型。比如一个函数总是抛出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。函数的返回值就是never类型。
// void, 没有显示的返回值的函数返回值为void类型。如果一个变量为void类型，只能赋予undefined或者null
```

### any unknown
<!-- any 会绕过类型检查，直接可用，而 unkonwn 则必须要在判断完它是什么类型之后才能继续用，会使我们的代码更加安全。 -->
- any 任何类型，会忽略语法检查
- unknown 不可预知的类型，不会忽略语法检查（这就是最大区别）

### 类型断言 as
- ts 只管编译时，不管运行时。as 就是典型的例子，你用 as 告诉编译器类型，编译器就听你的。但运行时，后果自负。
- as 语句的作用：会对映射类型中的键进行重新映射（TypeScript4.1版本中新增加的语法）
- as 语句后面新映射类型必须是 string|number|symbol 联合类型的子类型。

### 非空断言操作符 !
- ! 用于排除 null undefined ，即告诉编译器：xx 变量肯定不是 null 或 undefined
- 非空断言操作符 ! 在 TypeScript 中用于告诉编译器某个变量一定不为 null 或 undefined。`它可以在变量后面加上 ! 来使用`

### Readonly
```ts
type ReadOnly<T> = { readonly [P in keyof T]:T[P] }
```

### Record
```ts
type Record<K extends keyof any, T> = { [P in K]: T }
```
Record能够快速创建对象类型。它的使用方式是Record<K, V>，能够快速的为object创建统一的key和value类型
```js
interface IUser {
  name: string;
  age?: number;
  class?: string;
  sex: string;
}
type IRH = Record<keyof IUser, string>; // ==》 Record<string, string>
let hh: IRH = {
  name: '6',
  age: '6',
  class: '6',
  sex: '0'
}
```
### Pick
Pick<T, K>从一个复合类型 T 中取出几个想要的属性 K，构造一个新类型。
Pick：主要作用是从一组属性中拿出某个属性，并将其返回
Pick的使用方法是Pick<P, K>，如（P）类型中拥有name,age,desc三个属性，那么K为 name则最终将取到只有name的属性，其他的将会被排出。
源码：type MyPick<T, K extends keyof T> = { [S in K]: T[S] };
```ts
// S是遍历K的值
type Pick<T, K extends keyof T> = { [S in K]: T[S] };
```
### Omit
Omit：主要作用是从一组属性中排除某个属性，并将排除属性后的结果返回。
Omit的使用方法是Omit<P, K>，与Pick的结果是相反的，如果说Pick是取出，那么Omit则是过滤的效果.
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type IOF = Omit<IUser, 'sex' | 'xx'>
let ff: IOF = {
  name: '4',
  age: 4,
  class: '4',
}
```
### Exclude 差集
Exclude：从一个联合类型中排除掉属于另一个联合类型的子集
来看下，Exclude使用形式是Exclude<T, S>，如果T中的属性在S不存在那么就会返回
```ts
type Exclude<T, U> = T extends U ? never : T;

interface A {
  show: boolean;
  hidden: boolean;
  status: string;
}
interface B {
  show: boolean;
  name: string;
}
type outPut = Exclude<keyof A, keyof B> // type outPut = "hidden" | "status"
```
### Extract 交集
Extract：跟Exclude相反，从从一个联合类型中取出属于另一个联合类型的子集
举一反三，如果Exclude是取差集，那么Extract就是取交集。会返回两个联合类型中相同的部分。

### Partial
Partial是一个将类型转为可选类型的工具，对于不明确的类型来说，需要将所有的属性转化为可选的?.形式，转换成为可选的属性类型
源码： 
```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
interface Person {
  name: string;
}
const a: Partial<Person> = {} // name?: string | undefined

// 源码详细解析
type keys = keyof Person
type Test = {
  [key in keyof keys]: any
}
type PersonOpt = {
  [p in keyof keys]?: Person[p]
}
type Partial<T> = {
  [P in keyof T]?: T[P]
}
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


### 1. 写业务，类型拆分解耦
```ts
// 有一个需求：做一个答题 PK 小程序问答记录排行榜的时候
// 这两个 interface 的定义，具有相同的片段，可以根据功能和模块拆分一下重复接口声明
interface IUserBaseInfo {
  createTime: string;
  userName: string;
  userAvatar: string;
}
interface IQuestionRecord {
  question: {
    title: string;
    content: string;
    picture: string[];
  };
}
interface IAnswerRecord {
  answer: {
    comment: string;
    audio?: {
      url: string;
    };
  };
}

// 使用交叉类型进行接口混入
type Mixin<T, X> = {
  [P in keyof (T & X)]: (T & X)[P];
};
// 更简单的写法
type Mixin<T, X> = T & X;

// 用泛型混入，方便之后还会出现什么数据也带有用户基础信息
// 方便做拓展和复用
type MixinUserBaseInfo<T> = Mixin<IUserBaseInfo, T>;

interface IRecordConfig {
  question?: MixinUserBaseInfo<IQuestionRecord>;
  answer?: MixinUserBaseInfo<IAnswerRecord>;
}
// 最终使用的时候输列表数据
export type RecordConfigList = IRecordConfig[];

```

### 例子2: 处理函数参数
```ts
// 函数需要定义一些传参，而这些参数的定义可能用到多个函数，有时候是必填参数，有时候是可选参数

// IArgsBase 接口
export interface IArgsBase<T>{
  name?:string;
  description?:string;
  visible?:boolean;
  execConf:T:(() => T);
}

// RequireArg 类型
export type RequiredArg<T> = IArgsBase<T> & {
  required: true;
  value: T;
};

// OptionalArg 类型
export type OptionalArg<T> = IArgsBase<T> & {
  required: false;
  value?: T;
};

// OptionalArg 类型使用例子
interface User {
  val: string;
}
const testFun = (args: OptionalArg<User>):User => {
  return {
    val: '好好好',
  };
}
testFun({ name: '123', required: true, execConf: { val: '123' } });

// 与 例子 1 异曲同工，只是使用场景有些不同。
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

### 例子3 我们用其他组件库的组件，但是会在他的 props 基础上增加一些我们的 props 属性
```ts
// 以开发某个组件为例
class CustomModal<T> extends React.Component<ComponentProps & T> {}

function func<T>(type: T) {
  // ...
  ele[type as T] = 'xxx'
}
func<keyof DataTableModelModel>('123')
```
