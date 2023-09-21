// bind()方法创建一个新的函数, 当被调用时，
// 将其this关键字设置为提供的值，在调用新函数时，
// 在任何提供之前提供一个给定的参数序列

// 返回一个函数
// 对于普通函数，绑定this指向
// 对于构造函数，要保证原函数的原型对象上的属性不能丢失
// bind()方法不会立即执行函数，而是返回一个新的函数，可以稍后再调用

Function.prototype.myBind = function (context, ...args) {
    // 判断调用对象是不是函数
    if (typeof this !== "function") {
        throw new TypeError('error');
    }
    // 如果没有传入上下文对象，则默认为全局对象window
    const ctx = context || window
    // 保存原始函数的引用，this就是要绑定的函数
    const _this = this
    // 返回一个新的函数作为绑定函数
    return function fn(...innerArgs) {
        // 判断返回出去的函数有没有被new （例三）
        if (this instanceof fn) {
            return new _this(...args, ...innerArgs);
        }
        // 使用 apply 方法将原函数绑定到指定的上下文对象上
        return _this.apply(ctx, [...args, ...innerArgs]);
    };
};

// -------------------------
// 例一：
const obj = {
    name: 'John',
    sayHello: function () {
        console.log('Hello, ' + this.name);
    }
};
const sayHello = obj.sayHello.bind(obj);
sayHello(); // 输出：Hello, John

// 例二：
function add(a, b) {
    return a + b;
}
const addFive = add.bind(null, 5);
console.log(addFive(10)); // 输出：15

// 例三：
function Person(name) {
    this.name = name;
}
const createPerson = Person.bind(null);
const john = new createPerson('John');
console.log(john.name); // 输出：John


// 练习
Function.prototype.B = function (content, args) {
    const ctx = content || window;
    const _this = this;

    return function fn(...rest) {
        if (this instanceof fn) {
            return new _this(...args, ...rest)
        }
        return _this.apply(ctx, [...args, ...rest])

    }

}