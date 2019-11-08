// 判断回文字符串
function isPalindrome(str) {
  if(typeof str !== 'string') {
    console.log(typeof str)
    return false;
  }
  var newStr = str.split('').reverse().join('');
  return newStr === str
}

function isPalindrome1(str) {
  if(typeof str !== 'string') {
    console.log(typeof str)
    return false;
  };
  var newStr = '';
  for(var i = str.length - 1; i >= 0; i --) {
    newStr += str[i]
  }
  return newStr === str
}


// 字符串中出现最多的字母
function findMaxDuplicateChar(str) {
  if(typeof str !== 'string') {
    console.log(typeof str)
    return false;
  };
  let obj = {}
  str.split('').forEach(e => {
    if(obj[e]) {
      obj[e] += 1
    } else {
      obj[e] = 1
    }
  })
  let num = 1;
  let MaxStr = '';
  for(var key in obj) {
    if(obj[key] > num) {
      num = obj[key]
      MaxStr = key;
    }
  }
  return MaxStr + ':' + num
}

// 数组去重
var arr = [1,2,3,4,5,2,2,2,2,33,3,32,2,1,'d', '1']
function unique(arr) {
  var obj = {};
  for(var key in arr) {
    if(obj[key]) {
      
    }
    console.log(arr[key])
  }
}
console.log(unique(arr))