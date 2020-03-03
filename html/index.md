### HTML全称
- 超文本标记语言

### 常见的浏览器内核有哪些
- Trident：IE、360
- Gecko：Firefox
- Webkit：Safari、Chrome内核原型
- Chromium/Blink：Chrome
- Blink：opera

### 请描述一下 cookies，sessionStorage 和 localStorage 的区别？
- 存储大小
 - cookie数据大小不能超过4k。
 - sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大

- 有效时间
 - sessionStorage和localStorage：虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。
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
3. requestAnimationFrame
4. 客户端存储
5. history
```javascript
history.go(n) // 路由跳转，比如n为 2 是往前移动2个页面，n为 -2 是向后移动2个页面，n为0是刷新页面
history.back() // 路由后退，相当于 history.go(-1)
history.forward() // 路由前进，相当于 history.go(1)
history.pushState() // 添加一条路由历史记录，如果设置跨域网址则报错
history.replaceState() // 替换当前页在路由历史记录的信息
// popstate 事件：当活动的历史记录发生变化，就会触发 popstate 事件，在点击浏览器的前进后退按钮或者调用上面前三个方法的时候也会触发
```
6. worker
7. Geolocation/位置信息 devicemotion/监听加速度变化 deviceorientation/监听设备在方向上的变化
8. 多媒体（video, audio）
9. drag & drop
10. FileReader
11. WebSocket


[audio-video属性方法表]https://www.jianshu.com/p/1fe701c9179f

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
```