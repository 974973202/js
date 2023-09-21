// Function.prototype._call = function (context) {
//     const context = context || window;
//     context.fn = this;

//     const arr = []

//     for (var i = 1; i < arguments.length; i++) {
//         arr.push(`arguments[${i}]`)
//     }

//     var result = eval(`context.fn(${arr})`);
//     delete context.fn;
//     return result;
// }

function getDataType(d) {
    const t = Object.prototype.toString.call(d);
    const map = {
        "[object Function]": 'function',
        "[object Array]": 'array',
        "[object Object]": 'object',
    }
    if (obj instanceof Element) {
        return 'element'
    }
    return map[t]
}

function copyFunction(d) {
    const func = eval(`(${d.toString()})`)
    func.prototype = d.prototype;
    return func
}

function copyArray(d, copy = []) {
    for (const [index, value] of d.entries()) {
        copy[index] = _deepClone(value);
    }
    return copy
}

function copyObject(d, copy = {}) {
    for (const [index, value] of Object.entries(d)) {
        copy[index] = _deepClone(value);
    }
    return copy
}

function _deepClone(d) {
    const type = getDataType(d)
    let copy;
    switch (type) {
        case 'function':
            return copyFunction(d, copy)
        case 'array':
            return copyArray(d, copy)
        case 'object':
            return copyObject(d, copy)
        default:
            return d;
    }
}


const obj = {
    'a': 1,
    'b': '1',
    'c': function () { },
    'd': null,
    'e': [],
    'f': {},
    "g": new Date(),
}

const newObj = _deepClone(obj);

console.log(newObj)