[vue组件的生命周期]https://www.cnblogs.com/webbest/p/6722780.html

### vue父子组件的生命周期顺序
1. 加载渲染过程
> 父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted
2. 子组件更新过程
> 父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated
3. 父组件更新过程
> 父beforeUpdate -> 父updated
4. 销毁过程
> 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

### $emit $on

### directive