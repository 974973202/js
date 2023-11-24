- 基本数据类型（原始值）(5)：Number  Boolean  String  undefined  null  **栈内存（stack）**
- 引⽤类型（引用值）：array  Object  function  data  RegExp...   **堆内存（heap）**

- 判断布尔值为false的(6)种情况： undefined  null  NaN  “”  0  false 
- javascript有(8)种内置类型：null, undefined, boolean, number, string, object, symbol, bigInt
- typeof可判断的类型(7)： 1.string  2.number  3.boolean  4.object  5.undefined  6.function  7. symbol

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
- concat 对字符串或数组进行拼接
- join 将array数据中每个元素都转为字符串，用自定义的连接符分割
- push 往数组后追加元素
- pop 删除一个数组中最后一个元素 并返回删除的元素
- shift 删除一个数组中第一个元素 并返回删除的元素
- unshift 往数组前追加元素
- slice(start, end) 拷贝或截取数组，并返回截取后的数组
- splice(start, deleteCount, items) 从第几位删除几位数组值，删除位可选插入的数据，并返回删除的数据
- substring(start, end) 从第几位开始到第几位结束，返回截取的字符串
- substr(start, length) 从第几位开始截取的长度是多少，返回截取的字符串
- sort 排序
```js
var arr = [1,4,2,12,453,22];
arr.sort() // [1,12,2,22,4,453] 按字母顺序对数组中的元素排序，按字符编码排序
arr.sort((a, b) => -1); // 倒序 a是arr[1] b是arr[0]  a是b的前一个

// 从小到大排
arr.sort((a, b) => a-b); // a=b或a>b,返回0或正值则不变。返回负值则交换
```
- reverse 翻转数组
- indexOf 查找数组元素所在索引，没有则返回-1
- lastIndexOf 同indexOf 只是从后往前找
- every() 每个条件都满足返回true 否则false
- some() 有条件能满足返回true 否则false
- filter() 过滤数组，返回满足条件后的数组
- map() 对数组值进行处理 返回处理后的数组
- forEach() 遍历
- [reduce][reduce](/js/reduce.md)

- es6：find、findIndex、fill、copyWithin、Array.from、Array.of、entries、values、key、includes
- find 找到第一个符合的数组成员
- findIndex 找到第一个符合的数组下标
- fill(value, start, end) 用于填充值，可以传入填充的开始和结束
- copyWithin 
- Array.from 类数组转化为数组
- Array.to 将数值转化为数组
- includes: 判断数组中是否包含某个值 [].includes(xx)

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
> 箭头函数不会创建自己的this
> 箭头函数继承而来的this指向永远不变
> .call()/.apply()/.bind()无法改变箭头函数中this的指向
> 箭头函数不能作为构造函数使用
> 箭头函数没有自己的arguments

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
  - 解决闭包：可以将不使用的对象设置为null，让js回收

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

### 三 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
```js
// 1. Object.prototype.toString.call()
// 识别 Map、GeneratorFunction、Promise、async 调用了内置的toStringTag 标签
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
// 判断一个实例是否属于某种类型 
// 在继承关系中用来判断一个实例是否属于它的父类型

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

### IntersectionObserver
- IntersectionObserver 可以用于检测元素是否进入视口，可以用于实现无限滚动、懒加载等功能
```js
const myObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log(`${entry.target.id} is now visible`);
      observer.unobserve(entry.target);
    }
  });
});
const myElement = document.getElementById("myElement");
myObserver.observe(myElement);
```

### a 标签导出二进制文件
```js
// res..
const blob = new Blob([res]);
const objectURL = URL.createObjectURL(blob);
const btn = document.createElement('a');
btn.download = '群组限额维护名单导出.xlsx';
btn.href = objectURL;
btn.click();
URL.revokeObjectURL(objectURL);
btn.remove();
```

### node 的内存管理跟垃圾回收机制有了解过吗？
Node.js的内存管理主要包括两个方面：堆内存和栈内存。
1. 堆内存：Node.js使用堆内存来分配和管理对象。V8引擎的堆内存分为新生代和老生代两个区域。
  - 新生代：新生代是存放新创建的对象的区域。它又分为From空间和To空间。当新对象被创建时，首先分配在From空间，当From空间满了，就会触发垃圾回收，将还存活的对象复制到To空间，并清空From空间。然后交换From空间和To空间的角色，这样就完成了一次垃圾回收。新生代的垃圾回收使用的是Scavenge算法，它通过复制存活对象来实现垃圾回收。
  - 老生代：老生代是存放存活时间较长的对象的区域。当新生代经历了一定次数的垃圾回收后，存活的对象会被晋升到老生代。老生代的垃圾回收使用的是标记-清除算法和标记-整理算法的组合。标记-清除算法首先标记所有的存活对象，然后清除未标记的对象。标记-整理算法在清除对象后会将存活对象向一端移动，从而减少内存碎片。
2. 栈内存：Node.js使用栈内存来存储函数调用时的局部变量、函数参数等。栈内存的分配和释放是由V8引擎自动管理的，不需要开发者手动操作。

垃圾回收机制是Node.js中的一个重要特性，它可以自动回收不再使用的内存，避免内存泄漏和内存溢出的问题。V8引擎中的垃圾回收机制主要包括以下几个步骤：
1. 标记：垃圾回收器从根对象开始，递归遍历所有的对象，并标记为活动对象。根对象可以是全局变量、活动函数的局部变量等。如果某个对象无法从根对象访问到，则说明该对象已经不再使用。
2. 清除：垃圾回收器清除所有未标记的对象，释放其占用的内存。
3. 整理：如果是老生代的垃圾回收，垃圾回收器会对存活的对象进行整理，将它们向一端移动，从而减少内存碎片。

需要注意的是，垃圾回收机制会在程序运行时暂停程序的执行，进行垃圾回收操作。这个暂停时间称为“停顿时间”，长时间的停顿时间会影响程序的性能。为了减少停顿时间，V8引擎采用了**增量标记和并行标记**等技术，将垃圾回收的工作分解成多个阶段，并与程序的执行交替进行，从而减少停顿时间的影响。

### import和require
1. 语法：import是ES6的模块引入语法，而require是Node.js的模块引入语法。
2. 功能：import支持静态导入，可以在任何地方使用，而require是动态导入，只能在代码的顶层使用。
3. 导入方式：import只能导入具名导出的模块，而require可以导入具名导出和默认导出的模块。
4. 引入时机：import是**编译时**引入，会在代码执行之前进行解析和执行，而require是**运行时**引入，会在代码执行时进行解析和执行。
5. 作用域：import是块级作用域，只在当前模块中有效，而require是函数级作用域，可以在函数内部使用。
总的来说，import是ES6的模块引入语法，支持静态导入，适用于浏览器环境；
而require是Node.js的模块引入语法，支持动态导入，适用于服务器端开发。

1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3、CommonJs 是单个值导出，ES6 Module可以导出多个
4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5、CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined

### 事件循环，消息队列与宏任务、微任务之间的关系是什么？

- 宏任务入队消息队列，可以将消息队列理解为宏任务队列
- 每个宏任务内有一个微任务队列，执行过程中微任务入队当前宏任务的微任务队列
- 宏任务微任务队列为空时才会执行下一个宏任务
- 事件循环捕获队列出队的宏任务和微任务并执行

- 事件循环会不断地处理消息队列出队的任务，而宏任务指的就是入队到消息队列中的任务，
- 每个宏任务都有一个微任务队列，宏任务在执行过程中，如果此时产生微任务，那么会将
- 产生的微任务入队到当前的微任务队列中，在当前宏任务的主要任务完成后，会依次出队
- 并执行微任务队列中的任务，直到当前微任务队列为空才会进行下一个宏任务。
