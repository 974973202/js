[audio-video属性方法表]https://www.jianshu.com/p/1fe701c9179f

### HTML5 History Api
1. history.go(n)：路由跳转，比如n为 2 是往前移动2个页面，n为 -2 是向后移动2个页面，n为0是刷新页面
2. history.back()：路由后退，相当于 history.go(-1)
3. history.forward()：路由前进，相当于 history.go(1)
4. history.pushState()：添加一条路由历史记录，如果设置跨域网址则报错
5. history.replaceState()：替换当前页在路由历史记录的信息
6. popstate 事件：当活动的历史记录发生变化，就会触发 popstate 事件，在点击浏览器的前进后退按钮或者调用上面前三个方法的时候也会触发

[前端必知必会--操作URL的黑科技]https://juejin.im/post/5d038c9051882548ac439933
```
let url = '?wd=蔡徐坤&skill=篮球&year=2019';
let searchParams = new URLSearchParams(url);

for (let p of searchParams) {
  console.log(p);
}
// ["wd", "蔡徐坤"]
// ["skill", "篮球"]
// ["year", "2019"]
```