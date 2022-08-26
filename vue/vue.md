### vue父子组件的生命周期顺序
```
vue生命周期共分为四个阶段
一：实例创建
二：DOM渲染
三：数据更新
四：销毁实例
共有八个基本钩子函数
1.beforeCreate --创建前
触发的行为：vue实例的挂载元素$el和数据对象data都为undefined，还未初始化。
在此阶段可以做的事情：加loading事件

2.created	--创建后
触发的行为：vue实例的数据对象data有了，$el还没有
在此阶段可以做的事情：解决loading，请求ajax数据为mounted渲染做准备

3.beforeMount --渲染前
触发的行为：vue实例的$el和data都初始化了，但还是虚拟的dom节点，具体的data.filter还未替换
在此阶段可以做的事情：。。。

4.mounted --渲染后
触发的行为：vue实例挂载完成，data.filter成功渲染
在此阶段可以做的事情：配合路由钩子使用

5.beforeUpdate --更新前
触发的行为：data更新时触发
在此阶段可以做的事情：。。。

6.updated —更新后
触发的行为：data更新时触发
在此阶段可以做的事情：数据更新时，做一些处理（此处也可以用watch进行观测）

```
7、activated
　　keep-alive组件激活时调用。
　　该钩子在服务器端渲染期间不被调用。
8、deactivated
　　keep-alive组件停用时调用。
　　该钩子在服务端渲染期间不被调用。
```

7.beforeDestroy —销毁前
触发的行为：组件销毁时触发
在此阶段可以做的事情：可向用户询问是否销毁

8.destroyed —销毁后
触发的行为：组件销毁时触发，vue实例解除了事件监听以及和dom的绑定（无响应了），但DOM节点依旧存在
在此阶段可以做的事情：组件销毁时进行提示
```

1. 加载渲染过程
> 父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted
2. 子组件更新过程
> 父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated
3. 父组件更新过程
> 父beforeUpdate -> 父updated
4. 销毁过程
> 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

### $emit $on

### directive  自定义组件

### Vue.component

### Vue.extend

### Vue.use

### provide inject 跨组件通讯

### filters 过滤器  render后执行

### watch

### 1. 对于MVVM的理解
**MVVM** 是 Model-View-ViewModel 的缩写
**Model**: 代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为
**View**: 用户操作界面。当ViewModel对Model进行更新的时候，会通过数据绑定更新到View
**ViewModel**： 业务逻辑层，View需要什么数据，ViewModel要提供这个数据；View有某些操作，ViewModel就要响应这些操作，所以可以说它是Model for View.
总结： MVVM模式简化了界面与业务的依赖，解决了数据频繁更新。MVVM 在使用当中，利用双向绑定技术，使得 Model 变化时，ViewModel 会自动更新，而 ViewModel 变化时，View 也会自动变化。

### 2. Vue的双向数据绑定原理是什么
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
具体实现步骤，感兴趣的可以看看:
1. 当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 都加上 setter和getter 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，**get添加**监听数据的订阅者，一旦数据有变动，收到通知，set更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: 
1、在自身实例化时往属性订阅器(dep)里面添加自己 
2、自身必须有一个update()方法 
3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果

### 3. Vue中是如何检测数组变化
### Vue是如何检测数组的变化
- 核心思想：使用了函数劫持的方式，重写了数组的方法（push,pop,unshift,shift···）
- Vue将data中的数组，进行了原型链的重写，指向了自己所定义的数组原型方法，当调用数组的API时，可以通知依赖更新，如果数组中包含着引用类型，会对数组中的引用类型再次进行监控
### vue能监听到数组变化的方法有哪些？为什么这些方法能监听到呢？
Vue.js观察数组变化主要通过以下7个方法（push、pop、shift、unshift、splice、sort、reverse）
大家知道，通过Object.defineProperty()劫持数组为其设置getter和setter后，调用的数组的push、splice、pop等方法改变数组元素时并不会触发数组的setter，继而数组的数据变化并不是响应式的，但是vue实际开发中却是实时响应的，是因为vue重写了数组的push、splice、pop等方法
从源码中可以看出，ob.dep.notify()将当前数组的变更通知给其订阅者，这样当使用重写后方法改变数组后，数组订阅者会将这边变化更新到页面中

Vue2.x中并没有实现将已存在的数组元素做监听，而是去监听造成数组变化的方法，触发这个方法的同时去调用挂载好的响应页面方法，达到页面响应式的效果
作者尤雨溪的考虑是因为性能原因，给每一个数组元素绑定上监听，实际消耗很大，而受益并不大

### 4. 为何Vue采用异步渲染 nextTick
在Vue中异步渲染实际在数据每次变化时，将其所要引起页面变化的部分都放到一个异步API的回调函数里，直到同步代码执行完之后，异步回调开始执行，最终将同步代码里所有的需要渲染变化的部分合并起来，最终执行一次渲染操作


### 5. nextTick实现原理
### nextTick实现原理是什么？ 在Vue中有什么作用
```js
if (typeof Promise !== 'undefined') {

} else if (!isIE && typeof MutationObserver !== 'undefined') {

} else if (typeof setImmediate !== 'undefined') {

} else {
  setTimeout()
}
```
- 原理：EventLoop事件循环
- 作用：在下次dom更新循环结束后执行延迟回调，当我们修改数据之后立即使用nextTick()来获取最新更新的Dom

### 6. Vue组件的生命周期

### 7. ajax请求放在哪个生命周期中
首先，一个组件的 created 比 mounted 也早调用不了几微秒，性能没啥提高；
而且，等到异步渲染开启的时候，created 就可能被中途打断，中断之后渲染又要重做一遍，想一想，在 created 中做ajax调用，代码里看到只有调用一次，但是实际上可能调用 N 多次，这明显不合适。
相反，若把发ajax 放在 mounted，因为 mounted 在第二阶段，所以绝对不会多次重复调用，这才是ajax合适的位置

### 8. 父子组件生命周期调用顺序

### 9. Watch中的deep: true是如何实现的
### watch中的deep:true是如何实现的
当用户指定了watch中的deep:true时，如果当前监控的值是数组类型（对象类型），会对对象中的每一项进行求值，此时会将当前watcher存入到对应属性的依赖中，这样数组中的对象发生变化也会通知数据进行更新

### 10. Vue中事件绑定原理
1.用来劫持并监听所有属性，如果有变动的，就通知订阅者。
2.可以收到属性的变化通知并执行相应的函数，从而更新视图。
3.可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器

### 11. 为什么v-if与v-for不建议连在一起使用
- v-for优先级高于v-if，如果连在一起使用的话会把v-if给每一个元素都添加上，重复运行于每一个v-for循环中，会造成性能浪费

### 12. v-modal中的实现原理及如何自定义v-modal

### 13. Vue组件如何通讯

### 14. 什么是作用域插槽？
把父组件的数据扔到子组件里面展示，复用组件

### 16. 简述Vue中diff算法原理 snabbdom
vdom - 用js模拟DOM结构，计算出最小的变更，再操作DOM 
       h vnode patch diff key 
    存在价值： 数据驱动视图，控制DOM操作

### 17. 描述组件渲染和更新过程
1、vue 组件初次渲染过程
解析模板为 render 函数
触发响应式，监听 data 属性的 getter 和 setter
执行 render 函数， 生成 vnode，patch(elem,vnode)

2、vue 组件更新过程
修改 data， 触发 setter （此前在getter中已被监听）
重新执行 render 函数，生成 newVnode
patch(vnode, newVnode) //对比新旧结点
### Vue渲染过程
1. 把template模板编译为render函数
2. 实例进行挂载, 根据根节点render函数的调用，递归的生成虚拟dom
3. 通过patch方法对比虚拟dom，渲染到真实dom
4. 组件内部data发生变化，组件和子组件引用data作为props重新调用render函数，生成虚拟dom, 返回到步骤3

### 18. Vue中模板编译原理
第一步将模版字符串转换成element ASTs(解析器)
第二步是对AST进行静态节点标记，主要用来做虚拟DOM的渲染优化(优化器)
第三步是使用element ASTs生成render函数代码字符串(代码生成器)

解析器（parser），优化器（optimizer）和代码生成器（code generator）。
解析器（parser）的作用是将 模板字符串 转换成 element ASTs。
优化器（optimizer）的作用是找出那些静态节点和静态根节点并打上标记。
代码生成器（code generator）的作用是使用 element ASTs 生成 render函数代码（generate render function code from element ASTs）。

### 19. Vue中常见的性能优化

### Proxy相比于defineProperty的优势 
Object.defineProperty() 的问题主要有三个：
- 必须遍历对象的每个属性
- 必须深层遍历嵌套的对象
- 无法监听直接新增、删除的属性
- 无法监听原生数组

Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
- 针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题
- 支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。
- 
除了上述两点之外，Proxy 还拥有以下优势：
- Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
- Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法

Proxy 不能监听嵌套数据 



### MVVM和MVC的区别
1. MVC中的Control在MVVM中演变成viewModel
2. MVVM通过数据来显示视图，而不是通过节点操作
3. MVVM主要解决了MVC中大量的DOM操作，使页面渲染性能降低，加载速度慢，影响用户体验的问题

### Vue响应式的原理
Vue通过数据劫持配合发布者-订阅者的设计模式，内部通过调用object.defineProperty()来劫持各个属性的getter和setter，在数据变化的时候通知订阅者，并触发相应的回调

### Vue是如何实现数据双向绑定的
- 实现一个监听器「Observer」：对数据对象进行遍历，包括子属性对象的属性，利用Object.defineProperty()在属性上都加上getter和setter，这样后，给对象的某个值赋值，就会触发setter，那么就能监听到数据变化
- 实现一个解析器「Compile」：解析Vue模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新
- 实现一个订阅者「Watcher」：Watcher订阅者是Observer和Compile之间通信的桥梁，主要任务是订阅Observer中的属性值变化的消息，当收到属性值变化的消息时，触发解析器Compile中对应的更新函数
- 实现一个订阅器「Dep」：订阅器采用发布-订阅设计模式，用来收集订阅者Watcher，对监听器Observer和订阅者Watcher进行统一管理


### computed / watch 的区别是什么
- computed是依赖于其他属性的一个计算值，并且具备缓存，只有当依赖的值发生变化才会更新（自动监听依赖值的变化，从而动态返回内容）
- watch是在监听的属性发生变化的时候，触发一个回调，在回调中执行一些逻辑
- computed和watch区别在于用法上的不同，computed适合在模板渲染中，如果是需要通过依赖来获取动态值，就可以使用计算属性。而如果是想在监听值变化时执行业务逻辑，就使用watch

### computed / methods 的区别是什么
- computed是基于它们响应式依赖进行缓存，只有在依赖值发生变化，才会进行计算求值
- methods每次使用都会执行相应的方法

### vue 响应式
1. 数组
  > 通过索引的方式更改数组
  > 更改长度
2. 对象
  > 增删 对象

- 数组变异方法： 
  1. 7个，push、pop、shift、unshift、splice、sort、reverse
  2. vm.$set()

### Vue如何通过vm.$set()来解决对象/数组新增/删除属性不能响应的问题
### vm.$set()实现原理是什么
1. 如果目标是数组,使用 vue 实现的变异方法 splice 实现响应式
2. 如果目标是对象,判断属性存在,即为响应式,直接赋值
3. 如果 target 本身就不是响应式,直接赋值
4. 如果属性不是响应式,则调用 defineReactive 方法进行响应式处理
```javascript
export function set(target, key, val) {  
  // target 为数组  
  if (Array.isArray(target) && isValidArrayIndex(key)) {    
    // 修改数组的长度, 避免索引>数组长度导致splice()执行有误    
    target.length = Math.max(target.length, key);    
    // 利用数组的splice变异方法触发响应式    
    target.splice(key, 1, val);    
    return val;  
  }  
  // target为对象, key在target或者target.prototype上 且必须不能在 Object.prototype 上,直接赋值  
  if (key in target && !(key in Object.prototype)) {    
    target[key] = val;    
    return val; 
  }
  // 以上都不成立, 即开始给target创建一个全新的属性  
  // 获取Observer实例
  const ob = (target: any).__ob__; 
  // target 本身就不是响应式数据, 直接赋值  
  if (!ob) {    
    target[key] = val;    
    return val;  
  }  
  // 进行响应式处理  
  defineReactive(ob.value, key, val);  
  ob.dep.notify();  
  return val;
}
```

### 页面中定义了一个定时器，在哪个阶段清除
1. 在beforeDestroy中销毁定时器
2. 可以通过$once这个时间监听清除
```javascript
moundted() {
  const timer = setInterval(() => {
    console.log(1)
  }, 1000)
  this.$once('hook:beforeDestory', () => {
    clearInterval(timer)
  })
}
```

### 父组件如何获取子组件的数据
1. $children
```javascript
moundted() {
  console.log(this.$children)
}
```
2. $refs

### 子组件如何获取父组件的数据，父子组件如何传值
1. props
2. $parent
 - this.$parent.属性
 - this.$parent.方法
3. provide / inject
4. $emit
5. $root
6. $listeners
7. eventBus（事件总线）
```js
Vue.prototype.$bus = new Vue();
// ...
// this.$bus.$on()
```

### vue组件通讯
- 父子
 - props
 - $refs
 - $children
- 子父
 - $emit
 - @xx
- 兄弟
 - $parent
 - $root
- 祖代后代
 - provide / inject
- 没关系
 - $bus
 - vuex

### 自定义指令如何定义，它的生命周期是什么
- Vue.directive()定义全局指令
- 有几个可用的钩子（生命周期）, 每个钩子可以选择一些参数. 钩子如下:
  - 1. bind: 一旦指令附加到元素时触发
  - 2. inserted: 一旦元素被添加到父元素时触发
  - 3. update: 每当元素本身更新(但是子元素还未更新)时触发
  - 4. componentUpdate: 每当组件和子组件被更新时触发
  - 5. unbind: 一旦指令被移除时触发。

### watch 和 computed的区别？
- computed：
  1. 有缓存机制；
  2. 不能接受参数；
  3. 可以依赖其他computed，甚至是其他组件的data；
  4. 不能与data中的属性重复

- watch：
 1. 可接受两个参数；
 2. 监听时可触发一个回调，并做一些事情；
 3. 监听的属性必须是存在的；
 4. 允许异步
 - watch配置：handler、deep（是否深度）、immeditate （是否立即执行）
```js
// watch
'obj.name': {},
obj: {
  function xx() {},
  deep: true
}
```

- 总结：
 - 当有一些数据需要随着另外一些数据变化时，建议使用computed
 - 当有一个通用的响应数据变化的时候，要执行一些业务逻辑或异步操作的时候建议使用watch


### vue 如何去优化首页的加载速度？首页白屏是什么问题引起的？如何解决？
 - SplitChunksPlugin 公共脚本分离
 - Tree-shaking
 - scope hosting - 代码分割
 - 路由懒加载
 - 骨架屏优化
 - ui组件按需加载
 - 图片压缩-雪碧图
 - 要兼容低版本浏览器可以动态 Polyfill

- 预渲染 prefetch...

### 为什么mutations不能提交异步代码
- 因为调试（devtools）的时候难以追踪状态的变化

### action和mutations的区别
- action提交的是mutation,而不是直接变更状态
- action可以包含任意异步操作
- dispatch -> action
- commit -> mutations
- action可以整合多个mutation

### Vuex
```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, n) {
      state.count++
    }
  }
})

this.$store.commit('increment', 10) // 更改  commit -> mutations 
this.$store.commit({
  type: 'increment',
  number: 10,
})
console.log(this.$store.state.count) // 触发
```
组件注册：
Vue.component('my-component', {
  template: '<p>全局注册的组件</p>'
})
两种命名规则：my-component  MyComponent

加载异步组件，动态import
动态组件： :is
vue实现深度监听：遍历对象（递归） ->  通过Object.defineProperty()


2. 描述 Vue 响应式原理中的 Vue 类、Observer 类、Dep 类、Watcher 类、Compiler 类。

4. Snabbdom 的使用流程

5. Snabbdom 的核心介绍

vue3比vue2的优势 性能好，体积小，更好的ts支持

vue3生命周期：
  options API  小型项目，业务逻辑简单
  延用vue2的周期，其中beforeDestroy改为beforeUnmount,destroyed改为unmounted 
  composition API 中大型项目 逻辑复杂
  onBeforeMount onMounted onBeforeUpdate onUpdated onBeforeUnmount onUnmouted
  对比
  composition API 有更好的 代码组织 逻辑复用 类型推导
                  抽离逻辑代码到一个函数  函数命名约定为use开头

如何理解 ref toRef toRefs
  ref 生成值类型的响应式数据  可用于模板和reactive  .value修改值
  toRef 针对响应式(reactive)对象的prop  用于reactive   toRef(props, 'title')默认值title
  toRefs 将响应式对象转换为普通对象

watch 和 watchEffect的区别
  watchEffect初始化会执行一次
  watch需要明确监听哪个属性
  watchEffect会根据其中的属性，自动监听变化

composition API 和 React Hooks对比
  composition API setup 只会被调用一次 Hooks函数可以被调用多次
  composition API不用考虑调用顺序
  reactive + ref比useState难理解

Vue 中的 computed 是如何实现的
是⼀个惰性的watcher，在取值操作时根据⾃⾝标记 dirty属性返回上⼀次计算结果/重新计算值 在创建时就进⾏⼀次取值操作，收集依赖变动的对象/属性(将⾃⾝压⼊dep中) 在依赖的对象/属性变动 时，仅将⾃⾝标记dirty致为true

### vue3 setup(props, context)
```js
// Props响应式数据  context普通js对象，暴露setup中有用的值：{ attrs, slots, emit, expose } 

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// 在我们的组件中
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }
  onMounted(getUserRepositories) // 在 `mounted` 时调用 `getUserRepositories`
  return {
    repositories,
    getUserRepositories
  }
}
```

### vue3 watch 
```js
import { ref, watch } from 'vue'
const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})

// 应用
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// 在我们组件中
setup (props) {
  // 使用 `toRefs` 创建对 `props` 中的 `user` property 的响应式引用
  const { user } = toRefs(props)
  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新 `prop.user` 到 `user.value` 访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }
  onMounted(getUserRepositories)
  // 在 user prop 的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)
  return {
    repositories,
    getUserRepositories
  }
}
```

### vue3  computed
```js
const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })
```

### vue3 provide(name<string>, value)  inject(name, value) // value是默认值
```js
import { provide } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}

// src/components/MyMarker.vue 
import { inject } from 'vue'
export default {
  setup() {
    const userLocation = inject('location', 'The Universe') // 默认值The Universe
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}

// 响应式
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
    // 这俩响应式数据更改，MyMarker 组件也将自动更新
  }
}
```

### vue3 Teleport


### vue3 父子组件传值
- 1. props
```vue
<!-- 组合式API -->
<!-- //父组件  -->
<template>
  <div>
    <Child :msg="parentMsg" />
  </div>
</template>
<script>
import { ref,defineComponent } from 'vue'
import Child from './Child.vue'
export default defineComponent({
  components:{
    Child
  },
  setup() {
    const parentMsg = ref('父组件信息')
    return {
      parentMsg
    };
  },
});
</script>

//子组件
<template>
    <div>
        {{ parentMsg }}
    </div>
</template>
<script>
import { defineComponent,toRef } from "vue";
export default defineComponent({
    props: ["msg"],// 如果这行不写，下面就接收不到
    setup(props) {
        console.log(props.msg) //父组件信息
        let parentMsg = toRef(props, 'msg')
        return {
            parentMsg
        };
    },
});
</script>
```

```vue
<!-- setup语法糖 -->
//父组件
<template>
  <div>
    <Child :msg="parentMsg" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const parentMsg = ref('父组件信息')
</script>

//子组件
<template>
    <div>
        {{ parentMsg }}
    </div>
</template>
<script setup>
import { toRef, defineProps } from "vue";
const props = defineProps(["msg"]);
console.log(props.msg) //父组件信息
let parentMsg = toRef(props, 'msg')
</script>
```
> props中数据流是单项的，即子组件不可改变父组件传来的值
> 在组合式API中，如果想在子组件中用其它变量接收props的值时需要使用toRef将props中的属性转为响应式

- 2. emit
```vue
<!-- 组合式API -->
<!-- 父组件 -->
<template>
  <div>
    <Child @sendMsg="getFromChild" />
  </div>
</template>
<script>
import Child from './Child'
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    Child
  },
  setup() {
    const getFromChild = (val) => {
      console.log(val) //我是子组件数据
    }
    return {
      getFromChild
    };
  },
});
</script>

//子组件
<template>
  <div>
    <button @click="sendFun">send</button>
  </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  emits: ['sendMsg'],
  setup(props, ctx) {
    const sendFun = () => {
      ctx.emit('sendMsg', '我是子组件数据')
    }
    return {
      sendFun
    };
  },
});
</script>
```
```vue
<!-- setup语法糖 -->
//父组件
<template>
  <div>
    <Child @sendMsg="getFromChild" />
  </div>
</template>
<script setup>
import Child from './Child'
const getFromChild = (val) => {
      console.log(val) //我是子组件数据
    }
</script>

//子组件
<template>
    <div>
        <button @click="sendFun">send</button>
    </div>
</template>
<script setup>
import { defineEmits } from "vue";
const emits = defineEmits(['sendMsg'])
const sendFun = () => {
    emits('sendMsg', '我是子组件数据')
}
</script>
```

- 3. attrs
```vue
<!-- 组合式API -->
//父组件
<template>
  <div>
    <Child @parentFun="parentFun" :msg1="msg1" :msg2="msg2" />
  </div>
</template>
<script>
import Child from './Child'
import { defineComponent,ref } from "vue";
export default defineComponent({
  components: {
    Child
  },
  setup() {
    const msg1 = ref('子组件msg1')
    const msg2 = ref('子组件msg2')
    const parentFun = (val) => {
      console.log(`父组件方法被调用,获得子组件传值：${val}`)
    }
    return {
      parentFun,
      msg1,
      msg2
    };
  },
});
</script>

//子组件
<template>
    <div>
        <button @click="getParentFun">调用父组件方法</button>
    </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
    emits: ['sendMsg'],
    setup(props, ctx) {
        //获取父组件方法和事件
        console.log(ctx.attrs) //Proxy {"msg1": "子组件msg1","msg2": "子组件msg2"}
        const getParentFun = () => {
            //调用父组件方法
            ctx.attrs.onParentFun('我是子组件数据')
        }
        return {
            getParentFun
        };
    },
});
</script>

<!-- setup语法糖 -->
//父组件
<template>
  <div>
    <Child @parentFun="parentFun" :msg1="msg1" :msg2="msg2" />
  </div>
</template>
<script setup>
import Child from './Child'
import { ref } from "vue";
const msg1 = ref('子组件msg1')
const msg2 = ref('子组件msg2')
const parentFun = (val) => {
  console.log(`父组件方法被调用,获得子组件传值：${val}`)
}
</script>

//子组件
<template>
    <div>
        <button @click="getParentFun">调用父组件方法</button>
    </div>
</template>
<script setup>
import { useAttrs } from "vue";

const attrs = useAttrs()
//获取父组件方法和事件
console.log(attrs) //Proxy {"msg1": "子组件msg1","msg2": "子组件msg2"}
const getParentFun = () => {
    //调用父组件方法
    attrs.onParentFun('我是子组件数据')
}
</script>
```
> Vue3中使用attrs调用父组件方法时，方法前需要加上on；如parentFun->onParentFun

- 4. provide/inject
```vue
//父组件
<script>
import Child from './Child'
import { ref, defineComponent,provide } from "vue";
export default defineComponent({
  components:{
    Child
  },
  setup() {
    const msg1 = ref('子组件msg1')
    const msg2 = ref('子组件msg2')
    provide("msg1", msg1)
    provide("msg2", msg2)
    return {
      
    }
  },
});
</script>

//子组件
<template>
    <div>
        <button @click="getParentFun">调用父组件方法</button>
    </div>
</template>
<script>
import { inject, defineComponent } from "vue";
export default defineComponent({
    setup() {
        console.log(inject('msg1').value) //子组件msg1
        console.log(inject('msg2').value) //子组件msg2
    },
});
</script>


//父组件
<script setup>
import Child from './Child'
import { ref,provide } from "vue";
const msg1 = ref('子组件msg1')
const msg2 = ref('子组件msg2')
provide("msg1",msg1)
provide("msg2",msg2)
</script>

//子组件

<script setup>
import { inject } from "vue";
console.log(inject('msg1').value) //子组件msg1
console.log(inject('msg2').value) //子组件msg2
</script>
```
> provide/inject一般在深层组件嵌套中使用合适。一般在组件开发中用的居多。

- 5. expose&ref
```vue
//父组件
<template>
  <div>
    <Child ref="child" />
  </div>
</template>
<script>
import Child from './Child'
import { ref, defineComponent, onMounted } from "vue";
export default defineComponent({
  components: {
    Child
  },
  setup() {
    const child = ref() //注意命名需要和template中ref对应
    onMounted(() => {
      //获取子组件属性
      console.log(child.value.msg) //子组件元素

      //调用子组件方法
      child.value.childFun('父组件信息')
    })
    return {
      child //必须return出去 否则获取不到实例
    }
  },
});
</script>

//子组件
<template>
    <div>
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
    setup() {
        const msg = ref('子组件元素')
        const childFun = (val) => {
            console.log(`子组件方法被调用,值${val}`)
        }
        return {
            msg,
            childFun
        }
    },
});
</script>

<!-- setup语法糖 -->
//父组件
<template>
  <div>
    <Child ref="child" />
  </div>
</template>
<script setup>
import Child from './Child'
import { ref, onMounted } from "vue";
const child = ref() //注意命名需要和template中ref对应
onMounted(() => {
  //获取子组件属性
  console.log(child.value.msg) //子组件元素

  //调用子组件方法
  child.value.childFun('父组件信息')
})
</script>

//子组件

<template>
    <div>
    </div>
</template>
<script setup>
import { ref,defineExpose } from "vue";
const msg = ref('子组件元素')
const childFun = (val) => {
    console.log(`子组件方法被调用,值${val}`)
}
//必须暴露出去父组件才会获取到
defineExpose({
    childFun,
    msg
})
</script>

```
