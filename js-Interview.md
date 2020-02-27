### 事件委托
事件委托[https://www.jianshu.com/p/0c1d21a631a0]

### JS异步加载
- 动态生成script标签
- 添加h5的async defer属性，前者乱序不适合依赖性加载
- async 是“下载完就执行”， defer 是“渲染完再执行”

### 原生JS中DOM节点相关API合集
- [原生JS中DOM节点相关API合集]https://microzz.com/2017/04/06/jsdom/

### 惰性函数
惰性函数[http://www.zhangyunling.com/375.html]
- 惰性加载表示函数执行的分支仅会发生一次。有两种实现惰性加载的方式：在函数被
调用时再处理函数；在声明函数时就指定适当函数。
```
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

### 作用域链 原型链 继承 闭包
- 作用域
```
在《JavaScript深入之变量对象》中讲到，当查找变量的时候，会先从当前上下文
的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变
量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行
上下文的变量对象构成的链表就叫做作用域链
```

- 原型与继承
- [深度解析原型中的各个难点]https://juejin.im/post/5aa78fe66fb9a028d2079ca4
- [从prototype与__proto__窥探JS继承之源|掘金技术征文]https://juejin.im/post/58f9d0290ce46300611ada65
- [原型链与继承]https://juejin.im/post/58f94c9bb123db411953691b
- [一文完全吃透JavaScript继承]https://juejin.im/post/5e5339b46fb9a07cb83e20d4
```
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

  const test1 = new Test1('l', 99);

  console.warn(test1)

  // console.log(test1 instanceof Object)
  // console.log(test1 instanceof Test)
  // console.log(test1 instanceof Test1)
  // console.log(test1 instanceof T)

  // console.log(Object.prototype.isPrototypeOf(test1))
  // console.log(Test.prototype.isPrototypeOf(test1))
  // console.log(Test1.prototype.isPrototypeOf(test1))
  // console.log(T.prototype.isPrototypeOf(test1))

  console.error(test1.__proto__.__proto__ === Test1.prototype.__proto__)

  console.error(test1.__proto__ === Test1.prototype)
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

### 实现一个双向绑定
html: 
```
<span id="span"></span>
<input type="text" id="input">
```
- defineProperty实现
js:
```
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
```
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