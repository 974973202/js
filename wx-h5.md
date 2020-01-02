### ios微信h5视频自动播放
1. script标签引入https://res.wx.qq.com/open/js/jweixin-1.5.0.js
```
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