### 实现(a == 1 && a == 2 && a == 3)为true
```js
var val = 0;
Object.defineProperty(window, 'a', {
    get: function () {
        return ++val;
    }
});
console.log(a == 1 && a == 2 && a == 3)
```