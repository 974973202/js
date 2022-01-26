### 如何使用 react hooks 实现一个计数器的组件
```
  function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {
      const timer = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }, [])

    return <h1>{count}</h1>
  }
```

### React.Fiber 原理
- [React.Fiber原理]https://www.youtube.com/watch?v=ZCuYPiUIONs

### react和vue的区别  
1.设计思想
    vue的官网中说它是一款渐进式框架，采用自底向上增量开发的设计。
    
    react主张函数式编程，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以手动实现，
    比如借助 onChange 和 setState 来实现一个双向的数据流。
2.编写语法
    Vue推荐的做法是webpack+vue-loader的单文件组件格式，vue保留了html、css、js分离的写法
    
    React的开发者可能知道，react是没有模板的，直接就是一个渲染函数，它中间返回的就是一个虚拟DOM树，
    React推荐的做法是  JSX + inline style, 也就是把HTML和CSS全都写进JavaScript了,即'all in  js'。
3.构建工具
    vue提供了CLI 脚手架，可以帮助你非常容易地构建项目。
    
    React 在这方面也提供了 create-react-app，但是现在还存在一些局限性，不能配置等等
4.数据绑定
    vue是实现了双向数据绑定的mvvm框架，当视图改变更新模型层，当模型层改变更新视图层。
    在vue中，使用了双向绑定技术，就是View的变化能实时让Model发生变化，而Model的变化也能实时更新到View。
    (这里我们可以继续深入讲解一下双向数据绑定的原理，我之前的文章手写Vue源码可参考)
    
    react是单向数据流，react中属性是不允许更改的，状态是允许更改的。
    react中组件不允许通过this.state这种方式直接更改组件的状态。自身设置的状态，可以通过setState来进行更改。
    (注意：React中setState是异步的，导致获取dom可能拿的还是之前的内容，
    所以我们需要在setState第二个参数（回调函数）中获取更新后的新的内容。)
    
    【这里如果你了解深入的话可以尝试描述一下React中setState的异步操作是怎么实现的，Vue中的更新是通过微任务等】
5.diff算法
  vue中diff算法实现流程：
      1.在内存中构建虚拟dom树
      2.将内存中虚拟dom树渲染成真实dom结构
      3.数据改变的时候，将之前的虚拟dom树结合新的数据生成新的虚拟dom树
      4.将此次生成好的虚拟dom树和上一次的虚拟dom树进行一次比对(diff算法进行比对)，来更新只需要被替换的DOM，
      而不是全部重绘。在Diff算法中，只平层的比较前后两棵DOM树的节点，没有进行深度的遍历。
      5.会将对比出来的差异进行重新渲染
      
  react中diff算法实现流程:
      DOM结构发生改变-----直接卸载并重新create
      DOM结构一样-----不会卸载,但是会update变化的内容
      所有同一层级的子节点.他们都可以通过key来区分-----同时遵循1.2两点
      (其实这个key的存在与否只会影响diff算法的复杂度,换言之,你不加key的情况下,
      diff算法就会以暴力的方式去根据一二的策略更新,但是你加了key,diff算法会引入一些另外的操作)

### 1. 什么是 Hooks
可以在不编写 class 的情况下使用 state 以及其他的 React 特性

### 1. React 中 keys 的作用是什么
- Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识

### 2. react diff 原理
- 把树形结构按照层级分解，只比较同级元素。
- 给列表结构的每个单元添加唯一的 key 属性，方便比较。
- React 只会匹配相同 class 的 component（这里面的 class 指的是组件的名字）
- 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.
- 选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能

### 3. 调用 super(props) 的目的是什么
- 传递 props 给 super() 的原因则是便于(在子类中)能在 constructor 访问 this.props

### 4. createElement 和 cloneElement 有什么区别？
- React.createElement():JSX 语法就是用 React.createElement()来构建 React 元素的。它接受三个参数，第一个参数可以是一个标签名。如 div、span，或者 React 组件。第二个参数为传入的属性。第三个以及之后的参数，皆作为组件的子组件。
```js
  React.createElement(
    type,
    [props],
    [...children]
  )

  <div id="box" key="index">555</div>
  React.createElement('div', { id: "box", key: "index" }, '555')
  jsx -> createElement -> ReactElement
```
- React.cloneElement()与 React.createElement()相似，不同的是它传入的第一个参数是一个 React 元素，而不是标签名或组件。新添加的属性会并入原有的属性，传入到返回的新元素中，而就的子元素奖杯替换。
```js
  React.cloneElement(
    element,
    [props],
    [...children]
  )
```

### 5. setState什么时候同步什么时候异步
- React控制之外的事件中调用setState是同步更新的。比如原生js绑定的事件，setTimeout/setInterval等。
- 所以就能理解大部分开发中用到的都是React封装的事件，比如onChange、onClick、onTouchMove等，这些事件处理程序中的setState都是异步处理的

在 合成事件 和 生命周期钩子(除 componentDidUpdate) 中，setState是"异步"的
在 原生事件 和 setTimeout 中，setState是同步的，可以马上获取更新后的值

### 6. React是怎样控制异步和同步的呢？
在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中延时更新，而 isBatchingUpdates 默认是 false，表示 setState 会同步更新 this.state；但是，有一个函数 batchedUpdates，该函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会先调用这个 batchedUpdates将isBatchingUpdates修改为true，这样由 React 控制的事件处理过程 setState 不会同步更新 this.state

batchedUpdates

### react生命周期
01 constructor
02 render
03 componentDidMount

### 7.父子组件传值
1 props
2 createContext()  privider
3 ref

按需加载
lazy Suspense

ReactDOM.createPortal 创建根节点外的弹窗

### Fiber架构
两个阶段 调度阶段，提交阶段

调度阶段：调度帧
```js
// 调度阶段
componentWillMount
componentWillReceiveProps
shouldComponentUpdata
componentWillUpdate
// 提交阶段
componentDidMount
componentDidUpdate
componentWillUnmount
```
提交阶段：


JSX本质：语法糖，通过createElement(h函数)生成vnode

合成事件机制
  react 16绑定到document
  react 17绑定到root
