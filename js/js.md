
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