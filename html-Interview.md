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
- XSS 攻击的防范
> 用户的输入检查
> 服务端的输出检查
> 请求设置 Content-Type: application/json

### CSRF
> 是攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器
- CSRF 攻击的防范
> 验证码
> Referer Check (Referer源检查) == 阻止第三方网站请求接口
> 添加 token 验证

### 跨域解决方案
> JSONP
> CORS
> Nginx反向代理
> postMessage
> document.domain

