- 基本数据类型（原始值）：Number  Boolean  String  undefined  null  **栈内存（stack）**
- 引⽤类型（引用值）：array  Object  function  data  RegExp...   **堆内存（heap）**
- 栈和堆的区别
 - 栈：下馆子
 - 堆：自己搞

- 判断布尔值为false的6种情况： undefined  null  NaN  “”  0  false 
- javascript有8种内置类型：null, undefined, boolean, number, string, object, symbol，bigInt
- typeof可判断的类型： 1.string  2.number  3.boolean  4.object  5.undefined  6.function  7. symbol

### null和undefined区别
- undefined 代表的含义是未定义，null 代表的含义是空对象
- typeof undefined === 'undefined'   typeof null === 'number'

### Object.is() 和 ===
- NaN === NaN 为 false   Object.is(NaN, NaN) 为 true
- -0 === +0 为true   Object.is(-0, +0) 为 false

### this 绑定的优先级
- new绑定优先级 > 显示绑定优先级 > 隐式绑定优先级 > 默认绑定优先级

### forEach如何跳出循环
- try catch 配合 throw Error()

### 操作数组常用的方法：
- es5：
concat 、join 、
push、pop、
shift、unshift、
slice、splice、substring和substr 、
sort、 reverse、
indexOf和lastIndexOf 、
every、some、filter、map、forEach、reduce

- es6：find、findIndex、fill、copyWithin、Array.from、Array.of、entries、values、key、includes

### 预编译
- 预编译发生在函数执行的前一刻
1. 创建AO对象（执行期上下文）
2. 把形参和变量声明提升
3. 形参实参相统一
4. 在函数体里面找函数声明 

### js语言特性
- js是弱类型动态语言，静态作用域
- 弱类型：变量类型可以随时更换
- 解释性：错误发生的时间是运行时
- GC算法 js垃圾回收机制
  - 引用计数 0时回收
  - 标记清除
  - 标记整理
  - 分代回收
- V8 即时编译 主流js执行引擎
  - V8垃圾回收思想
  - 采用分代回收 新生代（存活时间短）和老生代（存活时间长）

es5 scopechain  es6 outer

### 数组中常用的方法有哪些
- **改变**原有数组的方法： （9个）（不是纯函数）
> splice() 添加/删除数组元素
> sort() 数组排序
> pop() 删除一个数组中的最后的一个元素
> shift() 删除数组的第一个元素
> push() 向数组的末尾添加元素
> unshift()向数组开头添加元素
> reverse() 翻转
> copyWithin() 指定位置的成员复制到其他位置
> fill() 填充数组

- **不改变**原数组的方法(6种)（是纯函数）
> join() 数组转字符串
> cancat 合并两个或多个数组
> ES6扩展运算符...合并数组
> indexOf() 查找数组是否存在某个元素，返回下标
> ES7 includes() 查找数组是否包含某个元素 返回布尔
> slice() 浅拷贝数组的元素

### 判断一个object是否是数组
1. 使用 Object.prototype.toString.call 来判断是否是数组
2. 使用 原型链 来完成判断  Object.setPrototypeOf
```js
function isArray(obj){
 return obj.__proto__ === Array.prototype;
 // 相当于
 // Object.setPrototypeOf(obj, Array.prototype)
}
```
3. Array.isArray()

### JavaScript 中 in 和 hasOwnProperty 的区别
- in 会向原型上查找, hasOwnProperty不会
-  hasOwnProperty() 大多数时候是正确的选择，因为您可以避免特殊键的问题，例如 constructor。 一个好的经验法则是，如果您要查看一个对象是否具有属性，您应该使用 hasOwnProperty()。如果您想查看一个对象是否有您打算调用的函数，例如检查一个对象是否有 toString()，你应该使用 in
### hasOwnProperty() 方法用于检测一个对象是否含有特定的自身属性，返回一个布尔值

### 箭头函数原理
> 没有自己的 执行期上下文。意味着this和arguments都是从它们的父函数继承

### 事件委托
- 是通过冒泡事件到父元素上触发 ul > li 最终冒泡到window对象
- 事件捕获则相反，
- 先捕获后冒泡（先里后外）

### 作用域链 原型链 继承 闭包
- 作用域
 - 作⽤域是指在程序中定义变量的区域，该位置决定了变量的⽣命周期。通俗地理解，**作⽤域就是变量与函数的可访问范围**，即作⽤域控制着变量和函数的可⻅性和⽣命周期。 在ES6之前，ES的作⽤域只有两种：全局作⽤域和函数作⽤域
- 作用域链
 - 在《JavaScript深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做**作用域链**

- 原型与继承

- 1. 原型链继承 prototype 
- 缺点： 1. 父类实例改变会影响子类 2. 无法向父类传参
- 2. 构造函数继承 call apply 
- 缺点： 继承不到父类**原型**上的属性和方法
- 3. 组合式继承（原型链继承 + 构造函数继承）
```js
function Parent(name) {
    this.name = [name]
}
Parent.prototype.getName = function() {
    return this.name
}
function Child() {
    // 构造函数继承
    Parent.call(this, 'zhangsan') 
}
//原型链继承
Child.prototype = new Parent()
Child.prototype.constructor = Child
```
- 缺点: 每次创建子类实例都执行了两次构造函数(Parent.call()和new Parent())。子类创建时，原型中会存在两份相同的属性和方法。

```javascript
  // 每个构造函数(Test)都有一个原型对象(prototype),原型对象都包含一个指向构造函数的指针,而实例(instance)都包含一个指向原型对象的内部指针.

  // 如果试图引用对象(实例instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去找这个属性.

  function Test(name) {
    this.name = name
  }

  function Test1(name, age) {
    Test.call(this, name);
    this.age = age
  }
  Test1.prototype = new Test()

  const a = new Test1('l', 99);

  console.warn(a)

  // console.log(a instanceof Object)
  // console.log(a instanceof Test)
  // console.log(a instanceof Test1)
  // console.log(a instanceof T)
  // Test.prototype.constructor === Test

  // console.log(Object.prototype.isPrototypeOf(a))
  // console.log(Test.prototype.isPrototypeOf(a))
  // console.log(Test1.prototype.isPrototypeOf(a))
  // console.log(T.prototype.isPrototypeOf(a))

  console.error(a.__proto__.__proto__ === Test1.prototype.__proto__)

  console.error(a.__proto__ === Test1.prototype)
  console.log(Test1.prototype.__proto__ === Test.prototype)
  console.log(Test.prototype.__proto__ === Object.prototype)

  // 构造函数的 __proto__ 是 Function.prototype
  console.error(Test1.__proto__ === Function.prototype)

  console.error(Function.prototype.__proto__ === Object.prototype)

  console.log(Object instanceof Function)
  console.log(Function instanceof Object)

  console.log(Object.__proto__ === Function.prototype);
  console.log(Function.__proto__ === Function.prototype);

  console.log(Function.__proto__ === Object.__proto__);

  console.warn(Function.__proto__.__proto__ === Object.prototype);
  console.warn(Object.__proto__.__proto__ === Object.prototype);


  //  圣杯模式
  //  为了son继承father原型上的东西，还可以修改自己原型上的东西，对father原型不影响。
  function inherit(Target,Origin){ 
    function F (){};// 函数F作为一个中间层，上连father，下连Son，使两函数互不干扰
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    Target.prototype.constuctor = Target;
    // son原型归位
    Target.prototype.uber = Origin.prototype;
  }
```

- 闭包
  - 在JavaScript中，根据词法作⽤域的规则，内部函数总是可以访问其外部函数中声明的变量， 当通过调⽤⼀个外部函数返回⼀个内部函数后，即使该外部函数已经执⾏结束了，但是**内部函数引⽤ 通过外部函数的变量依然保存在内存中**，我们就把这些变量的集合称为闭包。⽐如外部函数是foo，那么 这些变量的集合就称为foo函数的闭包
  - 闭包的原理是作用域链，执行上下文 4个 变量环境词法环境outer 和this绑定，执行的时候通过outer建立起作用域链。
  - 能够读取其他函数内部变量的函数
  - 闭包是指在 JavaScript 中，内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回return掉（寿命终结）了之后
    1. 闭包其实是在函数内部定义一个函数。
    2. 闭包在使用的时候**不会释放外部的引用**，闭包函数内部的值会得到保留。
    3. 闭包里面的匿名函数，读取变量的顺序，先读取本地变量，再读取父函数的局部变量。
    4. 对于闭包外部无法引用它内部的变量，因此在函数内部创建的变量执行完后会立刻释放资源，不污染全局对象。
    5. 闭包使用的时候要考虑到内存泄漏，因为不释放外部引用，但是合理的使用闭包是内存使用不是内存泄漏。

### for...in 和 for...of的区别
> for...of 是ES6新引入的特性，修复了ES5引入的for...in的不足
> for...in 循环出的是key，for...of循环出的是value
> for...of不能循环普通的对象，需要通过和Object.keys()搭配使用
> 推荐在循环对象属性的时候，使用for...in,在遍历数组的时候使用for...of

### null和undefined有什么区别
- null是一个表示"无"的**对象**，转为数值时为0
- undefined是一个表示"无"的**原始值**，转为数值时为NaN

- 当声明的变量还未被初始化时，变量的默认值为undefined
- null用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象

- undefined表示 “缺少值”，就是此处应该有一个值，但是还没有定义。典型用法是：
1. 变量被声明了，但没有赋值时，就等于 undefined
2. 调用函数时，应该提供的参数没有提供，该参数等于 undefined
3. 对象没有赋值的属性，该属性的值为 undefined
4. 函数没有返回值时，默认返回 undefined

- null表示“没有对象”，即该处不应该有值。典型用法是：
1. 作为函数的参数，表示该函数的参数不是对象
2. 作为对象原型链的终点

### js既是解释型语言(Interpreter)也是编译型语言(Compiler)

### 原生JS中DOM节点相关API合集
- [原生JS中DOM节点相关API合集]https://microzz.com/2017/04/06/jsdom/

### common.js 和 es6 中模块引入的区别
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJs 是单个值导出，ES6 Module可以导出多个
4. CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5. CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined

### JSON.stringify()
```js
const user = {
  name: 'lzx',
  age: 18
}
// 1. 第二个参数如果是个数组（[]string）, 
JSON.stringify(user, ['name']); // 筛选出key为name的值

// 2. 第二个参数如果是个函数(function), 
JSON.stringify(user, (key, value) => {
  if (typeof value === 'string') {
    return undefined
  }
  return value
})
```
3. 第三个参数如果是数字
```js
// 注意：为了达到理解的目的，使用 '--' 替代了空格

JSON.stringify(user, null, 2);
//{
//--"name": "Prateek Singh",
//--"age": 26,
//--"country": "India"
//}
```
4. 第三个参数为字符串
```js
JSON.stringify(user, null,'**');
//{
//**"name": "Prateek Singh",
//**"age": 26,
//**"country": "India"
//}
// 这里 * 取代了空格字符
```

### 对象转url参数
```js
const param = {
  a: 123,
  b: 456
}
Object.keys(param).map(key => `${key}=${param[key]}`).join('&');
// 'a=123&b=345'
```

### 一 类数组转数组
```js
// 1. Array.prototype.slice.call()
// 2. Array.from()
// 3. [...arguments]
// 4. Array.prototype.concat.apply([], arguments)
```

### 二 数组扁平化
```js
// 1. Array.prototype.flat(context)  参数context表示深度Infinity展开任意深度的嵌套数组
// 2. JSON.stringify(arr).replace(/(\[|\])/g, '').split(',')
// 3. 递归
var arr = [1, [2, [3, [4, 5]]], 6];
let result = [];
function test(arr) {
  arr.forEach(ele => {
    if (Array.isArray(ele)) {
      test(ele)
    } else {
      result.push(ele)
    }
  });
  return result
}
console.log(test(arr))
```

### 三 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
```js
// 1. Object.prototype.toString.call()
// 每一个继承 Object 的对象都有 toString 方法，如果 toString 方法没有重写的话，会返回 [Object type]，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 toString 方法时，会直接返回都是内容的字符串，所以我们需要使用call或者apply方法来改变toString方法的执行上下文。

// const an = ['Hello','An'];
// an.toString(); // "Hello,An"
// Object.prototype.toString.call(an); // "[object Array]"
// 这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined 。

// Object.prototype.toString.call('An') // "[object String]"
// Object.prototype.toString.call(1) // "[object Number]"
// Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
// Object.prototype.toString.call(null) // "[object Null]"
// Object.prototype.toString.call(undefined) // "[object Undefined]"
// Object.prototype.toString.call(function(){}) // "[object Function]"
// Object.prototype.toString.call({name: 'An'}) // "[object Object]"
// Object.prototype.toString.call() 常用于判断浏览器内置对象时。

// 更多实现可见 谈谈 Object.prototype.toString

// 2. instanceof
// instanceof  的内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

// 使用 instanceof判断一个对象是否为数组，instanceof 会判断这个对象的原型链上是否会找到对应的 Array 的原型，找到返回 true，否则返回 false。

// []  instanceof Array; // true
// 但 instanceof 只能用来判断对象类型，原始类型不可以。并且所有对象类型 instanceof Object 都是 true。

// []  instanceof Object; // true
// 3. Array.isArray()
// 功能：用来判断对象是否为数组

// instanceof 与 isArray

// 当检测Array实例时，Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 iframes

// var iframe = document.createElement('iframe');
// document.body.appendChild(iframe);
// xArray = window.frames[window.frames.length-1].Array;
// var arr = new xArray(1,2,3); // [1,2,3]

// // Correctly checking for Array
// Array.isArray(arr);  // true
// Object.prototype.toString.call(arr); // true
// // Considered harmful, because doesn't work though iframes
// arr instanceof Array; // false
// Array.isArray() 与 Object.prototype.toString.call()

// Array.isArray()是ES5新增的方法，当不存在 Array.isArray() ，可以用 Object.prototype.toString.call() 实现。

// if (!Array.isArray) {
//   Array.isArray = function(arg) {
//     return Object.prototype.toString.call(arg) === '[object Array]';
//   };
// }
```


### with 语法 将{}的自由变量，当作传入对象的属性来查找
```js
const obj = { a: 1, b: 2 };
console.log(obj.c) // undefined

with(obj) {
  console.log(a); // 1
  console.log(b); // 2
  console.log(c); // 报错
}
```

### 为什么js 0.1 + 0.2 != 0.3
- 原理
  - 在计算机中数字无论是定点数还是浮点数都是以多位二进制的方式进行存储的。
  - 在JS中数字采用的**IEEE 754**的双精度标准进行存储(存储一个数值所使用的二进制位数比较多,精度更准确)
```js
// 在定点数中，如果我们以8位二进制来存储数字。
// 对于整数来说，十进制的35会被存储为： 00100011 其代表 2^5 + 2^1 + 2^0。
// 对于纯小数来说，十进制的0.375会被存储为： 0.011 其代表 1/2^2 + 1/2^3 = 1/4 + 1/8 = 0.375

// 对于像0.1这样的十进制数值用二进制表示你就会发现无法整除，最后算下来会是 0.000110011…由于存储空间有限，最后计算机会舍弃后面的数值，所以我们最后就只能得到一个近似值。

// 想办法规避掉这类小数计算时的精度问题就好了，那么最常用的方法就是将浮点数转化成整数计算。因为整数都是可以精确表示的

// 解决办法
0.1 + 0.2 => (0.1*10 + 0.2*10) / 10
```

### ?.
```js
let res = obj?.data?.list
<=等价=> let res = obj && obj.data && obj.data.list
```

### !.
```js
// !. 在变量名后添加!，可以断言排除undefined和null类型
let a: string | null | undefined
a.length // error
a!.length // ok
```

### ??
```js
// 当左侧值为 null 或 undefined 时，返回 ?? 符号右边的值
```

### for-in 中一定要有 hasOwnProperty 的判断（即禁止直接读取原型对象的属性）
- hasOwnProperty: 检测一个对象是否含有特定的自身（非继承）属性
```javascript
const arr = [];
const key = '';

for (key in obj) {
  if (obj.hasOwnProperty(key)) {
    arr.push(obj[key]);
  }
}
```

### 惰性函数
惰性函数[http://www.zhangyunling.com/375.html]
- 惰性加载表示函数执行的分支仅会发生一次。有两种实现惰性加载的方式：在函数被
调用时再处理函数；在声明函数时就指定适当函数。
- 在执行函数时，函数他 改变 函数自己
```javascript
let addEvent1 = (type, element, fun) => {
  if (element.addEventListener) {
    addEvent1 = (type, element, fun) => {
      element.addEventListener(type, fun, false);
    }
  } else if (element.attachEvent) {
    addEvent1 =  (type, element, fun) => {
      element.attachEvent('on' + type, fun);
    }
  } else {
    addEvent1 = (type, element, fun) => {
      element['on' + type] = fun;
    }
  }
  return addEvent1(type, element, fun);
}
```

### 实现一个双向绑定
html: 
```html
<span id="span"></span>
<input type="text" id="input">
```
- defineProperty实现
 - Object.defineProperty(obj, prop, descriptor)
 - obj 要在其上定义属性的对象。
 - prop 要定义或修改的属性的名称。
 - descriptor 将被定义或修改的属性描述符
  * configurable特性表示对象的属性是否可以被删除
  * enumerable定义了对象的属性是否可以在 for...in 循环和 Object.keys() 中被枚举
  * writable属性设置为false时，该属性被称为“不可写”。它不能被重新分配
  * 如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常
js:
```javascript
// 数据
const data = {
  text: 'default'
};
const input = document.getElementById('input');
const span = document.getElementById('span');
// 数据劫持
Object.defineProperty(data, 'text', {
  // 数据变化 --> 修改视图
  set(newVal) {
    input.value = newVal;
    span.innerHTML = newVal;
  }
});
// 视图更改 --> 数据变化
input.addEventListener('keyup', function(e) {
  data.text = e.target.value;
});
```
- proxy实现
js:
```javascript
// 数据
const data = {
  text: 'default'
};
const input = document.getElementById('input');
const span = document.getElementById('span');
// 数据劫持
const handler = {
  set(target, key, value) {
    target[key] = value;
    // 数据变化 --> 修改视图
    input.value = value;
    span.innerHTML = value;
    return value;
  }
};
const proxy = new Proxy(data, handler);
// 视图更改 --> 数据变化
input.addEventListener('keyup', function(e) {
  proxy.text = e.target.value;
});
```

### 同步实现等待执行
```javascript
  function CodingMan(name) { // 主要考察的是 面向对象以及JS运行机制（同步 异步 任务队列 事件循环）
    function Man(name) {
      setTimeout(() => { // 异步
        console.log(`Hi! This is ${name}`);
      }, 0);
    }

    Man.prototype.sleep = function (time) {
      let curTime = new Date();
      let delay = time * 1000;
      setTimeout(() => { // 异步
        while (new Date() - curTime < delay) { } // 阻塞当前主线程
        console.log(`Wake up after ${time}`);
      }, 0);
      return this;
    }

    Man.prototype.sleepFirst = function (time) {
      let curTime = new Date();
      let delay = time * 1000;
      while (new Date() - curTime < delay) { } // 阻塞当前主线程
      console.log(`Wake up after ${time}`);
      return this;
    }

    Man.prototype.eat = function (food) {
      setTimeout(() => { // 异步
        console.log(`Eat ${food}~~`);
      }, 0)
      return this;
    }

    return new Man(name);
  }

  // CodingMan('Peter');
  CodingMan('Peter').sleep(3).eat('dinner');
  // CodingMan('Peter').eat('dinner').eat('supper');
  // CodingMan('Peter').sleepFirst(5).eat('supper');
```

### AMD CMD
- AMD 是提前执行，CMD 是延迟执行
- AMD 推崇依赖前置, CMD 推崇依赖就近
```javascript
// CMD
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  // 此处略去 100 行
  var b = require('./b') // 依赖可以就近书写
  b.doSomething()
  // ...
})

// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
  a.doSomething()
  // 此处略去 100 行
  b.doSomething()
  ...
})
```

```js
    /**
    * 方法说明
    * @method 方法名
    * @for 所属类名
    * @param {参数类型} 参数名 参数说明
    * @return {返回值类型} 返回值说明
    */
```

### 捕获全局promise错误
1. addEventListener
```js
window.addEventListener('unhandledrejection', function (event) {
  console.log('event', event);
  console.log('message', event.message);
  // event.reason //获取到catch的err的原因(内容) 与控制台报错一致
  // event.promise //获取到未处理的promise对象
  event.preventDefault()
});
```