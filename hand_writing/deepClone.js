// deepClone
// 1. 判断是否是对象类型 typeof
// 2. for in 遍历
// 3. 判断是否是自身属性
// 4. 判断内属性是否是对象类型 typeof 是 继续deepClone 否 直接赋值

function deepClone(obj) {
    if (!isObject(obj)) return obj;

    var target = Array.isArray(obj) ? [] : {};

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isObject(obj[key])) {
                target[key] = deepClone(obj[key])
            } else {
                target[key] = obj[key]
            }
        }
    }

    return target
}

function isObject(obj) {
    return typeof obj == 'object' && obj != null
}

// real deepCopy  拷贝array object function
function getType(obj) {
    const str = Object.prototype.toString.call(obj);
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        // 判断是否是dom元素，如div等
        return 'element';
    }
    return map[str];
}

function deepCopy(ori) {
    const type = getType(ori);
    let copy;
    switch (type) {
        case 'array': // 递归
            return copyArray(ori, type, copy);
        case 'object': // 递归
            return copyObject(ori, type, copy);
        case 'function': // eval
            return copyFunction(ori, type, copy);
        default:
            return ori;
    }
}

function copyArray(ori, type, copy = []) {
    for (const [index, value] of ori.entries()) {
        copy[index] = deepCopy(value);
    }
    return copy;
}

function copyObject(ori, type, copy = {}) {
    for (const [key, value] of Object.entries(ori)) {
        copy[key] = deepCopy(value);
    }
    return copy;
}

function copyFunction(ori, type, copy = () => { }) {
    // const fun = eval(ori.toString()); // Function statements require a function name
    const fun = eval("(" + ori.toString() + ")");
    fun.prototype = ori.prototype
    return fun
}
const newobj = deepCopy({
    'a': 1,
    'b': '1',
    'c': function () { },
    'd': null,
    'e': [],
    'f': {},
    "g": new Date(),
})
console.log(newobj)