### 优势
- 技术栈无关：主框架不限制接入应用的技术栈，微应用具备完全自主权
- 独立开发，独立部署：微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
- 增量升级：在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略
- 独立运行时：每个微应用之间状态隔离，运行时状态不共享

### 加载模式
- 主动加载：主动加载是通过监听浏览器URL的变化，自动的加载其所对应的子系统  添加activeRule: 'xx'
- 手动加载：手动加载是在主应用中，触发了相应的操作，从而加载子应用  添加activeRule: true

```js
// main.js中
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([ // registerMicroApps, 注册微应用
  {
    name: 'qiankun-vue3', // 微应用的名称
    entry: '//localhost:5000', // 微应用的地址
    container: '#sub-app', // 主应用中挂载微应用的Dom节点
    activeRule: "vue3", // 当路由匹配到activeRule的时候，自动加载微应用
    props: {} // 向微应用中传递的参数，稍后会有介绍
  },
  {
    name: 'qiankun-vue2',
    entry: '//localhost:4000',
    container: '#sub-app',
    activeRule: "vue2"
  }
])

// 启动 qiankun
start()
```

### 生命周期
- bootstrap：微应用加载之前需要执行的操作  
- mount：微应用加载完成之后需要执行的操作    
- unmount：微应用卸载之前需要执行的操作  
- unload：微应用卸载之后需要执行的操作  

### 跳转
子系统到主系统 子系统到子系统
1. 使用history.pushState()进行跳转
2. 使用主应用的router进行跳转

### 全局状态管理(通信)
通过路由参数通信：前提是需要发生页面跳转行为
- 在qiankun中提供了initGlobalState方法，这个initGlobalState方法本质上就是一个发布订阅模式，用于改变全局的数据状态。返回值如下：
- onGlobalStateChange：监听全局属性状态的改变
- setGlobalStateChange: 改变全局属性的状态
- offGlobalStateChange: 取消监听全局属性


