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

### 2.vue 虚拟DOM和react 虚拟DOM的区别 
VUE在渲染过程中，会跟踪每⼀个组件的依赖关系，不需要重新渲染整个组件树。
⽽对于React⽽⾔，每当 应⽤的状态被改变时，全部⼦组件都会重新渲染。 在 React 应⽤中，当某个组件的状态发⽣变化时， 它会以该组件为根，重新渲染整个组件⼦树。 如要避免不必要的⼦组件的重新渲染，你需要在所有可 能的地⽅使⽤ PureComponent，或是⼿动实现shouldComponentUpdate ⽅法 在React中，数据流是⾃上⽽下单向的从⽗节点传递到⼦节点，所以组件是简单且容易把握的，⼦组件 只需要从⽗节点提供的props中获取数据并渲染即可。如果顶层组件的某个prop改变了，React会递归 地向下遍历整棵组件树，重新渲染所有使⽤这个属性的组件。

### 1. 什么是 Hooks
可以在不编写 class 的情况下使用 state 以及其他的 React 特性

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

### react-dom-render
1. 创建ReactRoot
2. 创建FiberRoot和RootFiber
3. 创建更新

### react源码使用数据结构
scheduler：小顶堆
调度：messageChannel通信
render阶段的reconciler中：fiber、update、链表
diff算法：dfs（深度优先遍历）
lane模型：二进制掩码（”用一串二进制数字（掩码）去操作另一串二进制数字“的意思。）

### react分为几个模块
1. scheduler（调度器）：排列优先级，优先级高的先执行reconciler
2. reconciler（协调器）：render阶段（主要工作：构建Fiber树和生成effectList），找哪个节点改变，打不同的tag（形成effectlist链表，记录需要更新的节点），创建或更新fiber节点（diff算法），采用深度优先遍历
3. renderer（渲染器）：commit阶段，将reconciler打好标签的节点（主要遍历effectList），渲染到视图scheduler、reconciler在内存中进行，不影响真实节点
- react 17版本的出现，带来了全新的concurrent mode，包含一类功能的合集（fiber、scheduler、lane、suspense），核心是实现了一套，异步可中断，带优先级的更新
- $$typeof表示的是组件的类型
- jsx对象上没有优先级、状态、effectTag等标记，fiber对象上有

### scheduler时间片
- js执行线程和GUI也就是浏览器的绘制是互斥的，如果在时间内，没有执行完js，则暂停执行，将执行权交还给浏览器绘制，等下一帧继续执行
- 1. 任务暂停：shouldYield（当前时间 > 任务开始的时间+yieldInterval，打断任务进行）就是用来判断剩余的时间有没有用尽，用尽了则让权
- 2. 调度优先级：两个函数创建具有优先级的任务
    1、runWithPriority： 以一个优先级执行callback，若为同步任务，则优先级为ImmediateSchedulerPriority
    2、scheduleCallback：以一个优先级注册callback，适当时机执行，涉及过期时间运算，所以粒度更细
      1）优先级意味着过期时间（时间点）。过期时间 = 开始时间（当前时间） + timeout，过期时间 < 当前时间，则要立即执行，过期时间越长，执行优先级越低
      2）scheduleCallback调度过程使用了【小顶堆】，所以每次都能取到离过期时间最近的任务
      3）未过期任务task存放在timerQueue中，过期任务（每次先执行这个）存放在taskQueue中。
- 3. 暂停后恢复执行： 在performConcurrentWorkOnRoot函数的结尾有这样一个判断，如果callbackNode等于originalCallbackNode那就恢复任务的执行


### Lane
- 每个优先级是一个31位的二进制数字，1表示位置可用，0表示位置不可用（转换为10进制，数值越小，优先级越高），Lane的优先级粒度更细，ps：二进制计算性能更高
1. task任务怎么获取优先级的：从高优先级的lanes往下找，没有则换到稍微低一点优先级的lans里继续找
2. 高优先级怎么插队：低优先级已经构建了一部分fiber树，将其还原
3. 怎么解决饥饿问题：（低优先级的任务也要被执行），优先级调度过程中，遍历【未执行的任务包含的lane】，计算过期时间，加入root.expiredLanes，下次调用时优先返回expiredLanes（到期lane）

### fiber双缓存
1. fiber是在内存中的dom，包含节点的属性、类型、dom。
2. 通过child、sibling、return（返回父节点）构成fiber树
3. 还保存了updateQueue（链表结构），用来计算state，updateQueue有多个未计算的update，update（一种数据结构）保存了更新的数据、优先级（过期时间）
4. fiberRoot：指整个应用的根节点，只存在一个
5. rootFiber：应用的节点，可以存在多个
6. 当前的fiber树和更新的fiber树切换的时候：fiberRoot的current指向更新的fiber树（即指向rootFiber）

### render阶段
1. 捕获阶段：beginWork，从应用的根结点rootfiber开始到叶子结点，主要工作是创建或复用子fiber节点
2. 冒泡阶段：completeWork，主要工作是处理fiber的props、创建dom（创建的dom节点赋值给fiber.stateNode）、创建effectList
3. render阶段，当遍历到只有一个子节点的Fiber时，该Fiber节点的子节点不会执行beginWork和completeWork，这是react的一种优化手段
4. 在render阶段的末尾会调用commitRoot(fiberRoot)，进入commit阶段

### commit阶段
遍历render阶段生成的effectList（fiber节点保存着props变化）
遍历effectList对应的dom操作、生命周期、hook回调、销毁函数

### diff算法（单节点diff、双节点diff）
diff算法三个前提
- 同级dom比较
- type不同，则销毁当前节点和子孙节点，并新建节点
- 同一层级的节点，使用唯一key值来区分

1. 单节点diff（Element、Portal、string、number）
  - key、type都相同，复用
  - key不同，删除节点并创建新的
  - key同、type不同，删除当前节点、以及与兄弟节点的标记，创建新节点
2. 多节点diff（Array、Iterator）
会经历三次遍历（而newChildren存在于jsx当中）
  第一次：处理节点更新（props更新，type更新、删除）
    1、key不同，结束第一次遍历
    2、newChildren或oldFiber遍历完，结束第一次遍历（newChildren遍历完但oldFiber存在，则剩余的全都打deletion标签）
    3、key同，type不同，打deletion标签
    4、key、type都同，复用
  第二次：处理节点新增
    1、newChildren和oldFiber都遍历完，多节点diff结束
    2、newChildren、oldFiber都没遍历完，进入节点移动逻辑
    3、newChildren没遍历完，oldFiber遍历完，newChildren剩余值打【插入】的tag
  第三次：处理节点位置改变
    1、对比newChildren和oldFiber的各个节点，newChildren[i]能和oldFiber[j]位置对比的上，则i++，j++；否则oldFiber值移动到最后，j++，在与i进行比较







1. jsx和Fiber有什么关系
2. react17之前jsx文件为什么要声明import React from 'react'，之后为什么不需要了
3. Fiber是什么，它为什么能提高性能

hooks
4. 为什么hooks不能写在条件判断中

状态/生命周期
5. setState是同步的还是异步的
6. componentWillMount、componentWillMount、componentWillUpdate为什么标记UNSAFE

组件
7. react元素$$typeof属性什么
8. react怎么区分Class组件和Function组件
9. 函数组件和类组件的相同点和不同点

开放性问题
10. 说说你对react的理解/请说一下react的渲染过程
11. 聊聊react生命周期
12. 简述diff算法
13. react有哪些优化手段
14. react为什么引入jsx
15. 说说virtual Dom的理解
16. 你对合成事件的理解
17. 我们写的事件是绑定在dom上么，如果不是绑定在哪里？
18. 为什么我们的事件手动绑定this(不是箭头函数的情况)
19. 为什么不能用 return false 来阻止事件的默认行为？
20. react怎么通过dom元素，找到与之对应的 fiber对象的？

解释结果和现象
21. 点击Father组件的div，Child会打印Child吗
```js
function Child() {
  console.log('Child');
  return <div>Child</div>;
}
    
    
function Father(props) {
  const [num, setNum] = React.useState(0);
  return (
    <div onClick={() => {setNum(num + 1)}}>
      {num}
      {props.children}
    </div>
  );
}
    
    
function App() {
  return (
    <Father>
      <Child/>
    </Father>
  );
}
    
const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);
```
22. 打印顺序是什么
```js
function Child() {
  useEffect(() => {
    console.log('Child');
  }, [])
  return <h1>child</h1>;
}
    
function Father() {
  useEffect(() => {
    console.log('Father');
  }, [])
      
  return <Child/>;
}
    
function App() {
  useEffect(() => {
    console.log('App');
  }, [])
    
  return <Father/>;
}
```
23. useLayoutEffect/componentDidMount和useEffect的区别是什么
```js
class App extends React.Component {
  componentDidMount() {
    console.log('mount');
  }
}
    
useEffect(() => {
  console.log('useEffect');
}, [])
```