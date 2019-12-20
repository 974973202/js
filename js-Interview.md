### 事件委托
事件委托[https://www.jianshu.com/p/0c1d21a631a0]

### 惰性函数
惰性函数[http://www.zhangyunling.com/375.html]
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

- 原型

- 继承

- 闭包




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