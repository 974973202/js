
0. 优化方向
vue: 编译时优化 模板语法在预编译层面做更多的预判，让 Vue 在运行时有更好的性能
react: 纯js写法，编译时很难做太多事，主要优化方向在运行时。运行时的主要瓶颈就是 CPU（16.6 ms）、IO
1. vdom
vue 的 template compiler 是自己实现的，而 react 的 jsx 的编译器是 babel 实现的.
编译成 render function 后再执行就是我们需要的 vdom。
那渲染器怎么渲染 vdom 的呢？
2. 渲染 vdom
渲染 vdom 也就是通过 dom api 增删改 dom。
比如一个 div，那就要 document.createElement 创建元素，然后 setAttribute 设置属性，addEventListener 设置事件监听器。如果是文本，那就要 document.createTextNode 来创建。
组件怎么渲染呢？
3. 组件
添加标识，封装对应的处理方法
如何把 state 和 jsx 关联起来呢？
封装成 function、class 或者 option 对象的形式。
```jsx
switch (vdom.tag) {
  case FunctionComponent: 
       const childVdom = vdom.type(props);
       
       render(childVdom);
       //...
  case ClassComponent: 
     const instance = new vdom.type(props);
     const childVdom = instance.render();
     
     render(childVdom);
     //...
} 
```
基于 vdom 的前端框架渲染流程都差不多，vue 和 react 很多方面是一样的。但是管理状态的方式不一样，vue 有响应式，而 react 则是 setState 的 api 的方式
4. 状态管理
react 是通过 setState 的 api 触发状态更新的，更新以后就重新渲染整个 vdom。
而 vue 是通过对状态做代理，get 的时候收集以来，然后修改状态的时候就可以触发对应组件的 render 了
为什么 react 不直接渲染对应组件呢？
- 想象一下这个场景：
父组件把它的 setState 函数传递给子组件，子组件调用了它。
这时候更新是子组件触发的，但是要渲染的就只有那个组件么？
明显不是，还有它的父组件。
同理，某个组件更新实际上可能触发任意位置的其他组件更新的。
所以必须重新渲染整个 vdom 才行。
那 vue 为啥可以做到精准的更新变化的组件呢？
因为响应式的代理呀，不管是子组件、父组件、还是其他位置的组件，只要用到了对应的状态，那就会被作为依赖收集起来，状态变化的时候就可以触发它们的 render，不管是组件是在哪里的。
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
- 现在是直接渲染的 vdom，而 vdom 里只有 children 的信息，如果打断了，怎么找到它的父节点呢？
第一个问题的解决：
渲染的时候不要直接更新到 dom 了，只找到变化的部分，打个增删改的标记，创建好 dom，等全部计算完了一次性更新到 dom 就好了

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
// Reconciler（协调器）—— 负责找出变化的组件（使用 Fiber 重构）
// Renderer（渲染器）—— 负责将变化的组件渲染到页面上

// React 17 - 稳定 Concurrent Mode 的过渡版本
// 新的优先级算法 - lanes

// React 18 - 更灵活 Concurrent Renderring
```
第二个问题: 
现有的 vdom 是不行的，需要再记录下 parent、silbing 的信息。所以 react 创造了 fiber 的数据结构。(链表结构)
fiber 既是一种数据结构，也代表 render + commit 的渲染流程
react 会先把 vdom 转换成 fiber，再去进行 reconcile，这样就是可打断的了。
为什么这样就可以打断了呢？
因为现在不再是递归，而是循环了：
```js
function workLoop() {
  while (wip) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}
```
react 里有一个 workLoop 循环，每次循环做一个 fiber 的 reconcile，当前处理的 fiber 会放在 workInProgress 这个全局变量上。
当循环完了，也就是 wip 为空了，那就执行 commit 阶段，把 reconcile 的结果更新到 dom。

每个 fiber 的 reconcile 是根据类型来做的不同处理。当处理完了当前 fiber 节点，就把 wip 指向 sibling、return 来切到下个 fiber 节点。
```js
function performUnitOfWork() {
  const { tag } = wip;
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }

  wip = null;
}
```
循环执行 reconcile，那每次处理之前判断一下是不是有更高优先级的任务，就能实现打断了。

所以我们在每次处理 fiber 节点的 reconcile 之前，都先调用下 shouldYield 方法
shouldYiled 方法就是判断待处理的任务队列有没有优先级更高的任务，有的话就先处理那边的 fiber，这边的先暂停一下。
这就是 fiber 架构的 reconcile 可以打断的原理。通过 fiber 的数据结构，加上循环处理前每次判断下是否打断来实现的。
7. commit 阶段
reconcile 阶段并不会真正操作 dom，只会创建 dom 然后打个 effectTag 的增删改标记。

commit 阶段就根据标记来更新 dom 就可以了
但是 commit 阶段要再遍历一次 fiber 来查找有 effectTag 的节点，更新 dom 么？
这样当然没问题，但没必要。在 reconcile 的时候把有 effectTag 的节点收集到一个队列里，然后 commit 阶段直接遍历这个队列就行了。
这个队列叫做 effectList
8. 为什么useLayoutEffect是同步而 useEffect是异步
react 会在 commit 阶段遍历 effectList，根据 effectTag 来增删改 dom。
dom 创建前后就是 useEffect、useLayoutEffect 还有一些函数组件的生命周期函数执行的时候。
useEffect 被设计成了在 dom 操作前异步调用，useLayoutEffect 是在 dom 操作后同步调用。
为什么这样呢？
因为都要操作 dom 了，这时候如果来了个 effect 同步执行，计算量很大，那不是把 fiber 架构带来的优势有毁了么？
所以 effect 是异步的，不会阻塞渲染。
而 useLayoutEffect，顾名思义是想在这个阶段拿到一些布局信息的，dom 操作完以后就可以了，而且都渲染完了，自然也就可以同步调用了。

react 把 commit 阶段也分成了 3 个小阶段。
before mutation、mutation、layout。
mutation 就是遍历 effectList 来更新 dom 的。
它的之前就是 before mutation，会异步调度 useEffect 的回调函数。
它之后就是 layout 阶段了，因为这个阶段已经可以拿到布局信息了，会同步调用 useLayoutEffect 的回调函数。而且这个阶段可以拿到新的 dom 节点，还会更新下 ref。