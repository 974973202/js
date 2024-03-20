### 全局路由钩子  beforeEach  beforeResolve  afterEach
1、全局守卫： router.beforeEach
2、全局解析守卫： router.beforeResolve
3、全局后置钩子： router.afterEach
```javascript
{
  path: '/',
  name: 'home',
  component: '<div>Home</div>',
  meta: { title: 'A' },
}

router.beforeEach((to, from, next) => {
  console.log(to, from);
  console.log(to.meta.title); // 路由元信息
  next()
})
```

### 路由独享钩子 beforeEnter  afterEnter  beforeLeave
```javascript
{
  path: '/',
  name: 'home',
  component: '<div>Home</div>',
  beforeEnter: (to, from, next) => { // 全局守卫
    console.log('before enter home')
    next()
  },
  afterEnter: (to, from, next) => {
    console.log('enter home')
    next()
  },
  beforeLeave: (to, from, next) => {
    console.log('start leave home')
    next()
  }
},
// 这三个参数 to 、from 、next 分别的作用：
// 1、to: Route，代表要进入的目标，它是一个路由对象；
// 2、from: Route，代表当前正要离开的路由，同样也是一个路由对象；
// 3、next: Function，这是一个必须需要调用的方法，而具体的执行效果则依赖 next 方法调用的参数
```

### 组件内导航钩子 beforeRouteEnter  beforeRouteUpdate beforeRouteLeave
```javascript
  beforeRouteEnter(to, from, next) {
    // do someting
    // 在渲染该组件的对应路由被 confirm 前调用
  },
  beforeRouteUpdate(to, from, next) {
    // do someting
    // 在当前路由改变，但是依然渲染该组件是调用 
  },
  beforeRouteLeave(to, from, next) {
    // do someting
    // 导航离开该组件的对应路由时被调用
  }
```

### 路由动态添加（可做权限）
```javascript
this.$router.addRoutes([
  {
    path: '/home',
    component: '<div>Home</div>',
    meta: { title: 'A' },
  }
])
```

### 路由导航完整解析流程
最后是完整的导航解析流程：
>  1、导航被触发
>  2、在失活的组件里调用离开守卫
>  3、调用全局的 beforeEach 守卫
>  4、在重用的组件里调用 beforeRouteUpdate 守卫
>  5、在路由配置里调用 beforEnter
>  6、解析异步路由组件
>  7、在被激活的组件里调用 beforeRouteEnter
>  8、调用全局的 beforeResolve 守卫
>  9、导航被确认
>  10、调用全局的 afterEach 钩子
>  11、触发 DOM 更新
>  12、在创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数

### route的打印数据
```
matched: [{..}, {..}], // 路由记录
meta: {title: "newAddMakeVideo", keepAlive: true}, // 路由元数据信息
path: '/', // 路径
query: {}, // query
params: {}, // params
name: '', // 路由名
fullPath: '/', // 完整路径
hash: '', // 当前路由的 hash 值 (带 #) ，如果没有 hash 值，则为空字符串。
```

### 关于路由，route / router 有什么区别
- route 表示路由信息对象，包括path,params,hash,query,fullPath,matched,name等路由信息参数
- router 表示路由实例对象，包括了路由的跳转方法，钩子函数等

### vue-router 传参方式有哪些
 - 通过params
  - 只能用name，不能用path
  - 参数不会显示在url上
  - 浏览器强制刷新会清空参数
 - 通过query
  - 只能用path，不能用name
  - name可以使用path路径
  - 参数会显示在url上
  - 浏览器刷新不清空参数

### 滚动行为
scrollBehavior(to, from, savedPosition) {
  // return 期望滚动的位置
  // return {
  //  x: 0,
  //  y: 0
  // }
}

### vue-router原理
- hash路由
  - 监听hashchange事件
```js
window.addEventListener('hashchange', () => {
  console.log(location.hash)
})
```

- history路由
 - history.pushState()

- 监听回退
 - popstate
```js
window.addEventListener('popstate', () => {
  console.log(location.pathname)
})
```