// deepClone
// 1. 判断是否是对象类型 typeof
// 2. for in 遍历
// 3. 判断是否是自身属性
// 4. 判断内属性是否是对象类型 typeof 是 继续deepClone 否 直接赋值

function deepClone(obj) {
  if(!isObject(obj)) return obj;

  var target = Array.isArray(obj) ? [] : {};

  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      if(isObject(obj[prop])) {
        target[prop] = deepClone(obj[prop])
      } else {
        target[prop] = obj[prop]
      }
    }
  }

  return target
}

function isObject(obj) {
  return typeof obj == 'object' && obj != null
}