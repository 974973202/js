Function.prototype._call = function (context) {
    const context = context || window;
    context.fn = this;

    const arr = []

    for (var i = 1; i < arguments.length; i++) {
        arr.push(`arguments[${i}]`)
    }

    var result = eval(`context.fn(${arr})`);
    delete context.fn;
    return result;
}