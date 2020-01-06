### AOP 切面编程
- 装饰器

### for-in 中一定要有 hasOwnProperty 的判断（即禁止直接读取原型对象的属性）
- hasOwnProperty: 检测一个对象是否含有特定的自身（非继承）属性
```
const arr = [];
const key = '';

for (key in obj) {
  if (obj.hasOwnProperty(key)) {
    arr.push(obj[key]);
  }
}
```