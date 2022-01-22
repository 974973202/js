虚拟DOM: 是由普通js对象描述DOM对象（可跨平台）

维护程序状态跟踪上一次状态，通过比较前后两次状态差异更新真实DOM。

snabbdom 

yarn add parcel-bundler -S
yarn add snabbdom -S

```js
import {
  init,
  h,
} from "snabbdom";

// 通过h函数创建VNode
let vNode = h('div#box.container',
  { style: { color: "#000" } },
  [
    h('h1', 'text1')
    h('h2', 'text2')
  ]);

// 获取挂载元素
const dom = document.querySelector('#app');

// 通过init函数得到patch函数
const patch = init([])

// 通过patch 将初次 vNode 渲染到 DOM
const oldNode = patch(dom, vNode)

// 创建新的VNode,更新给 oldVNode
vNode = h('p#text.abc', 'xxxx');
patch(oldNode, vNode)
```

snabbdom源码
核心：
- init()设置模块，创建patch()函数
- 使用h()函数创建js对象（VNode）描述真实DOM
- patch()比较新旧两个VNode
- 把变化的内容更新到真实的DOM树
```js
h函数各种判断，最终传入vnode

init函数，返回patch
init函数有个cbs钩子里面有类似生命周期的函数来操作vnode
patch
 判断是否vnode结点  isVnode
 判断新旧是否相同vnode sameVnode -> patchVnode 内部比对
                      !sameVnode -> createElm

createElm(vnode, insertedVnodeQueue) 根据虚拟结点创建DOM
  -> cbs.create
  还有子节点递归调用createElm

patchVnode 比对新旧结点内部的差异
  vnode.data != undefined -> cbs.update
  处理文本结点oldVnode.text  removeVnodes -> setTextContent
  新旧子结点都存在 -> updateChildren -> 新旧子结点都存在 -> updateChildren ->...
    1. oldStartVnode newStartVnode 旧开始/新开始 索引后移
    2. oldEndVnode newEndVnode  旧结束/新结束
    3. oldStartVnode newEndVnode  旧开始/新结束 旧开始移到右边
    4. oldEndVnode newStartVnode  旧结束/新开始 旧结束移到左边
    5. 具有相同key的情况

```
