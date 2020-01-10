### 全局路由钩子
1、全局守卫： router.beforeEach
2、全局解析守卫： router.beforeResolve
3、全局后置钩子： router.afterEach

### 路由独享钩子
```
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
这三个参数 to 、from 、next 分别的作用：
1、to: Route，代表要进入的目标，它是一个路由对象；
2、from: Route，代表当前正要离开的路由，同样也是一个路由对象；
3、next: Function，这是一个必须需要调用的方法，而具体的执行效果则依赖 next 方法调用的参数
```

### 组件内导航钩子
```
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

### 对于MVVM的理解
**MVVM** 是 Model-View-ViewModel 的缩写
**Model**: 代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为
**View**: 用户操作界面。当ViewModel对Model进行更新的时候，会通过数据绑定更新到View
**ViewModel**： 业务逻辑层，View需要什么数据，ViewModel要提供这个数据；View有某些操作，ViewModel就要响应这些操作，所以可以说它是Model for View.
总结： MVVM模式简化了界面与业务的依赖，解决了数据频繁更新。MVVM 在使用当中，利用双向绑定技术，使得 Model 变化时，ViewModel 会自动更新，而 ViewModel 变化时，View 也会自动变化。

### Vue的双向数据绑定原理是什么
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
具体实现步骤，感兴趣的可以看看:
1. 当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 都加上 setter和getter 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: 
1、在自身实例化时往属性订阅器(dep)里面添加自己 
2、自身必须有一个update()方法 
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果

### Proxy相比于defineProperty的优势 
Object.defineProperty() 的问题主要有三个：
- 不能监听数组的变化
- 必须遍历对象的每个属性
- 必须深层遍历嵌套的对象

Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
- 针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题
- 支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。
- 
除了上述两点之外，Proxy 还拥有以下优势：
- Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
- Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法