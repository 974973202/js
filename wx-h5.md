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
首屏时间的计算，可以由 Native WebView 提供的类似 onload 的方法实现，在 ios 下对应的是 webViewDidFinishLoad，在 android 下对应的是onPageFinished事件。
白屏的定义有多种。可以认为“没有任何内容”是白屏，可以认为“网络或服务异常”是白屏，可以认为“数据加载中”是白屏，可以认为“图片加载不出来”是白屏。场景不同，白屏的计算方式就不相同。
方法1：当页面的元素数小于x时，则认为页面白屏。比如“没有任何内容”，可以获取页面的DOM节点数，判断DOM节点数少于某个阈值X，则认为白屏。
方法2：当页面出现业务定义的错误码时，则认为是白屏。比如“网络或服务异常”。
方法3：当页面出现业务定义的特征值时，则认为是白屏。比如“数据加载中”