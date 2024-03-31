## react运行时 Vue编译时  运行时和编译时的区别


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

### react属性验证
- 属性默认值 和 类型检查

1. 属性默认值

通过一个静态属性```defaultProps```告知react属性默认值

2. 属性类型检查

使用库：```prop-types```

对组件使用静态属性```propTypes```告知react如何检查属性

```js
PropTypes.any：//任意类型
PropTypes.array：//数组类型
PropTypes.bool：//布尔类型
PropTypes.func：//函数类型
PropTypes.number：//数字类型
PropTypes.object：//对象类型
PropTypes.string：//字符串类型
PropTypes.symbol：//符号类型

PropTypes.node：//任何可以被渲染的内容，字符串、数字、React元素
PropTypes.element：//react元素
PropTypes.elementType：//react元素类型
PropTypes.instanceOf(构造函数)：//必须是指定构造函数的实例
PropTypes.oneOf([xxx, xxx])：//枚举
PropTypes.oneOfType([xxx, xxx]);  //属性类型必须是数组中的其中一个
PropTypes.arrayOf(PropTypes.XXX)：//必须是某一类型组成的数组
PropTypes.objectOf(PropTypes.XXX)：//对象由某一类型的值组成
PropTypes.shape(对象): //属性必须是对象，并且满足指定的对象要求
PropTypes.exact({...})：//对象必须精确匹配传递的数据

//自定义属性检查，如果有错误，返回错误对象即可
属性: function(props, propName, componentName) {
   //...
}
```


```js
// 引入 src/components/Button/index.js
import Button from './button'
export default Button 

// src/index
export { default as Button } from './components/Button'
export { default as Button } from './components/Button'
export { default as Button } from './components/Button'
```

### redux和vuex原理对比
Redux和Vuex都是用于管理应用程序状态的JavaScript库，但它们的原理和设计有一些区别。

Redux的原理是基于Flux架构的，它包含三个核心概念：store、action和reducer。Store是应用程序的状态存储，其中包含了所有的数据。Action是一个包含描述应用程序状态变化的信息的对象，通过dispatch方法触发。Reducer是一个纯函数，根据当前的状态和接收到的action来计算新的状态。Redux使用单一的store来管理整个应用程序的状态，通过使用纯函数来修改状态，保证了状态的可预测性和可维护性。

Vuex的原理是基于Flux和Vue.js的响应式系统的，它也包含三个核心概念：state、mutation和action。State是应用程序的状态存储，类似于Redux中的store。Mutation是一个包含描述状态变化的方法的对象，通过commit方法触发。Action是一个包含描述异步操作和提交mutation的方法的对象，通过dispatch方法触发。Vuex使用Vue.js的响应式系统来实现状态的自动更新，通过mutation来修改状态，保证了状态的一致性和可维护性。

总结来说，Redux和Vuex都是用于管理应用程序状态的库，但Redux更加简单和可预测，适用于大型应用程序；而Vuex更加灵活和便捷，适用于Vue.js应用程序。