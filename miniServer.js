const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.header("Access-Control-Allow-Origin","*");
  fs.readFile('./index.html', 'utf8', function(err, content){
    res.end(content)
  });
  
})

server.listen(12306, () => {
  console.log('http://localhost:12306/')
})