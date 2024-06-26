### react 性能优化
1. shouldComponentUpdate  pureComponent(内部实现了shouldComponentUpdate)
2. react.memo useMemo useCallback 
3. key
4. 按需加载 lazy Suspense  
  - React.lazy(() => import('./SomeComponent'))
5. 合并多个setState

### react和vue的区别
1. 优化方向
vue: 编译时优化 模板语法在预编译层面做更多的预判，让 Vue 在运行时有更好的性能
react: 纯js写法，编译时很难做太多事，主要优化方向在运行时。运行时的主要瓶颈就是 CPU（16.6 ms）、IO

2. 在虚拟dom上
vue 的 template compiler 是自己实现的
  - VUE在渲染过程中，会跟踪每⼀个组件的依赖关系，不需要重新渲染整个组件树。
react 的 jsx 的编译器是 babel 实现的
  - React⽽⾔，每当 应⽤的状态被改变时，全部⼦组件都会重新渲染
  - 使⽤ PureComponent，或是⼿动实现shouldComponentUpdate ⽅法
  - useMemo useCallback 进行优化
编译成 render function 后再执行就是我们需要的 vdom。

3. 状态管理的方式上
vue 有响应式，而 react 则是 setState 的 api 的方式
react 是通过 setState 的 api 触发状态更新的，更新以后就重新渲染整个 vdom。
而 vue 是通过对状态做代理，get 的时候收集以来，然后修改状态的时候就可以触发对应组件的 render

4. diff
vue和react的diff算法都是进行同层次的比较，主要有以下两点不同：
vue对比节点，如果节点元素类型相同，但是className不同，认为是不同类型的元素，会进行删除重建，但是react则会认为是同类型的节点，只会修改节点属性。
vue的列表比对采用的是首尾指针法，而react采用的是从左到右依次比对的方式，当一个集合只是把最后一个节点移动到了第一个，react会把前面的节点依次移动，
而vue只会把最后一个节点移动到最后一个，从这点上来说vue的对比方式更加高效。

### react diff算法
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


#### 为什么 react 不直接渲染对应组件呢？
- 想象一下这个场景：
父组件把它的 setState 函数传递给子组件，子组件调用了它。
这时候更新是子组件触发的，但是要渲染的就只有那个组件么？
明显不是，还有它的父组件。
同理，某个组件更新实际上可能触发任意位置的其他组件更新的。
当某个组件的状态发生变化时，React 会重新渲染该组件及其所有子组件，`以确保整个组件树的状态保持一致`。

- 那 vue 为啥可以做到精准的更新变化的组件呢？
因为响应式的代理，通过defineProperty，proxy `依赖收集`起来，状态变化的时候就可以触发它们的 render，不管是组件是在哪里的只更新对应render部分。
这就是为什么 react 需要重新渲染整个 vdom，而 vue 不用。

这个问题也导致了后来两者架构上逐渐有了差异。
5. react 架构的演变
react15 的时候，和 vue 的渲染流程还是很像的，都是递归渲染 vdom，增删改 dom 就行。
react 的 setState 会渲染整个 vdom，而一个应用的所有 vdom 可能是很庞大的，计算量就可能很大。
浏览器里 js 计算时间太长是会阻塞渲染的，会占用每一帧的动画、重绘重排的时间，这样动画就会卡顿。
react 就改造为了 fiber 架构。
6. fiber 架构
优化的目标是打断计算，分多次进行，但现在递归的渲染是不能打断的，有两个方面的原因导致的：
- 渲染的时候直接就操作了 dom 了，这时候打断了，那已经更新到 dom 的那部分怎么办？

第一个问题的解决：
渲染的时候不直接更新到 dom，只找到变化的部分，打个增删改的标记，等全部计算完一次性更新到 dom

react 把渲染流程分为了两部分： render 和 commit
```js
// render 阶段会找到 vdom 中变化的部分，创建 dom，打上增删改的标记，这个叫做 reconcile，调和。
// reconcile 是可以打断的，由 schedule 调度

// 之后全部计算完了，就一次性更新到 dom，叫做 commit。
// 改造成了 render（reconcile + schdule） + commit 两个阶段的渲染。

// react 15架构
// Reconciler（协调器）—— 负责调用 render 生成虚拟 Dom 进行 Diff，找出变化后的虚拟 Dom
// Renderer（渲染器）—— 负责接到 Reconciler 通知，将变化的组件渲染在当前宿主环境，比如浏览器，不同的宿主环境会有不同的 Renderer。

// react 16架构  -- Concurrent Mode
// Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
// Reconciler（协调器）—— 负责找出变化的组件（使用 Fiber 重构）为变化的虚拟DOM打上代表增/删/更新的标记
// Renderer（渲染器）—— 负责将变化的组件渲染到页面上, 整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。

// React 17 - 稳定 Concurrent Mode 的过渡版本
// 新的优先级算法 - lanes

// React 18 - 更灵活 Concurrent Renderring
```

### react理念: 将同步的更新变为可中断的异步更新

### Fiber
- Fiber是一个js对象，能承载节点信息、优先级、updateQueue，同时它还是一个工作单元。
- 每个Fiber节点对应一个React element保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
- 每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）

- Fiber节点构成的Fiber树就对应DOM树

### Fiber架构  react的渲染过程

在React的渲染过程中，Virtual DOM扮演着重要的角色，通过比较新旧Virtual DOM树的差异，React能够高效地更新真实DOM，从而实现页面的动态渲染。通过Fiber架构和Diff算法的优化，React能够在更新过程中进行灵活的控制和优化，提高页面的性能和用户体验。
<!-- 两个阶段 调度阶段（调度器，协调器，渲染器），提交阶段

jsx会被babel经过ast解析成React.createElement，
而React.createElement函数执行之后就是virtual-dom（jsx对象）（ReactElement）
virtual-dom -》 Fiber -> Fiber[] -> DOM
在mount的时候，render阶段会根据jsx对象生成新的Fiber节点
在update的时候，render阶段会根据最新的jsx和老的Fiber进行对比，生成新的Fiber  新旧dom -->

#### 如何更新DOM --> Fiber “双缓存” 
- 当前**屏幕**上显示内容对应的Fiber树称为**current Fiber**树
- 正在**内存**中构建的Fiber树称为**workInProgress Fiber**树
- 当workInProgress Fiber树构建完成交给**Renderer**渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树

- mount阶段
- 执行**ReactDOM.render**会创建**fiberRootNode（源码中叫fiberRoot）和rootFiber**。其中fiberRootNode是整个**应用**的根节点，rootFiber是<App/>所在**组件树**的根节点
- mount更新完时，fiberRootNode的current指针指向workInProgress Fiber树使其变为current Fiber 树

- update阶段
- workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树

#### React-fiber如何优化性能
React Fiber 是 React 的新的核心算法，旨在提高 React 应用的性能。它采用了增量渲染的方式来优化性能，具体来说，React Fiber 通过将渲染工作分成多个小单元的任务，然后在每个任务之间执行优先级排序，以便更好地控制渲染的优先级和中断。

React Fiber 的一些性能优化策略包括：
- 异步渲染：React Fiber 支持异步渲染，可以将渲染工作分成多个小任务，并根据任务的优先级来调度执行，从而提高页面的响应速度。
- 可中断渲染：React Fiber 支持中断渲染，可以在渲染过程中暂停并恢复工作，以便更好地响应用户的交互。
- 优先级调度：React Fiber 支持任务的优先级调度，可以根据任务的优先级来决定执行的顺序，从而更好地控制渲染的优先级。
- 增量更新：React Fiber 支持增量更新，可以只更新需要更新的部分，而不是重新渲染整个页面，从而减少不必要的渲染。


### React的合成事件
合成事件机制：
  react 16绑定到document
  react 17绑定到root
React合成事件的优势：
1. 抹平不同浏览器直接的差异，提供统一的API使用体验
2. 通过事件委托的方式统一绑定和分发事件，有利于提升性能，减少内存消耗

之后详细说了一下合成事件的绑定及分发流程：
1. React应用启动时，会在页面渲染的根元素上绑定原生的DOM事件，将该`根元素作为委托对象`
2. 在组件渲染时，会通过JSX解析出元素上`绑定`的事件，并将这些事件与原生事件进行一一映射
3. 当用户点击页面元素时，事件会冒泡到根元素，之后根元素监听的事件通过`dispatchEvent方法`进行事件派发
4. dispatchEvent会根据事件的映射关系以及DOM元素找到React中与之对应的fiber节点
5. 找到fiber节点后，将其绑定的合成事件函数加到一个函数执行队列中
6. 最后则依次执行队列中的函数完成事件的触发流程

### React的patch流程(批处理)  Scheduler调度器原理
1. Scheduler调度器主要用于调度Fiber节点的生成和更新任务
2. Reconciler协调器执行组件的render方法生成一个Fiber节点  (之后再递归的去生成Fiber节点的子节点)
3. `每一个Fiber节点`的生成都是一个单独的任务，交给Scheduler进行调度处理，根据任务的优先级去执行任务
4. 任务的优先级是根据`lanes车道模型`判断的，将任务进行分类，每一类拥有不同的优先级，所有的分类和优先级都在React中进行了枚举
5. Scheduler按照优先级执行任务时，会异步的执行，同时每一个任务执行完成之后，都会`通过requestIdleCallBack去判断下一个任务是否能在当前渲染帧的剩余时间内完成`
6. 如果不能完成就发生中断，把线程的控制权交给浏览器，剩下的任务则在下一个渲染帧内执行
7. 整个Reconciler和Scheduler的任务执行完成之后，会生成一个新的workInProgressFiber的新的节点树，之后Reconciler触发Commit阶段通知Render渲染器去进行diff操作，也就是我们说的patch流程

### React事务机制
React事务机制是React框架中用于管理组件更新过程的一种机制。在React中，所有的组件更新操作都是通过事务来管理的，事务机制可以确保组件更新的一致性和可靠性。

React事务机制包含以下几个关键步骤：
- 开启事务：当需要进行组件更新时，React会开启一个新的事务。
- 执行更新操作：在事务中，React会执行所有需要更新的组件操作，包括调用组件的生命周期方法、更新组件的状态和属性等。
- 执行更新队列：React会将所有需要更新的操作放入更新队列中，然后按照一定的顺序执行这些操作。
- 提交事务：当所有更新操作执行完毕时，React会提交事务，将更新的结果同步到DOM中。

React事务机制的优点包括：
- 保证更新的一致性：通过事务机制，React可以确保组件更新的顺序和一致性，避免出现更新操作的冲突和不一致。
- 提高性能：事务机制可以将多个更新操作合并成一个批处理操作，减少不必要的重复渲染，提高页面性能和用户体验。
- 简化代码逻辑：通过事务机制，开发者可以更方便地管理组件更新过程，简化代码逻辑，提高开发效率。

### 1. 什么是 Hooks
可以在不编写 class 的情况下使用 state 以及其他的 React 特性

### 2. react diff 原理

### 3. 调用 super(props) 的目的是什么
- 传递 props 给 super() 的原因则是为了能在 constructor 访问 this.props

### 4. react为什么引入jsx
解释概念：jsx是js语法的扩展 可以很好的描述ui jsx是React.createElement的语法糖
想实现什么目的：声明式 代码结构简洁 可读性强 结构样式和事件可以实现高内聚 低耦合 、复用和组合 不需要引入新的概念和语法 只写js， 虚拟dom跨平台
有哪些可选方案：模版语法 vue ag引入了控制器 作用域 服务等概念
jsx原理：babel抽象语法树 classic是老的转换 automatic新的转换

### 5. setState什么时候同步什么时候异步?  setState(partialState, callback) 中的callback拿到更新后的结果。
在 原生事件 和 setTimeout 中，setState是同步的

### 6. React是怎样控制异步和同步  isBatchingUpdates
在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中延时更新，而 isBatchingUpdates 默认是 false，表示 setState 会同步更新 this.state；但是，有一个函数 batchedUpdates，该函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会先调用这个 batchedUpdates将isBatchingUpdates修改为true，这样由 React 控制的事件处理过程 setState 不会同步更新 this.state

batchedUpdates

### 7.父子组件传值
1 props
2 ref
3 const Context = React.createContext();  Provider  Consumer
4 ctx = createContext(0)    ctx.Provider     子 useContext(ctx)

ReactDOM.createPortal 创建根节点外的弹窗

PureComponent适用于类组件，React.memo适用于函数组件

调度阶段：调度帧
```js
// 调度阶段
componentWillMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate
// 提交阶段
componentDidMount
componentDidUpdate
componentWillUnmount
```
提交阶段：

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


### Lane 车道模型
- 每个优先级是一个31位的二进制数字，1表示位置可用，0表示位置不可用（转换为10进制，数值越小，优先级越高），Lane的优先级粒度更细，ps：二进制计算性能更高
1. task任务怎么获取优先级的：从高优先级的lanes往下找，没有则换到稍微低一点优先级的lans里继续找
2. 高优先级怎么插队：低优先级已经构建了一部分fiber树，将其还原
3. 怎么解决饥饿问题：（低优先级的任务也要被执行），优先级调度过程中，遍历【未执行的任务包含的lane】，计算过期时间，加入root.expiredLanes，下次调用时优先返回expiredLanes（到期lane）

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

17. 我们写的事件是绑定在dom上么，如果不是绑定在哪里？ 
答：v16绑定在document上，v17绑定在container上
18. 为什么我们的事件手动绑定this(不是箭头函数的情况) 
答：合成事件监听函数在执行的时候会丢失上下文
19. 为什么不能用 return false来阻止事件的默认行为？ 
答：说到底还是合成事件和原生事件触发时机不一样
20. react怎么通过dom元素，找到与之对应的 fiber对象的？ 
答：通过internalInstanceKey对应


### React的事件和普通的HTML事件有什么不同
对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
对于事件函数处理语法，原生事件为字符串，react 事件为函数；
react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用preventDefault()来阻止默认行为