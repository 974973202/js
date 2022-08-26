### HTML全称
- 超文本标记语言

### 常见的浏览器内核有哪些
- Trident：IE、360
- Gecko：Firefox
- Webkit：Safari、Chrome内核原型
- Chromium/Blink：Chrome
- Blink：opera

### 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
- cookie的设置
```javascript
// document.cookie = `${name}=${value};max-age=${time}`;
const manageCookie = {
   setCookie(name, value, time) {
      document.cookie = `${name}=${value};max-age=${time}`;
      return this;
   },
   deleteCookie(name) {
      return this.setCookie(name, '', -1);
   },
   getCookie(name, callback) {
      const allCookieArr = document.cookie.split(';');
      for (let i = 0; i < allCookieArr.lenght; i ++) {
         const itemCookieArr = allCookieArr[i].split('=');
         if (itemCookieArr[0] == name) {
            callback(itemCookieArr[1])
            return this
         }
      }
   }
}
```
- 存储大小
 - cookie数据大小不能超过4k。
 - sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大

- 有效时间
 - sessionStorage：数据在当前浏览器窗口关闭后自动删除。
 - cookie：设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭

- 数据与服务器之间的交互方式
 - cookie的数据会自动的传递到服务器，服务器端也可以写cookie到客户端。
 - sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。


### JavaScript异步加载方案
```javascript
function loadScript(url, callback){
   var script = document.createElement("script")
   script.type = "text/javascript";
   if (script.readyState){ //IE
      script.onreadystatechange = function(){
         if (script.readyState == "loaded" || script.readyState == "complete"){
            script.onreadystatechange = null;
            callback();
         }
      };
   } else { //Others: Firefox, Safari, Chrome, and Opera
      script.onload = function(){
          callback();
      };
   }
   script.src = url;
   document.body.appendChild(script);
}
```

### HTML5新特性
1. canvas
2. SVG
 - canvas适合小面积大数量的应用 svg适合大面积小数量的应用场景，canvas绘制的是位图，放大会失真
3. requestAnimationFrame / cancelAnimFrame
4. 客户端存储Web Storage
 - localStorage / sessionStorage
 - setItem(name, val); 设置属性 
 - getItem(name); 获得属性值
 - removeItem(name); 移除属性值
 - clear(); 清除属性
5. history
```javascript
history.go(n) // 路由跳转，比如n为 2 是往前移动2个页面，n为 -2 是向后移动2个页面，n为0是刷新页面
history.back() // 路由后退，相当于 history.go(-1)
history.forward() // 路由前进，相当于 history.go(1)
history.pushState() // 添加一条路由历史记录，如果设置跨域网址则报错
// 说明
// 浏览器不会向服务端请求数据，直接改变url地址，可以类似的理解为变相版的hash；但不像hash一样，浏览器会记录pushState的历史记录，可以使用浏览器的前进、后退功能作用
// 使用方法
// pushState(state, title, url)
// 参数说明
// state: 可以通过history.state读取
// title: 可选参数，暂时没有用，建议传个短标题
// url: 改变过后的url地址

history.replaceState() // 替换当前页在路由历史记录的信息
// popstate 事件：当活动的历史记录发生变化，就会触发 popstate 事件，在点击浏览器的前进后退按钮或者调用上面前三个方法的时候也会触发
```
6. WebWorker: 通过加载一个脚本文件，进而创建一个独立工作的线程，在主线程之外运行  
7. Geolocation/位置信息 devicemotion/监听加速度变化 deviceorientation/监听设备在方向上的变化
8. 多媒体（video, audio）
9. drag & drop
10. FileReader
11. WebSocket: 单个 TCP 连接上进行全双工通讯的协议
12. 语义标签
　　语义化标签使得页面的内容结构化，见名知义
   标签	 描述
   <hrader></header>	 定义了文档的头部区域
   <footer></footer>	 定义了文档的尾部区域
   <nav></nav>	定义文档的导航
   <section></section>	 定义文档中的节（section、区段）
   <article></article>	 定义页面独立的内容区域
   <aside></aside>	定义页面的侧边栏内容
   <detailes></detailes>	用于描述文档或文档某个部分的细节
   <summary></summary>	标签包含 details 元素的标题
   <dialog></dialog>	定义对话框，比如提示框


[audio-video属性方法表]https://www.jianshu.com/p/b329e951d7e1

[前端必知必会--操作URL的黑科技]https://juejin.im/post/5d038c9051882548ac439933
```javascript
let url = '?wd=蔡徐坤&skill=篮球&year=2019';
let searchParams = new URLSearchParams(url);

for (let p of searchParams) {
  console.log(p);
}
// ["wd", "蔡徐坤"]
// ["skill", "篮球"]
// ["year", "2019"]

// 把键值对列表转换为一个对象
const params = Object.fromEntries(urlSearchParams.entries());
// { skill: "篮球", wd: "蔡徐坤", year: "2019" }
```

### ios微信h5视频自动播放
1. script标签引入https://res.wx.qq.com/open/js/jweixin-1.5.0.js
```js
...
this.wxinvoke(()=>{
   let timer = setInterval(()=>{
  console.error('执行')
  if (this.$refs.videoEle) {
    clearInterval(timer)
    this.$refs.videoEle.play()
  }
},200)
...

wxinvoke(cb) {
  if (window.WeixinJSBridge) {
    window.WeixinJSBridge.invoke('getNetworkType', {}, cb, false)
  } else {
    let _cb = () => {
      document.body.removeEventListener('WeixinJSBridgeReady', _cb, false)
      window.WeixinJSBridge.invoke('getNetworkType', {}, cb)
    }
    document.addEventListener('WeixinJSBridgeReady', _cb, false)
  }
},
```

### 首屏和白屏时间如何计算
<!-- 主要依靠了浏览器提供的两个API：MutationObserver、performance  -->
首屏渲染时间的计算[https://cloud.tencent.com/developer/article/1650697]

首屏时间的计算，可以由 Native WebView 提供的类似 onload 的方法实现，在 ios 下对应的是 webViewDidFinishLoad，在 android 下对应的是onPageFinished事件。
白屏的定义有多种。可以认为“没有任何内容”是白屏，可以认为“网络或服务异常”是白屏，可以认为“数据加载中”是白屏，可以认为“图片加载不出来”是白屏。场景不同，白屏的计算方式就不相同。
方法1：当页面的元素数小于x时，则认为页面白屏。比如“没有任何内容”，可以获取页面的DOM节点数，判断DOM节点数少于某个阈值X，则认为白屏。
方法2：当页面出现业务定义的错误码时，则认为是白屏。比如“网络或服务异常”。
方法3：当页面出现业务定义的特征值时，则认为是白屏。比如“数据加载中”