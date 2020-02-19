### canvas生成图片大小问题
https://juejin.im/post/5d8f97ea5188250bdf5a382c
https://developers.weixin.qq.com/community/develop/doc/00042e7079cea8cda5488824f5b800
https://developers.weixin.qq.com/community/develop/doc/00048aa9e181282e68095dcf956800
https://blog.csdn.net/weixin_34319374/article/details/92504668

### 小程序的坑
1. 分享 - 弹框合成canvas - 如果在分享界面停留太久会导致canvas不能正常渲染，猜测是因为小程序内部对画布不出现在视图的情况下默认不渲染？参考微信小游戏...？
2. video组件里面使用cover-image, cover-view会导致，后面有弹框的操作被cover-image, cover-view覆盖，因为这层级最高
3. 部分机型在视频页有弹框时。普通的view，image会被视频盖住。 如果使用cover-image, cover-view来写弹框会导致超出视频部分被截断
4. video播放问题，小程序默认切换页面时会自动暂停视频，回来继续播放，如果是调到打赏页面触发打赏或者切出小程序（后台挂着），则小程序默认切换页面的自动暂停播放会失效
5. wx.requestSubscribeMessage订阅方法，不能用promise封装只能在事件中同步调用，前面不能有await的异步方法，此外只能用户发生点击行为或者发起支付回调后触发
6. 小程序的分享函数 onShareAppMessage 不能加上async 指定分享出去的图片和标题会失效
7. button上的默认边框效果去除 首先给button设置border：0是无效的。因为小程序中button的边框是用::after实现的，所以说想要去除button上的边框需要设置button::after{border：none}就可以
8. setData 频繁setData对性能不友好
9. 不同机型兼容性
10. 小程序主包最多2M
11. 调用wx.hideTabbar隐藏原生tabbar导航栏时导致页面闪动
