### 1. js-base64
```js
npm install --save js-base64

Base64.encode('我是一段需要处理的字符'); // 加密
Base64.decode('5oiR5piv5LiA5q616ZyA6KaB5aSE55CG55qE5a2X56ym') // 解密
```

### 2. js内置方法进行转换
```js
加密使用：window.btoa(unescape(encodeURIComponent('我是一段需要处理的字符')))

解密使用：decodeURIComponent(escape(window.atob('5oiR5piv5LiA5q616ZyA6KaB5aSE55CG55qE5a2X56ym')))
// 1. 该方式只是兼容ie10及其以上，做移动端项目或者对ie低版本兼容没要求，这种方式适用；
// 2. 该方式需要将字符串先编码才能进行转base64，否则中文字符串会报错
```

### node环境内置方法进行转换
```js
// 普通字符串
//编码
new Buffer(String).toString('base64');
//解码
new Buffer(base64Str, 'base64').toString();

// 十六进制
//编码
new Buffer(String, 'base64').toString('hex');
//解码
new Buffer(base64Str, 'hex').toString('utf8');

// 图片
const fs = require('fs');
//编码
function base64_encode(file) {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}
//解码
function base64_decode(base64str, file) {
    var bitmap = new Buffer(base64str, 'base64');
    fs.writeFileSync(file, bitmap);
}

```