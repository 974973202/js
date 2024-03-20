CSR: 客户端渲染
SSR：服务端渲染

CSR缺点：
  1. 首屏等待时间长，用户体验差
  2. 页面结构为空，不利于SEO

SSR同构：是指实现客户端和服务端最大程度的代码复用，在服务端使用客户端的生命周期方法等

renderToString: 将组件转换为html模板

- react提供的SSR方法有两个renderToString 和 renderToStaticMarkup，区别如下：
renderToString 方法渲染的时候带有 data-reactid 属性. 在浏览器访问页面的时候，main.js能识别到HTML的内容，不会执行React.createElement二次创建DOM。
renderToStaticMarkup 则没有 data-reactid 属性，页面看上去干净点。在浏览器访问页面的时候，main.js不能识别到HTML内容，会执行main.js里面的React.createElement方法重新创建DOM

- react-router-config 是一个辅助react-router的插件,主要是使用配置文件集中式管理路由