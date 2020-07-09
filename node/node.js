const http = require('http');


http.createServer((req, res) => {
  res.writeHead(200, {
    'content-type': 'text/plain'
  });
  res.write('lzx')
  res.end()
}).listen(1234, () => {
  console.log(1234)
})