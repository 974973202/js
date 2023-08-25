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