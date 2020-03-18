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

### Vue渲染过程
1. 把template模板编译为render函数
2. 实例进行挂载, 根据根节点render函数的调用，递归的生成虚拟dom
3. 对比虚拟dom，渲染到真实dom
4. 组件内部data发生变化，组件和子组件引用data作为props重新调用render函数，生成虚拟dom, 返回到步骤3

### MVVM和MVC的区别
1. MVC中的Control在MVVM中演变成viewModel
2. MVVM通过数据来显示视图，而不是通过节点操作
3. MVVM主要解决了MVC中大量的DOM操作，使页面渲染性能降低，加载速度慢，影响用户体验的问题

### Vue响应式数据的原理
Vue通过数据劫持配合发布者-订阅者的设计模式，内部通过调用object.defineProperty()来劫持各个属性的getter和setter，在数据变化的时候通知订阅者，并触发相应的回调

### Vue是如何实现数据双向绑定的
- 实现一个监听器「Observer」：对数据对象进行遍历，包括子属性对象的属性，利用Object.defineProperty()在属性上都加上getter和setter，这样后，给对象的某个值赋值，就会触发setter，那么就能监听到数据变化
- 实现一个解析器「Compile」：解析Vue模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新
- 实现一个订阅者「Watcher」：Watcher订阅者是Observer和Compile之间通信的桥梁，主要任务是订阅Observer中的属性值变化的消息，当收到属性值变化的消息时，触发解析器Compile中对应的更新函数
- 实现一个订阅器「Dep」：订阅器采用发布-订阅设计模式，用来收集订阅者Watcher，对监听器Observer和订阅者Watcher进行统一管理

### Vue是如何检测数组的变化
- 核心思想：使用了函数劫持的方式，重写了数组的方法（push,pop,unshift,shift···）
- Vue将data中的数组，进行了原型链的重写，指向了自己所定义的数组原型方法，当调用数组的API时，可以通知依赖更新，如果数组中包含着引用类型，会对数组中的引用类型再次进行监控

### Vue如何通过vm.$set()来解决对象新增/删除属性不能响应的问题

### nextTick实现原理是什么？ 在Vue中有什么作用
- 原理：EventLoop事件循环
- 作用：在下次dom更新循环结束后执行延迟回调，当我们修改数据之后立即使用nextTick()来获取最新更新的Dom

### watch中的deep:true是如何实现的
当用户指定了watch中的deep:true时，如果当前监控的值是数组类型（对象类型），会对对象中的每一项进行求值，此时会将当前watcher存入到对应属性的依赖中，这样数组中的对象发生变化也会通知数据进行更新

### 为什么v-if与v-for不建议连在一起使用
- v-for优先级高于v-if，如果连在一起使用的话会把v-if给每一个元素都添加上，重复运行于每一个v-for循环中，会造成性能浪费

### computed / watch 的区别是什么
- computed是依赖于其他属性的一个计算值，并且具备缓存，只有当依赖的值发生变化才会更新（自动监听依赖值的变化，从而动态返回内容）
- watch是在监听的属性发生变化的时候，触发一个回调，在回调中执行一些逻辑
- computed和watch区别在于用法上的不同，computed适合在模板渲染中，如果是需要通过依赖来获取动态值，就可以使用计算属性。而如果是想在监听值变化时执行业务逻辑，就使用watch

### computed / methods 的区别是什么
- computed是基于它们响应式依赖进行缓存，只有在依赖值发生变化，才会进行计算求值
- methods每次使用都会执行相应的方法

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

### vm.$set()实现原理是什么
1. 如果目标是数组,使用 vue 实现的变异方法 splice 实现响应式
2. 如果目标是对象,判断属性存在,即为响应式,直接赋值
3. 如果 target 本身就不是响应式,直接赋值
4. 如果属性不是响应式,则调用 defineReactive 方法进行响应式处理
```javascript
export function set(target: Array<any> | Object, key: any, val: any): any {  
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
