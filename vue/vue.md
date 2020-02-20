[vue组件的生命周期]https://www.cnblogs.com/webbest/p/6722780.html

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