1. html
2. css
3. js
4. ts
5. 正则
6. koa
7. 构建工具 webpack http  browser  network
8. promise compose 冒泡 快速
9. 设计模式 发布订阅 观察者
10. react

```js
const listener = {
    list: [],
    listen: (fn) => listener.list.push(fn),
    notify: (...arg) => listener.list.forEach(fn => fn(...arg))
}
listener.listen((a,b) => console.log(a, b))
listener.notify(2,3)

class Subject {
  constructor() {
    this.observers = [];
  };
  ob(fn) {
    if (fn && fn.update) {
      this.observers.push(fn)
    }
  }

  notify() {
    this.observers.forEach(ele => {
      ele.update()
    })
  }
}
class Ob {
  update() {
    console.log(12)
  }
}
suject = new Subject()
suject.ob(new Ob())
suject.notify()

```