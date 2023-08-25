// 节流 throttle
// 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
// 节流会稀释函数的执行频率。
// 对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版

// 通俗来说 无论你触发多少次 我只在规定时间内给你执行一次

/**
 * 时间戳版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function throttle(func, wait) {
    let previous = 0;
    return function () {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}

/**
 * 定时器版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function throttle1(func, wait) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }

    }
}

// 时间戳版的函数触发是在时间段内开始的时候，
// 而定时器版的函数触发是在时间段内结束的时候

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle2(func, wait, type) {
    let previous = 0;
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (type === 1) {
            let now = Date.now();

            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        } else if (type === 2) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }
    }
}