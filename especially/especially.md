- [js排序算法]https://juejin.im/post/58c9d5fb1b69e6006b686bce
- [js中的广度优先遍历（BFS）和深度优先遍历（DFS）]https://www.jianshu.com/p/b4d8085e84bd

```js 栈 队列
  function Static() {
      this.arr = [];
      this.push = function (val) {
          this.arr.push(val)
      }
      this.pop = function () {
          return this.arr.pop()
      }
  }
  function Queue() {
      this.arr = [];
      this.push = function (val) {
          this.arr.push(val)
      }
      this.shift = function () {
          return this.arr.shift()
      }
  }
```

二维拓扑结构：只看关系变化，不看位置变化
```js
function Node(value) {
  this.value = value;
  this.neighbor = [];
}
var a = new Node('a');
var b = new Node('b');
var c = new Node('c');
var d = new Node('d');
var e = new Node('e');

a.neighbor.push(b)
a.neighbor.push(c)
a.neighbor.push(f)

b.neighbor.push(a)
b.neighbor.push(d)
b.neighbor.push(e)

c.neighbor.push(a)
d.neighbor.push(b)
e.neighbor.push(b)
```

树形结构：有一个根节点，没有回路
根节点：最顶层的节点
叶子节点：下边没有其他节点了
节点：既不是根节点，又不是**叶子节点**的普通节点
树的度：这棵树有最多叉的节点有多少个叉，这棵树的度就为多少
树的深度：树最深有几层。树的深度就为几

二叉树： 树的度最多为2的树形结构。（就是两个叉）
满二叉树：
 1. 所有的叶子节点都在最底层
 2. 每个非叶子节点都有两个子节点
```js
// 满二叉树
   `A
   / \
  C   B
 /\  / \
F  G D  E`
```

完全二叉树：
 - 国内定义：
    1. 叶子节点都在最后一层或者倒数第二层，
    2. 叶子节点都向左聚拢
 - 国际定义：
    1. 叶子节点都在最后一层或者倒数第二层，
    2. 如果有叶子节点，必然就有两个叶子节点

在二叉树中，每个节点都认为自己的根节点
子树：二叉树中，每一个节点或叶子节点，都是一颗子树的根节点。

左子树、右子树：


- 前序遍历: (先根次序遍历)
 - 先打印当前的，再打印左边的，再打印右边的。ACFGBDE
- 中序遍历： (中跟次序遍历)
 - 先打印左边的，再打印当前的，再打印右边的。FCGADBE
- 后序遍历： (后根次序遍历)
 - 先打印左边的，再打印右边的，再打印当前的。FGCDEBA

```
    A
   / \
  C   B
 /\  / \
F  G D  E
```

```js
function Node() {
    this.value = value;
    this.left = null;
    this.right = null;
}
var a = new Node('a')
var b = new Node('b')
var c = new Node('c')
var d = new Node('d')
var e = new Node('e')
var f = new Node('f')
var g = new Node('g')

a.left = c;
a.right = b;
c.left = f;
c.right = g;
b.left = d;
b.right = e;

// 前序遍历
function f1(root) {
    if (root == null) return;
    console.log(root.value) // ACFGBDE
    f1(root.left)
    f1(root.right)
}
f1(a)

// 中序遍历
function f2(root) {
    if (root == null) return;
    f2(root.left)
    console.log(root.value) // FCGADBE
    f2(root.right)
}
f2(a)

// 后序遍历
function f3(root) {
    if (root == null) return;
    f3(root.left)
    f3(root.right)
    console.log(root.value) // FGCDEBA
}
f3(a)
```

根据前序中序遍历还原二叉树，并写出后序遍历
```js
// 前序遍历：A CFG  BDE
// 中序遍历：FCG  A  DBE
const qian = 'ACFGBDE'.split('')
const zhong = 'FCGADBE'.split('')

function Node(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}

function f1(qian, zhong) {
    if (
        qian == null
        || zhong == null
        || qian.length == 0
        || zhong.length == 0
        || qian.length !== zhong.length
    ) return;
    var root = new Node(qian[0]);
    var index = zhong.indexOf(root.value); // 找到根节点在中序遍历中的位置
    var qianLeft = qian.slice(1,  1 + index); // 找到前序左边部分 CFG
    var qianRight = qian.slice(1 + index, qian.length); // 找到前序右边部分 BDE
    var zhongLeft = zhong.slice(0, index);// 找到中序左边部分 FCG
    var zhongRight = zhong.slice(1 + index, zhong.length);// 找到中序右边部分 DBE

    root.left = f1(qianLeft, zhongLeft)
    root.right = f1(qianRight, zhongRight)
}
f1(qian,zhong)
```

根据后序中序遍历还原二叉树，并写出前序遍历
```js
// 后序遍历：FGC DEB A
// 中序遍历：FCG  A  DBE
const hou = 'FGCDEBA'.split('')
const zhong = 'FCGADBE'.split('')

function Node(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}

function f1(hou, zhong) {
    if (
        hou == null
        || zhong == null
        || hou.length == 0
        || zhong.length == 0
        || hou.length !== zhong.length
    ) return;
    var root = new Node(hou[hou.length - 1]); // 找到根节点
    var index = zhong.indexOf(root.value); // 找到根节点在中序遍历中的位置

    var zhongLeft = zhong.slice(0, index);// 找到中序左边部分 FCG
    var zhongRight = zhong.slice(1 + index, zhong.length);// 找到中序右边部分 DBE
    var houLeft = hou.slice(0, index); // 找到后序左边部分 FGC
    var houRight = hou.slice(index, hou.length - 1); // 找到后序右边部分 DEB

    root.left = f1(houLeft, zhongLeft)
    root.right = f1(houRight, zhongRight)
}
f1(hou,zhong)
```

```js
// 青蛙跳台 一个青蛙一次只能跳一级台阶或者两级台阶
// 问青蛙跳上n级台阶有多少种情况
```