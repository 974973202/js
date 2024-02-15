### HTML全称
- 超文本标记语言

### 常见的浏览器内核有哪些
- Trident：IE、360
- Gecko：Firefox
- Webkit：Safari、Chrome内核原型
- Chromium/Blink：Chrome
- Blink：opera

块级元素：独占一行，默认宽度撑满父元素。可以设置宽高内外边距。div  p
行内元素：不独占一行，宽度取决于内容大小，只能设置外边距。 a span
行内块元素：不独占一行，宽度取决于内容大小，可以设置宽高内外边距 img 

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
   })
})
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

### 浏览器渲染过程
1. 处理 HTML 标记并构建 DOM 树。
2. 处理 CSS 标记并构建 CSSOM 树。
3. 将 DOM 与 CSSOM 合并成一个渲染树。
4. 根据渲染树来布局，以计算每个节点的几何信息。
5. 将各个节点绘制到屏幕上。
6. 浏览器主进程将默认的图层和复合图层交给 GPU 进程,GPU 进程再将各个图层合成（composite）,最后显示出页面
- 从耗时的角度，浏览器请求、加载、渲染一个页面，时间花在下面五件事情上：
> 1. DNS 查询
> 2. TCP 连接
> 3. HTTP 请求即响应
> 4. 服务器响应
> 5. 客户端渲染

### 首屏加载优化
- Vue-Router路由懒加载（利用Webpack的代码切割）
- 使用CDN加速，将通用的库从vendor进行抽离
- Nginx的gzip压缩
- Vue异步组件
- 服务端渲染SSR
- 如果使用了一些UI库，采用按需加载
- Webpack开启gzip压缩
- 如果首屏为登录页，可以做成多入口
- Service Worker缓存文件处理
- 使用link标签的rel属性设置   prefetch（这段资源将会在未来某个导航或者功
能要用到，但是本资源的下载顺序权重比较低，prefetch通常用于加速下一次导
航）、preload（preload将会把资源得下载顺序权重提高，使得关键数据提前下载
好，优化页面打开速度）

### 何时触发回流和重绘
- 回流必将引起重绘，重绘不一定会引起回流。
> 1. 添加或删除可见的DOM元素
> 2. 元素的位置发生变化
> 3. 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
> 4. 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
> 5. 页面一开始渲染的时候（这肯定避免不了）
> 6. 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

### 如何避免触发回流和重绘
- CSS
> 避免使用table布局。
> 尽可能在DOM树的最末端改变class。
> 避免设置多层内联样式。
> 将动画效果应用到position属性为absolute或fixed的元素上
> 避免使用CSS表达式（例如：calc()）
> CSS3硬件加速（GPU加速） transform
- JavaScript
> 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并
一次性更改class属性
> 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最
后再把它添加到文档中
> 也可以先为元素设置display: none，操作结束后再把它显示出来。因为在
display属性为none的元素上进行的DOM操作不会引发回流和重绘
> 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓
存起来
> 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续
元素频繁回流

### CSS加载会造成阻塞吗
- css加载不会阻塞DOM树的**解析**
- css加载会阻塞DOM树的**渲染**
- css加载会阻塞**后面js**语句的执行

- 怎么判断页面是否加载完成
> onLoad 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。
> DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。

- DOMContentLoaded
 - 如果页面中同时存在css和js，并且存在js在css后面，则DOMContentLoaded事件会在css加载完后才执行。
 - 其他情况下，DOMContentLoaded都不会等待css加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。

### 为什么 JS 阻塞页面加载 ?
由于 JavaScript 是可操纵 DOM 的,如果在修改这些元素属性同时渲染界面（即 JavaScript 线程和 UI 线程同时运行）,那么渲染线程前后获得的元素数据就可能不一致了。
因此为了防止渲染出现不可预期的结果,浏览器设置 GUI 渲染线程与 JavaScript 引擎为互斥的关系。
当 JavaScript 引擎执行时 GUI 线程会被挂起,GUI 更新会被保存在一个队列中等到引擎线程空闲时立即被执行。
从上面我们可以推理出,由于 GUI 渲染线程与 JavaScript 执行线程是互斥的关系,
当浏览器在执行 JavaScript 程序的时候,GUI 渲染线程会被保存在一个队列中,直到 JS 程序执行完成,才会接着执行。
因此如果 JS 执行的时间过长,这样就会造成页面的渲染不连贯,导致页面渲染加载阻塞的感觉。
- `js的加载会阻塞DOM树的解析`

### 渲染过程中遇到JS文件怎么处理？
JavaScript的加载、解析与执行会阻塞DOM的构建，也就是说，在构建DOM时，HTML解析器若遇到了JavaScript，那么它会暂停构建DOM，将控制权移交给JavaScript引擎，等JavaScript引擎运行完毕，浏览器再从中断的地方恢复DOM构建。

也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件，这也是都建议将 script 标签放在 body 标签底部的原因。当然在当下，并不是说 script 标签必须放在底部，因为你可以给 script 标签添加 defer 或者 async 属性（下文会介绍这两者的区别）。

`JS文件不只是阻塞DOM的构建，它会导致CSSOM也阻塞DOM的构建。`

`原本DOM和CSSOM的构建是互不影响，井水不犯河水，但是一旦引入了JavaScript，CSSOM也开始阻塞DOM的构建，只有CSSOM构建完毕后，DOM再恢复DOM构建。`

- 这是什么情况？

这是因为JavaScript不只是可以改DOM，它还可以更改样式，也就是它可以更改CSSOM。前面我们介绍，不完整的CSSOM是无法使用的，但JavaScript中想访问CSSOM并更改它，那么在执行JavaScript时，必须要能拿到完整的CSSOM。所以就导致了一个现象，如果浏览器尚未完成CSSOM的下载和构建，而我们却想在此时运行脚本，那么浏览器将延迟脚本执行和DOM构建，直至其完成CSSOM的下载和构建。也就是说，在这种情况下，**浏览器会先下载和构建CSSOM，然后再执行JavaScript，最后在继续构建DOM**。

### DOMContentLoaded 与 load 的区别 ?
当 DOMContentLoaded 事件触发时,仅当 DOM 解析完成后,不包括样式表,图片。我们前面提到 CSS 加载会阻塞 Dom 的渲染和后面 js 的执行,js 会阻塞 Dom 解析,所以我们可以得到结论:当文档中没有脚本时,浏览器解析完文档便能触发 DOMContentLoaded 事件。如果文档中包含脚本,则脚本会阻塞文档的解析,而脚本需要等 CSSOM 构建完成才能执行。在任何情况下,DOMContentLoaded 的触发不需要等待图片等其他资源加载完成。
当 onload 事件触发时,页面上所有的 DOM,样式表,脚本,图片等资源已经加载完毕。
DOMContentLoaded -> load。
### 加载解析渲染

### JS 什么时候解析？

```js
<script>
渲染过程中，如果遇到 JS 就停止渲染，执行 JS 代码。
如果 JS 需要操作CSSOM，则会先让CSSOM构建完，再执行JS，最后构建DOM

<script async>
异步执行引入的 JavaScript，加载完成后就执行 JS，阻塞DOM

<script defer>
延迟执行。载入 JavaScript 文件时不阻塞 HTML 的解析，执行阶段被放到HTML标签解析完成之后。
{/* defer js和html 并行执行加载，等到html解析完，js才执行 */}
{/* 设置了defer后 DOMContentLoaded会等到js执行完再触发 */}
```
- defer 属性仅适用于外部脚本，如果 script 脚本没有 src，则会忽略 defer 特性
- defer 届性对模块脚本 (script type='module') 无效，因为模块脚本就是以 defer 的形式加载的


### 什么是 CRP,即关键渲染路径(Critical Rendering Path)? 如何优化 ?
关键渲染路径是浏览器将 HTML CSS JavaScript 转换为在屏幕上呈现的像素内容所经历的一系列步骤。也就是我们上面说的浏览器渲染流程。
为尽快完成首次渲染,我们需要最大限度减小以下三种可变因素:
- 关键资源的数量: 可能阻止网页首次渲染的资源。
- 关键路径长度: 获取所有关键资源所需的往返次数或总时间。
- 关键字节: 实现网页首次渲染所需的总字节数,等同于所有关键资源传送文件大小的总和。
1. 优化 DOM
 - 删除不必要的代码和注释包括空格,尽量做到最小化文件。
 - 可以利用 GZIP 压缩文件
 - 结合 HTTP 缓存文件
2. 优化 CSSOM
  缩小、压缩以及缓存同样重要,对于 CSSOM 我们前面重点提过了它会阻止页面呈现,因此我们可以从这方面考虑去优化
 - 减少关键 CSS 元素数量
 - 当我们声明样式表时,请密切关注媒体查询的类型,它们极大地影响了 CRP 的性能 
3. 优化 JavaScript
当浏览器遇到 script 标记时,会阻止解析器继续操作,直到 CSSOM 构建完毕,JavaScript 才会运行并继续完成 DOM 构建过程。
 - async: 当我们在 script 标记添加 async 属性以后,浏览器遇到这个 script 标记时会继续解析 DOM,同时脚本也不会被 CSSOM 阻止,即不会阻止 CRP。
 - defer: 与 async 的区别在于,脚本需要等到文档解析后（ DOMContentLoaded 事件前）执行,而 async 允许脚本在文档解析时位于后台运行（两者下载的过程不会阻塞 DOM,但执行会）。
 - 当我们的脚本不会修改 DOM 或 CSSOM 时,推荐使用 async 。
 - 预加载 —— preload & prefetch 。
 - DNS 预解析 —— dns-prefetch 。


### async 和 defer
- defer `加载完等html解析完执行`
1. 不阻塞浏览器解析 HTML，等解析完 HTML 之后，才会执行 script。
2. 会并行下载 JavaScript 资源。
3. 会按照 HTML 中的相对顺序执行脚本
4. 会在脚本下载并执行完成之后，才会触发 DOMContentLoaded 事件。
5. 在脚本执行过程中，一定可以获取到 HTML 中已有的元素
6. defer 属性对模块脚本无效。
7. 适用于: 所有外部脚本 (通过 src 引用的 script )。

- async `加载完就执行`
1. 不阻塞浏览器解析 HTML，但是 script 下载完成后，会立即中断浏览器解析 HTML，并执行此 script
2. 会并行下载 JavaScript 资源。
3. 互相独立，谁先下载完，谁先执行，没有固定的先后顺序，不可控。
4. 由于没有确定的执行时机，所以在脚本里面可能会获取不到 HTML 中已有的元素
5. DOMContentLoaded 事件和 script 脚本无相关性，无法确定他们的先后顺序
6. 适用于:独立的第三方脚本。

### 各种获得宽高的方式
```
获取屏幕的高度和宽度（屏幕分辨率）：window.screen.height/width
获取屏幕工作区域的高度和宽度（去掉状态栏）：window.screen.availHeight/availWidth
网页全文的高度和宽度：document.body.scrollHeight/Width
滚动条卷上去的高度和向右卷的宽度：document.body.scrollTop/scrollLeft
网页可见区域的高度和宽度（不加边线）：document.body.clientHeight/clientWidth
网页可见区域的高度和宽度（加边线）：document.body.offsetHeight/offsetWidth
```