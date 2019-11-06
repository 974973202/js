// 防抖 debounce
// 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，
// 如果在 n 秒内又触发了事件，则会重新计算函数执行时间

/**
 * 非立即执行版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */

function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait);
  }
}

/**
 * 立即执行版
 * @param {Function} func 传入执行函数
 * @param {Number} wait 等待执行时间
 */
function debounce1(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait)

    if (callNow) func.apply(context, args)
  }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce2(func, wait, immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    }else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
  }
}

