- 基本数据类型（原始值）：Number  Boolean  String  undefined  null  栈内存（stack）
- 引⽤类型（引用值）：array  Object  function  data  RegExp...   堆内存（heap）
- 判断布尔值为false的6种情况： undefined  null  NaN  “”  0  false 
- javascript有7种内置类型：null, undefined, boolean, number, string, object, symbol
- typeof可判断的类型： 1.string  2.number  3.boolean  4.object  5.undefined  6.function  7. symbol

### 预编译
- 预编译发生在函数执行的前一刻
1. 创建AO对象（执行期上下文）
2. 把形参和变量声明提升
3. 形参实参相统一
4. 在函数体里面找函数声明 

### 数组中常用的方法有哪些
- 改变原有数组的方法： （9个）
> splice() 添加/删除数组元素
> sort() 数组排序
> pop() 删除一个数组中的最后的一个元素
> shift() 删除数组的第一个元素
> push() 向数组的末尾添加元素
> unshift()向数组开头添加元素
> reverse() 翻转
> copyWithin() 指定位置的成员复制到其他位置
> fill() 填充数组

- 不改变原数组的方法(6种)
> join() 数组转字符串
> cancat 合并两个或多个数组
> ES6扩展运算符...合并数组
> indexOf() 查找数组是否存在某个元素，返回下标
> ES7 includes() 查找数组是否包含某个元素 返回布尔
> slice() 浅拷贝数组的元素

### 判断一个object是否是数组
1. 使用 Object.prototype.toString.call 来判断是否是数组
2. 使用 原型链 来完成判断
```
function isArray(obj){
 return obj.__proto__ === Array.prototype;
}
```
3. Array.isArray()

### 箭头函数原理
> 没有自己的 执行期上下文。意味着this和arguments都是从它们的父函数继承

### 事件委托
- 是通过冒泡事件到父元素上触发

### 作用域链 原型链 继承 闭包
- 作用域
 - 作⽤域是指在程序中定义变量的区域，该位置决定了变量的⽣命周期。通俗地理解，**作⽤域就是变量与函数的可访问范围**，即作⽤域控制着变量和函数的可⻅性和⽣命周期。 在ES6之前，ES的作⽤域只有两种：全局作⽤域和函数作⽤域
- 作用域链
 - 在《JavaScript深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链

- 原型与继承
- [深度解析原型中的各个难点]https://juejin.im/post/5aa78fe66fb9a028d2079ca4
- [从prototype与__proto__窥探JS继承之源|掘金技术征文]https://juejin.im/post/58f9d0290ce46300611ada65
- [原型链与继承]https://juejin.im/post/58f94c9bb123db411953691b
- [一文完全吃透JavaScript继承]https://juejin.im/post/5e5339b46fb9a07cb83e20d4
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
```

- 闭包
  - 在JavaScript中，根据词法作⽤域的规则，内部函数总是可以访问其外部函数中声明的变量， 当通过调⽤⼀个外部函数返回⼀个内部函数后，即使该外部函数已经执⾏结束了，但是内部函数引⽤ 外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。⽐如外部函数是foo，那么 这些变量的集合就称为foo函数的闭包
  - 闭包的原理是作用域链，执行上下文 4个 变量环境词法环境outer 和this绑定，执行的时候通过outer建立起作用域链。
  - 能够读取其他函数内部变量的函数
  - 闭包是指在 JavaScript 中，内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回return掉（寿命终结）了之后
    1. 闭包其实是在函数内部定义一个函数。
    2. 闭包在使用的时候不会释放外部的引用，闭包函数内部的值会得到保留。
    3. 闭包里面的匿名函数，读取变量的顺序，先读取本地变量，再读取父函数的局部变量。
    4. 对于闭包外部无法引用它内部的变量，因此在函数内部创建的变量执行完后会立刻释放资源，不污染全局对象。
    5. 闭包使用的时候要考虑到内存泄漏，因为不释放外部引用，但是合理的使用闭包是内存使用不是内存泄漏。

### for...in 和 for...of的区别
> for...of 是ES6新引入的特性，修复了ES5引入的for...in的不足
> for...in 循环出的是key，for...of循环出的是value
> for...of不能循环普通的对象，需要通过和Object.keys()搭配使用
> 推荐在循环对象属性的时候，使用for...in,在遍历数组的时候的时候使用for...of

### null和undefined有什么区别
- null是一个表示"无"的对象，转为数值时为0
- undefined是一个表示"无"的原始值，转为数值时为NaN

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