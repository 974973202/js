### Object.freeze 对象冻结

我们都知道const定义基本数据类型，这个值是不可以修改的。那么我们用const定义对象，可以修改对象吗？
```js
const a = 5
// a = 10  // TypeError: Assignment to constant variable.
const obj = {
    name: '张三'
}
obj.name = '李四'
console.log(obj)    // {name: "李四"}
```

答案是肯定的。那么如果我们想定义一个不可被修改的对象，应该怎么办呢！那就要用到Object.freeze()了。它的作用是冻结一个对象，被冻结的对象有以下几个特性：

不能添加新属性
不能删除已有属性
不能修改已有属性的值
不能修改原型
不能修改已有属性的可枚举性、可配置性、可写性

### 基本使用
```js
var obj = {
    name: '张三',
    age: 18,
    address: '上海市'
}
obj.__proto__.habit = '运动'
 
// 冻结对象
Object.freeze(obj)
 
// 不能添加新属性
obj.sex = '男'
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能删除原有属性
delete obj.age
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能修改已有属性的值
obj.name = '李四'
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能修改原型
obj.__proto__ = '随便什么值'
console.log(obj.__proto__)  // {habit: "运动", constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, …}
 
// 不能修改已有属性的可枚举性、可配置性、可写性
Object.defineProperty(obj,'address',{ // TypeError: Cannot redefine property: address
    enumerable: false,
    configurable: false,
    writable: true
})
```

- **冻结数组也是依然有效的**

- **Object.freeze()只支持浅冻结**

- 封装一个深冻结
```js
var obj = {
    name: '张三',
    info: {
        a: 1,
        b: 2
    }
}
function deepFreeze(obj) {
    // 获取所有属性
    var propNames = Object.getOwnPropertyNames(obj)
 
    // 遍历
    propNames.forEach(item => {
        var prop = obj[item]
        // 如果某个属性的属性值是对象，则递归调用
        if (prop instanceof Object && prop !== null) {
            deepFreeze(prop)
        }
    })
    // 冻结自身
    return Object.freeze(obj)
}
deepFreeze(obj)
obj.name = '李四'
console.log(obj)    // {name: "张三", info: {…}}
obj.info.a = 100
console.log(obj.info)   // {a: 1, b: 2}
```

### 运用场景
- 提高性能，如果你有一个对象，里面的内容特别特别多，而且都是一些静态数据，你确保不会修改它们

### 原理
- 模拟Object.freeze()原理主要用到两个关键方法，Object.definedProperty()、Object.seal()。
- Object.definedProperty()
```js
Object.defineProperty(person, 'name', {
    configurable: false,// 表示能否通过delete删除属性，能否修改属性的特性...
    enumerable: false,// 表示是否可以枚举。直接在对象上定义的属性，基本默认true
    writable: false,// 表示能否修改属性的值。直接在对象上定义的属性，基本默认true
    value: 'xm'// 表示属性的值。访问属性时从这里读取，修改属性时，也保存在这里。
})
```

- Object.seal()方法可以让对象不能被扩展、删除属性等等。用法：Object.seal(person)

### 模拟实现 Object.freeze
```js
function myFreeze(obj) {
    if (obj instanceof Object) {
        Object.seal(obj);
        let p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                Object.defineProperty(obj, p, {
                    writable: false
                });
                myFreeze(obj[p]);
            }
        }
    }
}
```