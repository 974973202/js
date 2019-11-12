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

### 浏览器渲染过程