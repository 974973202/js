1. html css js 
2. webpack vite http
8. react
9. 各种手写

```js
const listener = {
    list: [],
    listen: (fn) => listener.list.push(fn),
    notify: (...arg) => listener.list.forEach(fn => fn(...arg))
}
listener.listen((a,b) => console.log(a, b))
listener.notify(2,3)

class subject {
    constructor() {
        this.observers = [];
    }
    ob(fn) {
        if (fn && fn.update) {
            this.observers.push(fn);
        }
    }

    notify() {
        this.observers.forEach(fn => fn.update(...arguments))
    }
}

class Ob {
    update(...args) {
        console.log(...args);
    }
}

const s = new subject();
s.ob(new Ob());
s.notify('hello');

```