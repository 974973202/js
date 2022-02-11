首先声明，js的奇怪之处不叫bug，叫特性

### 新增的数组API
- find(callback): 用于查找满足条件的第一个元素 返回true or undefined
```js
arr.find(item => item.id == 5); 
```
- findIndex(callback): 用于查找满足条件的第一个元素的下标
```js
arr.findIndex(item => item.id == 5); 
```
- fill(data): 用指定数据填充满数组的所有内容
- copyWithin(target, start?, end?): 在数组内部完成复制
- includes(data): 判断数组中是否包含某个值


### Set (可迭代对象)
1. set用于存放不重复的数据
2. 能对数组，字符串去重

- add(数据)：添加不重复的数据到集合末尾
- has(数据)： 判断数据返回true or false
- delete(数据)：删除数据，返回是否删除成功的true or false
- clear(): 清空集合
- size(): 获取集合的数量

3. 与数组相互转换
```js
// 转set
new Set([1,2,3,4])
// 转数组
[...new Set([1,2,3,4])]
```

4. 如何遍历
- for-of
- set中的实例方法forEach，回调的第二个参数不存在下标，和第一个一致

5. 两个数组的并集，交集，差集
```js
const arr1 = [1,2,3,4];
const arr2 = [3,4,5,6];
// 并集
const result = [...new Set([...arr1, ...arr2])]

// 交集
[...new Set(arr1)].filter(item => new Set(arr2).has(item))

// 差集
[...new Set([...arr1, ...arr2])].filter(item => !new Set(arr2).has(item) && new Set(arr1).has(item) || !new Set(arr1).has(item) && new Set(arr2).has(item))
```

6. 手写Set
```js
class mySet {
  constructor(iterator = []) {
    // 验证是否是可迭代对象
    if (typeof iterator[Symbol.iterator] !== 'function') {
      throw new TypeError(`你提供的${iterator}不是一个可迭代的对象`)
    }
    this._datas = [];
    for(const item of iterator) {
      this.add(item)
    }
  }

  add(data) {
    if (!this.has(data)) {
      this._datas.push(data)
    }
  }

  has(data) {
    for (const item of this._datas) {
      if (mySet._isEqual(data, item)) {
        return true
      }
    }
    return false
  }

  delete(data) {
    for (let i = 0; i < this._datas.length; i ++) {
      const element = this._datas[i];
      if(mySet._isEqual(element, data)) {
        this._datas.splice(i, 1);
        return true
      }
    }
    return false
  }

  clear() {
    this._datas.length = 0
  }

  get size() {
    return this._datas.length
  }

  /**
   * 判断两个数据是否相等
  */
  static _isEqual(data1, data2) {
    if (data1 === 0 && data2 === 0) {
      return true;
    }
    return Object.is(data1, data2)
  }

  *[Symbol.iterator]() {
    for (const item of this._datas) {
      yield item;
    }
  }

  forEach(callback) {
    for (const item of this._datas) {
      callback(item, item, this)
    }
  }
}

const s = new mySet([1,2,3,3])
console.log(s)
```


### map
1. 存储键值对数据
2. 键不可重复

3. 如果进行后续操作
 - size()：获取键的数量
 - set(键，值): 设置键值对，可以是任何类型
 - get(键)：获取键对应的值
 - has(键)：判断键是否存在返回ture or false
 - delete(键)：删除指定的键
 - clear()：清空键
 
4. 如何与数组相互转换
和set一样

5. 遍历
 - for-of
 - forEach, 参数一值，参数二键，参数三本身

6. 手写map
```js
class myMap {
  constructor(iterator = []) {
    // 验证是否是可迭代对象
    if (typeof iterator[Symbol.iterator] !== 'function') {
      throw new TypeError(`你提供的${iterator}不是一个可迭代的对象`)
    }
    this._datas = [];
    for(const item of iterator) {
      if (typeof item[Symbol.iterator] !== 'function') {
        throw new TypeError(`你提供的${item}不是一个可迭代的对象`)
      }
      const iterator = item[Symbol.iterator]();
      const key = iterator.next().value;
      const value = iterator.next().value;
      this.set(key, value)
    }
  }

  set(key, value) {
    const obj = this._getObj(key)
    if (obj) {
      // 修改
      obj.value = value;
    } else {
      this._datas.push({
        key,
        value
      })
    }
  }

  get(key) {
    const item = this._getObj(key)
    if(item) {
      return item.value
    }
    return undefined
  }

  /**
  * 根据key值从内部数组中，找到对应的数组项
  */
  _getObj(key) {
    for (const item of this._datas) {
      if (myMap._isEqual(key, item.key)) {
        return item
      }
    }
    return undefined
  }

  has(key) {
    const item = this._getObj(key);
    return item !== undefined
  }

  delete(key) {
    for (let i = 0; i < this._datas.length; i ++) {
      const element = this._datas[i];
      if(myMap._isEqual(element.key, key)) {
        this._datas.splice(i, 1);
        return true
      }
    }
    return false
  }

  clear() {
    this._datas.length = 0
  }

  get size() {
    return this._datas.length
  }

  /**
   * 判断两个数据是否相等
  */
  static _isEqual(data1, data2) {
    if (data1 === 0 && data2 === 0) {
      return true;
    }
    return Object.is(data1, data2)
  }

  *[Symbol.iterator]() {
    for (const item of this._datas) {
      yield [item.key, item.value];
    }
  }

  forEach(callback) {
    for (const item of this._datas) {
      callback(item.value, item.key, this)
    }
  }
}
```

### 代理与反射
- 属性描述符：描述对象的相关信息 Object.getOwnPropertyDescriptor(对象，属性名)
 - value: 属性值
 - writeable: 是否可写
 - configurable: 是否可改
 - enumerable: 是否可枚举

- 修改对象的属性值或者添加修改描述符
```js
Object.defineProperty(对象，属性名，描述符)
```

- 反射 Reflect
 1. 属性的赋值 取值 调用普通函数 调用构造函数 判断属性是否在对象中
 2. 为了让js语言广一点支持函数式编程而出现
```js
const obj = {
  a: 1,
  b: 2
}
Reflect.set(obj, "a", 10, receiver); // 设置对象的值 相当于 obj.a = 10
Reflect.get(obj, "a"); // 获取对象是属性值 相当于 obj.a
Reflect.has(obj, "a"); // 判断有无a属性
Reflect.deleteProperty(obj, "b"); // 删除一个对象的属性 相当于 delete obj.b
Reflect.ownKeys(obj) // 方法用于返回对象的所有属性

function Test(a, b) {
  console.log('test', a, b)
}
Reflect.apply(Test, null, [1, 2]); //调用一个指定函数并绑定this和阐述列表 相当于调用函数 Test(1, 2)
Reflect.construct(Test, [3, 4]); // 调用一个构造函数相当于 new Test(3, 4)

Reflect.defineProperty 与 Object.defineProperty 类似，前者配置出错不会报错会返回 false

// Reflect.set会触发Proxy.defineProperty拦截。
// Proxy.set拦截里面使用了Reflect.set，而且传入了receiver，导致触发Proxy.defineProperty拦截
```

- 代理 Proxy
  1. 修改底层实现的方式
  ```js
  // 代理一个 -> 目标对象
  // target: 目标对象
  // handler: 是一个普通对象，其中可以重写底层实现
  // 返回一个代理对象
  new Proxy(target, handler)

  const obj = {
    a: 1,
    b: 2,
  }
  const proxy = new Proxy(obj, {
    set(target, propertyKey, value) {
      // Reflect.set(target, propertyKey, value); 相当于下面这个写法
      target[propertyKey] = value
    },
    get(target, propertyKey) {
      if (Reflect.has(target, propertyKey)) {
        return Reflect.get(target, propertyKey);
      } else {
        return "none"
      }
    }
  })
  proxy.a = 10;
  console.log(proxy.a)
  ```

### 观察者模式
- 有一个对象，是观察者，它用于观察另外一个对象的属性值变化，当属性值变化后收到一个通知，可能会做一些事

```js
// 创建一个观察者
function observer(target) {
  const div = document.getElementById("div")
  // const ob = {};
  // const props = Object.keys(target)
  // for (const prop of props) {
  //   Object.defineProperty(ob, prop, {
  //     enumerable: true,
  //     get() {
  //       return target[prop];
  //     }
  //     set(val) {
  //       target[prop] = val
  //       render()
  //     }
  //   })
  // }
  const proxy = new Proxy(target, {
    set(target, prop, value) {
      target[prop] = value
      render()
    },
    get(target, prop) {
      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop);
      } else {
        return "none"
      }
    }
  })
  render()
  function render() {
    let html = "";
    for(const iterator of Object.keys(target)) {
      html += `
        <p><span>${prop}</span><span>${target[prop]}</span></p>
      `
    }
    div.innerHTML = html
  }
  return proxy
}
const obj = observer({
  a: 1,
  b: 2,
})
```

### 偷懒的构造函数
```js
class User {
  // constructor(a, b, c) {
  //   this.a = a;
  //   this.b = b;
  //   this.c = c;
  // }
}

function ConstructorProxy(Class, ...name) {
  return new Proxy(Class, {
    construct(target, argumentsList) {
      const obj = Reflect.construct(target, argumentsList);
      name.forEach((name, i) => {
        obj[name] = argumentsList[i]
      })
      return obj
    }
  })
}

const UserProxy = ConstructorProxy(User, 'a', 'b', 'c')

const obj = new UserProxy('1', '2', '3')
console.log(obj)
```