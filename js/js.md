
es5 scopechain  es6 outer

### AOP 切面编程
- 装饰器

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