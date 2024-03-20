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