### HTTP1.0、HTTP1.1 和 HTTP2.0 的区别
- 影响一个 HTTP 网络请求的因素主要有两个：带宽和延迟。(主要是延迟)
> * 延迟
> > 浏览器阻塞: 浏览器会因为一些原因阻塞请求。浏览器对于同一个域名，同时只
能有 4 个连接（这个根据浏览器内核不同可能会有所差异），超过浏览器最大连接
数限制，后续请求就会被阻塞
> > DNS解析域名IP延迟 可以利用利用DNS缓存
> > 建立连接： HTTP 是基于 TCP 协议的，浏览器最快也要在第三次握手时才能捎
带 HTTP 请求报文，达到真正的建立连接，但是这些连接无法复用会导致每次请求都
经历三次握手和慢启动。三次握手在高延迟的场景下影响较明显，慢启动则对文件类
大请求影响较大

### HTTP1.0 和 HTTP1.1的一些区别
- 缓存处理
> 在**HTTP1.0**中主要使用header里的If-Modified-Since,Expires来做为缓存判断
的标准，**HTTP1.1**则引入了更多的缓存控制策略例如Entity tag，
If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控
制缓存策略
- 带宽优化及网络连接的使用
> HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，
而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引
入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial 
Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接
- 错误通知的管理
> 在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与
资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除
- Host头处理
> 在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL
并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器
上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地
址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host
头域会报告一个错误（400 Bad Request）

### HTTPS与HTTP的一些区别
- HTTPS协议需要到CA申请证书，一般免费证书很少，需要交费。
- HTTP协议运行在TCP之上，所有传输的内容都是明文，HTTPS运行在SSL/TLS之
上，SSL/TLS运行在TCP之上，所有传输的内容都经过加密的
- HTTP和HTTPS使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者
是443
- HTTPS可以有效的防止运营商劫持，解决了防劫持的一个大问题

### HTTP2.0和SPDY的区别
- HTTP2.0 支持明文 HTTP 传输，而 SPDY 强制使用 HTTPS
- HTTP2.0 消息头的压缩算法采用 [HPACK]: http://http2.github.io/
http2-spec/compression.html，而非 SPDY 采用的 [DEFLATE]: http://
zh.wikipedia.org/wiki/DEFLATE