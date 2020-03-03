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