### XSS漏洞
```
不严谨的 content-type导致的 XSS 漏洞，想象一下 JSONP 就是你请求 http://youdomain.com?
callback=douniwan, 然后返回 douniwan({ data })，那假如请求 http://youdomain.com?
callback=<script>alert(1)</script> 不就返回 <script>alert(1)</script>({ data })了吗
，如果没有严格定义好 Content-Type（ Content-Type: application/json ），再加上没有过滤 
callback 参数，直接当 html 解析了，就是一个赤裸裸的 XSS 了。

解决方法：严格定义 Content-Type: application/json，然后严格过滤 callback 后的参数并且限制
长度（进行字符转义，例如<换成&lt，>换成&gt）等，这样返回的脚本内容会变成文本格式，脚本将不会
执行。
```
- XSS攻击的危害
1. 获取页面数据
2. 获取Cookies
3. 劫持前端逻辑
4. 发送请求
5. 偷取网站任意数据
6. 偷取用户资料
7. 偷取用户密码和登陆态
8. 欺骗用户

- XSS 攻击的防范
> 用户的输入检查 例：转义字符串
> 服务端的输出检查
> 请求设置 Content-Type: application/json
> 黑名单
> 白名单  response.addHeader("Set-Cookie", "uid=112; path=/; HttpOnly")

### CSRF
> 是跨站请求伪造，既攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器
- CSRF攻击的危害
1. 利用用户登录态
2. 用户不知情
3. 完成业务请求
4. 盗取用户资金
5. 冒充用户
6. 损害网页声誉

- CSRF 攻击的防范
> 验证码
> Referer Check (Referer源检查) == 阻止第三方网站请求接口
> 添加 token 验证

### 点击劫持
> 是一种视觉欺骗手段，攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己
的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击
- 点击劫持的防范
> X-FRAME-OPTIONS⼀个 HTTP 响应头，在现代浏览器有⼀个很好的⽀持。这个 HTTP 响应
> 头就是为了防御⽤ iframe 嵌套的点击劫持攻击。
> 该响应头有三个值可选，分别是
```
DENY，表示⻚⾯不允许通过 iframe 的⽅式展示
SAMEORIGIN，表示⻚⾯可以在相同域名下通过 iframe 的⽅式展示
ALLOW-FROM，表示⻚⾯可以在指定来源的 iframe 中展示

ctx.set('X-FRAME-OPTIONS', 'DENY')
```

### SQL注入

### OS命令注入

### 请求劫持
> 是DNS服务器(DNS解析各个步骤)被篡改，修改了域名解析的结果，使得访问到的不是预期的ip
- 请求劫持的防范
> HTTP劫持运营商劫持，此时⼤概只能升级HTTPS了

### DDOS
> 就是简单粗暴地送来⼤量正常的请求，超出服务器的最⼤承受量，导致宕机

### 跨域解决方案
> JSONP
> CORS
> Nginx反向代理
> postMessage
> document.domain