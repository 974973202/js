## React 从Mixin到HOC再到Hook
### MiXin
- MiXin带来的危害
1. Mixin 可能会相互依赖，相互耦合，不利于代码维护
2. 不同的Mixin中的方法可能会相互冲突
3. Mixin非常多时，组件是可以感知到的，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性

- 装饰模式：能够在不改变对象自身的基础上，在程序运行期间给对像动态的添加职责。与继承相比，装饰者是一种更轻便灵活的做法

### 高阶组件（HOC）
- 高阶组件可以看作React对装饰模式的一种实现，高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件
- 作用
1. 日志大点数据上报
2. 权限控制
3. 表单校验
- redux中的connect，其实就是一个HOC
- 解决的问题：
1. 各个高阶组件不会互相依赖耦合
2. 高阶组件也有可能造成冲突，但我们可以在遵守约定的情况下避免这些行为
3. 高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。高阶组件的增加不会为原组件增加负担
- 缺陷
1. HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生非常多的嵌套，这让调试变得非常困难。
2. HOC可以劫持props，在不遵守约定的情况下也可能造成冲突

### Hooks
- 它可以让你在class以外使用state和其他React特性

### getDerivedStateFromProps配合componentDidUpdate使用
```js 
static getDerivedStateFromProps(nextProps, prevState) {
  const {
    params: {
      id = null
    },
  } = nextProps;
  if(id !== prevState.ids) {
    return {
      ids: id,
    }
  }
}
// ...
componentDidUpdate(nextProps) {
  const {
    params: {
      id = null
    },
  } = this.props;
  if(id !== nextProps.params.id) {
    // ajax请求
  }
}
```