### react理念
- 将同步的更新变为可中断的异步更新

### react15 的架构
- 分为两层： 
 - Reconciler（协调器）—— 负责找出变化的组件
 - Renderer（渲染器）—— 负责将变化的组件渲染到页面上

- 缺点：在Reconciler中，mount的组件会调用mountComponent (opens new window)，update的组件会调用updateComponent (opens new window)。这两个方法都会递归更新子组件，而递归一旦开始就无法中断

### React16 架构
- 三层：
 - Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
    - 由于requestIdleCallback兼容性问题，React放弃使用
    - React实现了功能更完备的requestIdleCallback polyfill，这就是Scheduler

 - Reconciler（协调器）—— 负责找出变化的组件
    - Reconciler内部采用了Fiber的架构
    - Reconciler与Renderer不再是交替工作。当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表增/删/更新的标记

 - Renderer（渲染器）—— 负责将变化的组件渲染到页面上
    - 整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。

### Fiber
- 每个Fiber节点对应一个React element保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
- 每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）
```js
// Fiber结构
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  // Fiber对应组件的类型 Function/Class/Host...
  this.tag = tag;
  // key属性
  this.key = key;
  // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  this.elementType = null;
  // 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // Fiber对应的真实DOM节点
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  // 指向父级Fiber节点
  this.return = null;
  // 指向子Fiber节点
  this.child = null;
  // 指向右边第一个兄弟Fiber节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```
- Fiber节点构成的Fiber树就对应DOM树

#### 如何更新DOM --> Fiber “双缓存” 
- 当前**屏幕**上显示内容对应的Fiber树称为**current Fiber**树，正在**内存**中构建的Fiber树称为**workInProgress Fiber**树
- 当workInProgress Fiber树构建完成交给**Renderer**渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树

- mount阶段
- 执行**ReactDOM.render**会创建**fiberRootNode（源码中叫fiberRoot）和rootFiber**。其中fiberRootNode是整个**应用**的根节点，rootFiber是<App/>所在**组件树**的根节点
- mount更新完时，fiberRootNode的current指针指向workInProgress Fiber树使其变为current Fiber 树

- update阶段
- workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树

### Fiber 与 jsx
- Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点。
- JSX是一种描述当前组件内容的数据结构，不包含组件schedule、reconcile、render所需的相关信息












### React.Fiber 原理
- [React.Fiber原理]https://www.youtube.com/watch?v=ZCuYPiUIONs

### react和vue的区别  
1.状态管理
    vue响应式 Object.defineProperty Proxy 通过对状态做代理，get 的时候收集以来，然后修改状态的时候就可以触发对应组件的 render
    
    react setState Api触发状态更新的，更新以后就重新渲染整个 vdom。
2.编写语法
    Vue推荐的做法是webpack+vue-loader的单文件组件格式，vue保留了html、css、js分离的写法
    
    React的开发者可能知道，react是没有模板的，直接就是一个渲染函数，它中间返回的就是一个虚拟DOM树，
    React推荐的做法是  JSX + inline style, 也就是把HTML和CSS全都写进JavaScript了,即'all in  js'。
3.diff算法
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

### React 事件机制  React 组件中怎么做事件代理？它的原理是什么？ 事件委托（事件代理）
React并不是将click事件绑定到了div的真实DOM上，而是在document处监听了所有的事件，当事件发生并且冒泡到document处的时候，React将事件内容封装并交由真正的处理函数运行。
### React的事件和普通的HTML事件有什么不同
对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
对于事件函数处理语法，原生事件为字符串，react 事件为函数；
react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用preventDefault()来阻止默认行为

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
- 传递 props 给 super() 的原因则是为了能在 constructor 访问 this.props

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

### 5. setState什么时候同步什么时候异步?  setState(partialState, callback) 中的callback拿到更新后的结果。
- React控制之外的事件中调用setState是同步更新的。比如原生js绑定的事件，setTimeout/setInterval等。
- 所以就能理解大部分开发中用到的都是React封装的事件，比如onChange、onClick、onTouchMove等，这些事件处理程序中的setState都是异步处理的

在 合成事件 和 生命周期钩子(除 componentDidUpdate) 中，setState是"异步"的
在 原生事件 和 setTimeout 中，setState是同步的，可以马上获取更新后的值

### 6. React是怎样控制异步和同步的呢？
在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中延时更新，而 isBatchingUpdates 默认是 false，表示 setState 会同步更新 this.state；但是，有一个函数 batchedUpdates，该函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会先调用这个 batchedUpdates将isBatchingUpdates修改为true，这样由 React 控制的事件处理过程 setState 不会同步更新 this.state

batchedUpdates

### 7.父子组件传值
1 props
2 const Context = React.createContext();  Provider  Consumer
3 ref
4 ctx = createContext(0)    ctx.Provider     子 useContext(ctx)


ReactDOM.createPortal 创建根节点外的弹窗

### react 性能优化
1. shouldComponentUpdata  pureComponent
2. react.memo useMemo useCallback 
3. key
4. 按需加载 lazy Suspense
5. 合并多个setState

### Fiber架构  react的渲染过程
<!-- 两个阶段 调度阶段（调度器，协调器，渲染器），提交阶段

jsx会被babel经过ast解析成React.createElement，
而React.createElement函数执行之后就是virtual-dom（jsx对象）（ReactElement）
virtual-dom -》 Fiber -> Fiber[] -> DOM
在mount的时候，render阶段会根据jsx对象生成新的Fiber节点
在update的时候，render阶段会根据最新的jsx和老的Fiber进行对比，生成新的Fiber -->

### Fiber是什么，它为什么能提高性能
Fiber是一个js对象，能承载节点信息、优先级、updateQueue，同时它还是一个工作单元。

Fiber双缓存可以在构建好wip Fiber树之后切换成current Fiber，内存中直接一次性切换，提高了性能
Fiber的存在使异步可中断的更新成为了可能，作为工作单元，可以在时间片内执行工作，没时间了交还执行权给浏览器，下次时间片继续执行之前暂停之后返回的Fiber
Fiber可以在reconcile的时候进行相应的diff更新，让最后的更新应用在真实节点上

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


### react17之前jsx文件为什么要声明import React from 'react'，之后为什么不需要了
jsx经过编译之后编程React.createElement，不引入React就会报错，react17改变了编译方式，变成了jsx.createElement

### hooks
4. 为什么hooks不能写在条件判断中
hook会按顺序存储在链表中，如果写在条件判断中，就没法保持链表的顺序

状态/生命周期
5. setState是同步的还是异步的
legacy模式下：命中batchedUpdates时是异步 未命中batchedUpdates时是同步的
concurrent模式下：都是异步的

6. componentWillMount、componentWillMount、componentWillUpdate为什么标记UNSAFE
新的Fiber架构能在scheduler的调度下实现暂停继续，排列优先级，Lane模型能使Fiber节点具有优先级，在高优先级的任务打断低优先级的任务时，低优先级的更新可能会被跳过，所有以上生命周期可能会被执行多次，和之前版本的行为不一致


组件
7. react元素$$typeof属性什么
用来表示元素的类型，是一个symbol类型

8. react怎么区分Class组件和Function组件
Class组件prototype上有isReactComponent属性

9. 函数组件和类组件的相同点和不同点
相同点：都可以接收props返回react元素

不同点：
编程思想：类组件需要创建实例，面向对象，函数组件不需要创建实例，接收输入，返回输出，函数式编程
内存占用：类组建需要创建并保存实例，占用一定的内存
值捕获特性：函数组件具有值捕获的特性
可测试性：函数组件方便测试
状态：类组件有自己的状态，函数组件没有只能通过useState
生命周期：类组件有完整生命周期，函数组件没有可以使用useEffect实现类似的生命周期
逻辑复用：类组件继承 Hoc（逻辑混乱 嵌套），组合优于继承，函数组件hook逻辑复用
跳过更新：shouldComponentUpdate PureComponent，React.memo
发展未来：函数组件将成为主流，屏蔽this、规范、复用，适合时间分片和渲染

开放性问题
10. 说说你对react的理解/请说一下react的渲染过程
是什么：react是构建用户界面的js库
能干什么：可以用组件化的方式构建快速响应的web应用程序
如何干：声明式（jsx） 组件化（方便拆分和复用 高内聚 低耦合） 一次学习随处编写
做的怎么样： 优缺（社区繁荣 一次学习随处编写 api简介）缺点（没有系统解决方案 选型成本高 过于灵活）
设计理念：跨平台（虚拟dom） 快速响应（异步可中断 增量更新）
性能瓶颈：cpu io fiber时间片 concurrent mode
渲染过程：scheduler render commit Fiber架构

11. 聊聊react生命周期
render阶段：
mount时：组件首先会经历constructor、getDerivedStateFromProps、componnetWillMount、render
update时：组件首先会经历componentWillReceiveProps、getDerivedStateFromProps、shouldComponentUpdate、render
error时：会调用getDerivedStateFromError
commit阶段
mount时：组件会经历componnetDidMount
update时：组件会调用getSnapshotBeforeUpdate、componnetDidUpdate
unMount时：调用componnetWillUnmount
error时：调用componnetDidCatch


12. 简述diff算法
13. react有哪些优化手段
shouldComponentUpdate、不可变数据结构、列表key、pureComponent、react.memo、useEffect依赖项、useCallback、useMemo、bailoutOnAlreadyFinishedWork

14. react为什么引入jsx
解释概念：jsx是js语法的扩展 可以很好的描述ui jsx是React.createElement的语法糖
想实现什么目的：声明式 代码结构简洁 可读性强 结构样式和事件可以实现高内聚 低耦合 、复用和组合 不需要引入新的概念和语法 只写js， 虚拟dom跨平台
有哪些可选方案：模版语法 vue ag引入了控制器 作用域 服务等概念
jsx原理：babel抽象语法树 classic是老的转换 automatic新的转换

15. 说说virtual Dom的理解
是什么：React.createElement函数返回的就是虚拟dom，用js对象描述真实dom的js对象
优点：处理了浏览器的兼容性 防范xss攻击 跨平台 差异化更新 减少更新的dom操作
缺点：额外的内存 初次渲染不一定快

16. 你对合成事件的理解
原生事件：全小写、事件处理函数（字符串）、阻止默认行为（返回false）
合成事件：小驼峰、事件处理函数（函数对象）、阻止默认行为（event.preventDefault()）

理解：
React把事件委托到document上（v17是container节点上）
先处理原生事件 冒泡到document上在处理react事件
React事件绑定发生在reconcile阶段 会在原生事件绑定前执行

优势：
进行了浏览器兼容。顶层事件代理，能保证冒泡一致性(混合使用会出现混乱)
默认批量更新
避免事件对象频繁创建和回收，react引入事件池，在事件池中获取和释放对象（react17中废弃） react17事件绑定在容器上了
我们写的事件是绑定在dom上么，如果不是绑定在哪里？ 答：v16绑定在document上，v17绑定在container上
为什么我们的事件手动绑定this(不是箭头函数的情况) 答：合成事件监听函数在执行的时候会丢失上下文
为什么不能用 return false来阻止事件的默认行为？ 答：说到底还是合成事件和原生事件触发时机不一样
react怎么通过dom元素，找到与之对应的 fiber对象的？ 答：通过internalInstanceKey对应

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