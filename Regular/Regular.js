const fs = require('fs');


// const reg = new RegExp('*');

fs.readFile('./Regular.txt', (err, data) => {
  console.log(data.toString().match(/(12)3{2}/g))
})