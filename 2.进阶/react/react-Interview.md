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

#### React-fiber如何优化性能
React Fiber 是 React 的新的核心算法，旨在提高 React 应用的性能。它采用了增量渲染的方式来优化性能，具体来说，React Fiber 通过将渲染工作分成多个小单元的任务，然后在每个任务之间执行优先级排序，以便更好地控制渲染的优先级和中断。

React Fiber 的一些性能优化策略包括：

- 异步渲染：React Fiber 支持异步渲染，可以将渲染工作分成多个小任务，并根据任务的优先级来调度执行，从而提高页面的响应速度。
- 可中断渲染：React Fiber 支持中断渲染，可以在渲染过程中暂停并恢复工作，以便更好地响应用户的交互。
- 优先级调度：React Fiber 支持任务的优先级调度，可以根据任务的优先级来决定执行的顺序，从而更好地控制渲染的优先级。
- 增量更新：React Fiber 支持增量更新，可以只更新需要更新的部分，而不是重新渲染整个页面，从而减少不必要的渲染。

总的来说，React Fiber 通过引入异步渲染、可中断渲染、优先级调度和增量更新等策略，来优化 React 应用的性能，提高页面的响应速度和用户体验。

### Fiber 与 jsx
- Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点。
- JSX是一种描述当前组件内容的数据结构，不包含组件schedule、reconcile、render所需的相关信息

### JSX本质是什么
JSX本质上是JavaScript的语法扩展，用于在React中编写UI组件。它允许开发者使用类似HTML的语法结构来描述UI组件的结构，使得代码更加易读和易写。在编译时，JSX会被转换成普通的JavaScript对象，然后由React进行处理和渲染。因此，JSX并不是一种新的语言或模板语言，而是一种在JavaScript中嵌入XML结构的语法糖。

### react为什么引入jsx
解释概念：jsx是js语法的扩展 可以很好的描述ui jsx是React.createElement的语法糖
想实现什么目的：声明式 代码结构简洁 可读性强 结构样式和事件可以实现高内聚 低耦合 、复用和组合 不需要引入新的概念和语法 只写js， 虚拟dom跨平台
有哪些可选方案：模版语法 vue ag引入了控制器 作用域 服务等概念
jsx原理：babel抽象语法树 classic是老的转换 automatic新的转换

### React的合成事件
合成事件机制：
  react 16绑定到document
  react 17绑定到root
React合成事件的优势：
抹平不同浏览器直接的差异，提供统一的API使用体验
通过事件委托的方式统一绑定和分发事件，有利于提升性能，减少内存消耗
React 的合成事件机制是指 React 在处理 DOM 事件时，会将所有的事件统一封装成合成事件对象，
然后通过事件委托的方式将事件绑定在 document（17版本在root上） 上，
然后根据事件冒泡的机制来处理事件。

之后详细说了一下合成事件的绑定及分发流程：
1. React应用启动时，会在页面渲染的根元素上绑定原生的DOM事件，将该`根元素作为委托对象`
2. 在组件渲染时，会通过JSX解析出元素上`绑定`的事件，并将这些事件与原生事件进行一一映射
3. 当用户点击页面元素时，事件会冒泡到根元素，之后根元素监听的事件通过`dispatchEvent方法`进行事件派发
4. dispatchEvent会根据事件的映射关系以及DOM元素找到React中与之对应的fiber节点
5. 找到fiber节点后，将其绑定的合成事件函数加到一个函数执行队列中
6. 最后则依次执行队列中的函数完成事件的触发流程

### React的patch流程(批处理)
1. React新版架构新增了一个Scheduler调度器主要用于调度Fiber节点的生成和更新任务
2. 当组件更新时，Reconciler协调器执行组件的render方法生成一个Fiber节点之后再递归的去生成Fiber节点的子节点
3. `每一个Fiber节点`的生成都是一个单独的任务，会以回调的形式交给Scheduler进行调度处理，在Scheduler里会根据任务的优先级去执行任务
4. 任务的优先级的指定是根据`车道模型`，将任务进行分类，每一类拥有不同的优先级，所有的分类和优先级都在React中进行了枚举
5. Scheduler按照优先级执行任务时，会异步的执行，同时每一个任务执行完成之后，都会`通过requestIdleCallBack去判断下一个任务是否能在当前渲染帧的剩余时间内完成`
6. 如果不能完成就发生中断，把线程的控制权交给浏览器，剩下的任务则在下一个渲染帧内执行
7. 整个Reconciler和Scheduler的任务执行完成之后，会生成一个新的workInProgressFiber的新的节点树，之后Reconciler触发Commit阶段通知Render渲染器去进行diff操作，也就是我们说的patch流程









### React.Fiber 原理
- [React.Fiber原理]https://www.youtube.com/watch?v=ZCuYPiUIONs

### react和vue的diff算法
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

### 3. 调用 super(props) 的目的是什么
- 传递 props 给 super() 的原因则是为了能在 constructor 访问 this.props

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

### react 性能优化
1. shouldComponentUpdate  pureComponent(内部实现了shouldComponentUpdate)
2. react.memo useMemo useCallback 
3. key
4. 按需加载 lazy Suspense  
  - React.lazy(() => import('./SomeComponent'))
5. 合并多个setState

PureComponent适用于类组件，React.memo适用于函数组件

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
shouldComponentUpdate
componentWillUpdate
// 提交阶段
componentDidMount
componentDidUpdate
componentWillUnmount
```
提交阶段：



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

15. 说说virtual Dom的理解
是什么：React.createElement函数返回的就是虚拟dom，用js对象描述真实dom的js对象
优点：处理了浏览器的兼容性 防范xss攻击 跨平台 差异化更新 减少更新的dom操作
缺点：额外的内存 初次渲染不一定快

17. 我们写的事件是绑定在dom上么，如果不是绑定在哪里？ 
答：v16绑定在document上，v17绑定在container上
18. 为什么我们的事件手动绑定this(不是箭头函数的情况) 
答：合成事件监听函数在执行的时候会丢失上下文
19. 为什么不能用 return false来阻止事件的默认行为？ 
答：说到底还是合成事件和原生事件触发时机不一样
20. react怎么通过dom元素，找到与之对应的 fiber对象的？ 
答：通过internalInstanceKey对应

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

// 不会，源码中是否命中bailoutOnAlreadyFinishedWork
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
// Child ，Father ，App ，render阶段mount时深度优先遍历，commit阶段useEffect执行时机
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

// 他们在commit阶段不同时机执行，useEffect在commit阶段结尾异步调用，useLayout/componentDidMount同步调用
```


4. React事务机制
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

总的来说，React事务机制是React框架中非常重要的一部分，它可以确保组件更新的一致性和可靠性，提高页面性能和开发效率。


### React组件渲染和更新的过程
React组件的渲染和更新过程主要包括以下几个步骤：

- 初始化阶段：当React应用程序启动时，React会首先初始化根组件并将其渲染到DOM中。这个过程包括创建组件的实例、调用组件的构造函数和生命周期方法等。
- 渲染阶段：在初始化阶段之后，React会根据组件的props和state来确定组件的UI展示内容，并将其渲染到DOM中。这个过程包括调用组件的render方法生成虚拟DOM树、对比新旧虚拟DOM树找出差异等。
- 更新阶段：当组件的props或state发生变化时，React会触发组件的更新。更新过程包括重新调用render方法生成新的虚拟DOM树、对比新旧虚拟DOM树找出差异、更新DOM元素等。
- 组件生命周期方法：在组件的生命周期中，React提供了一系列的生命周期方法，如componentDidMount、componentDidUpdate等，可以在这些方法中进行组件的初始化、更新等操作。

总的来说，React组件的渲染和更新过程是通过虚拟DOM来实现的，React会根据组件的props和state来生成虚拟DOM树，并通过比对新旧虚拟DOM树找出差异，最终更新到DOM中，从而实现组件的渲染和更新。

### 说说你对react的理解/请说一下react的渲染过程
是什么：react是构建用户界面的js库
能干什么：可以用组件化的方式构建快速响应的web应用程序
如何干：声明式（jsx） 组件化（方便拆分和复用 高内聚 低耦合） 一次学习随处编写
做的怎么样： 优缺（社区繁荣 一次学习随处编写 api简介）缺点（没有系统解决方案 选型成本高 过于灵活）
设计理念：跨平台（虚拟dom） 快速响应（异步可中断 增量更新）
性能瓶颈：cpu io fiber时间片 concurrent mode
渲染过程：scheduler render commit Fiber架构