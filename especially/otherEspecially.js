// 判断回文字符串
function isPalindrome(str) {
  if (typeof str !== 'string') {
    console.log(typeof str)
    return false;
  }
  var newStr = str.split('').reverse().join('');
  return newStr === str
}

function isPalindrome1(str) {
  if (typeof str !== 'string') {
    console.log(typeof str)
    return false;
  };
  var newStr = '';
  for (var i = str.length - 1; i >= 0; i--) {
    newStr += str[i]
  }
  return newStr === str
}


// 字符串中出现最多的字母
function findMaxDuplicateChar(str) {
  if (typeof str !== 'string') {
    console.log(typeof str)
    return false;
  };
  let obj = {}
  str.split('').forEach(e => {
    if (obj[e]) {
      obj[e] += 1
    } else {
      obj[e] = 1
    }
  })
  let num = 1;
  let MaxStr = '';
  for (var key in obj) {
    if (obj[key] > num) {
      num = obj[key]
      MaxStr = key;
    }
  }
  return MaxStr + ':' + num
}

// 数组去重
// indexOf实现
var array = [1, 1, '1'];
function unique(array) {
  var res = [];
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];
    if (res.indexOf(current) === -1) {
      res.push(current)
    }
  }
  return res;
}
console.log(unique(array));

// 排序后去重
var array = [1, 1, '1'];
function unique(array) {
  var res = [];
  var sortedArray = array.concat().sort();
  var seen;
  for (var i = 0, len = sortedArray.length; i < len; i++) {
    // 如果是第一个元素或者相邻的元素不相同
    if (!i || seen !== sortedArray[i]) {
      res.push(sortedArray[i])
    }
    seen = sortedArray[i];
  }
  return res;
}
console.log(unique(array));

// filter实现
var array = [1, 2, 1, 1, '1'];
function unique(array) {
  var res = array.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  })
  return res;
}
console.log(unique(array));

// 排序去重
var array = [1, 2, 1, 1, '1'];
function unique(array) {
  return array.concat().sort().filter(function (item, index, array) {
    return !index || item !== array[index - 1]
  })
}
console.log(unique(array));

// Object键值对
var array = [{ value: 1 }, { value: 1 }, { value: 2 }];
function unique(array) {
  var obj = {};
  return array.filter(function (item, index, array) {
    console.log(typeof item + JSON.stringify(item))
    return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
  })
}
console.log(unique(array)); // [{value: 1}, {value: 2}]

// ES6 Set实现
var unique = (a) => [...new Set(a)]

function unique(arr) {
  var obj = {};
  var result = [];
  for (var key in arr) {
    if (!obj[arr[key]]) {
      obj[arr[key]] = true;
      result.push(arr[key])
    };
  };
  return result;
}

// 数组扁平化加去重
// var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
function flattenFn() {
  let result = [];
  return function flatten(arr) {
    arr.forEach(ele => {
      if (Array.isArray(ele)) {
        flatten(ele)
      } else {
        result.push(ele)
      }
    });
    return result
  }
}
// console.log(unique(flattenFn()(arr)))

// 迭代的方式实现数组扁平化
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
// es6
// const flatten = array => array.reduce((acc, cur) => (Array.isArray(cur) ? [...acc, ...flatten(cur)] : [...acc, cur]), [])

// 斐波那契数列
// 这个数列从第3项开始，每一项都等于前两项之和
function fb1(n) {
  if (n <= 1) {
    return 1
  } else {
    return fb1(n - 1) + fb2(n - 2)
  }
}

function fb2(n) {
  var b = 1; // 记录 n - 1次的数
  var sum = 1;
  for (var i = 1; i < n; i++) {
    var tmp = sum;
    sum += b;
    b = tmp;
  }
  return sum;
}
