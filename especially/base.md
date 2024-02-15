- [js排序算法]https://juejin.im/post/58c9d5fb1b69e6006b686bce
- [js中的广度优先遍历（BFS）和深度优先遍历（DFS）]https://www.jianshu.com/p/b4d8085e84bd

```js 栈 队列
  function Static() { // 后进先出
      this.arr = [];
      this.push = function (val) {
          this.arr.push(val)
      }
      this.pop = function () {
          return this.arr.pop()
      }
  }
  function Queue() { // 先进先出
      this.arr = [];
      this.push = function (val) {
          this.arr.push(val)
      }
      this.shift = function () {
          return this.arr.shift()
      }
  }
```
### 栈（后进先出）的应用场景
- 十进制转二进制
- 判断字符串的括号是否有效
```js
// 输入 '()'  '(){}[]' 为 true
// 输入 '({}]'  为 false
function isValid(s) {
  const stack = [];
  for(let i = 0; i < s.length; i++) {
    const c = s[i];
    if(c === '(' || c === '{' || c === '['){
      stack.push(c);
    } else {
      const t = stack[stack.length - 1];
      if (
        (t === '(' && c === ')') ||
        (t === '{' && c === '}') ||
        (t === '[' && c === ']')
      ) {
        stack.pop();
      } else { return false }
    }
  }

  return stack.length === 0;
}
```
- 函数调用堆栈

```js  链表
// 节点类
class LinkedNode {
  constructor (value) {
    this.value = value
    // 用于存储下一个节点的引用
    this.next = null
  }
}

// 链表类
class LinkedList {
  constructor () {
    this.count = 0
    this.head = null
  }
  // 添加节点 (尾）
  addAtTail (value) {
    // 创建新节点
    const node = new LinkedNode(value)
    // 检测链表是否存在数据
    if (this.count === 0) {
      this.head = node
    } else {
      // 找到链表尾部节点，将最后一个节点的 next 设置为 node
      let cur = this.head
      while (cur.next != null) {
        cur = cur.next
      } // 直到为null
      cur.next = node
    }
    this.count++
  }
  // 添加节点（首）
  addAtHead (value) {
    const node = new LinkedNode(value)
    if (this.count === 0) {
      this.head = node
    } else {
      // 将 node 添加到 head 的前面
      node.next = this.head
      this.head = node
    }
    this.count++
  }
  // 获取节点（根据索引）
  get (index) {
    if (this.count === 0 || index < 0 || index >= this.count) {
      return
    }
    // 迭代链表，找到对应节点
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }
  // 添加节点（根据索引）
  addAtIndex (value, index) {
    if (this.count === 0 || index >= this.count) {
      return
    }
    // 如果 index <= 0，都添加到头部即可
    if (index <= 0) {
      return this.addAtHead(value)
    }
    // 后面为正常区间处理
    const prev = this.get(index - 1); // 获取要插入的前一个
    const next = prev.next; // 获取要插入前一个的后一个  插入元素在  prev node next 之间

    const node = new LinkedNode(value)
    prev.next = node
    node.next = next

    this.count++
  }
  // 删除（根据索引）
  removeAtIndex (index) {
    if (this.count === 0 || index < 0 || index >= this.count) {
      return
    }
    if (index === 0) {
      this.head = this.head.next
    } else {
      const prev = this.get(index - 1) // 获取要删除的前一个
      prev.next = prev.next.next
    }
    this.count--
  }
}

// 测试代码
const l = new LinkedList()
l.addAtTail('a')
l.addAtTail('b')
l.addAtTail('c') 
```

```js 环路检测
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    if (head === null || head.next === null) {
      return null
    }
    // 声明快慢指针
    let slow = head
    let fast = head

    while (fast !== null) {
      // 慢每次指针移动一位
      slow = slow.next
      // 如果满足条件，说明 fast 为尾部结点，不存在环
      if (fast.next === null) {
        return null
      }
      // 快指针每次移动两位
      fast = fast.next.next

      // 检测是否有环
      if (fast === slow) {
        // 找到环的起点位置
        let ptr = head
        while (ptr !== slow) {
          ptr = ptr.next
          slow = slow.next
        }
        // ptr 和 slow 的交点就是环的起始节点
        return ptr
      }
    }
    // while 结束，说明 fast 为 null，说明链表没有环
    return null
};
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
var f = new Node('f');

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

深度优先搜索：适合探索未知
```js
function Node(value) {
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

function deepSearch(root, target) {
    if (root == null) return false;
    if (root.value == target) return true;
    var left = deepSearch(root.left, target);
    var right = deepSearch(root.right, target);
    return left || right;
}
deepSearch(a, 'f')
deepSearch(a, 'n')
// 对于二叉树来说，深度优先搜索和前序遍历的顺序是一样的
```

广度优先搜索：适合探索局域
```js
function Node(value) {
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

function scopeSearch(rootList, target) {
    if (rootList == null || rootList.length == 0) return false;
    var childList = []; // 当前层所有子节点的节点
    for (var i = 0; i < rootList.length; i++) {
        if (rootList[i] != null && rootList[i].value == target) {
            return true
        } else {
            childList.push(rootList[i].left)
            childList.push(rootList[i].right)
        }
    }
    return scopeSearch(childList, target)
}
scopeSearch([a], 'f')
scopeSearch([a], 'n')
// 对于二叉树来说，深度优先搜索和前序遍历的顺序是一样的
```

二叉树的比较
```js
function Node(value) {
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

function Node1(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}
var a1 = new Node('a')
var b1 = new Node('b')
var c1 = new Node('c')
var d1 = new Node('d')
var e1 = new Node('e')
var f1 = new Node('f')
var g1 = new Node('g')

a1.left = c1;
a1.right = b1;
c1.left = f1;
c1.right = g1;
b1.left = d1;
b1.right = e1;

function compareTree(root1, root2) {
    if(root1 == root2) return true;
    if(
        root1 == null
        && root2 != null
        || root2 == null
        && root1 != null
    ) return false
    if (root1.value != root2.value) return false;
    var leftBool = compareTree(root1.left, root2.left); //判断左子树是否相等
    var rightBool = compareTree(root1.right, root2.right) // 判断右子树是否相等
    return leftBool && rightBool;
}
compareTree(a, a1)
```

二叉树的diff算法
```js
// 新增，修改，删除
// {type: '新增', origin: null, now: c2}
// {type: '修改', origin: c1, now: c2}
// {type: '删除', origin: c2, now: null}
var diffList = [];
function diffTree(root1, root2, diffList) { // root1修改前，root2修改后
    if(root1 == root2) return diffList;
    if(root1 == null && root2 != null) { // 新增了节点
      diffList.push({type: '新增'， origin: null, now: root2})
    } else if (root1 != null && root2 == null) { // 删除了节点
      diffList.push({type: '删除', origin: root1, now: null})
    } else if (root1.value != root2.value) {
      diffList.push({type: '修改', origin: root1, now: root2})
      // 当前节点修改了不代表所有子节点都修改了
      diffTree(root1.left, root2.left, diffList)
      diffTree(root1.right, root2.right, diffList)
    } else {
        diffTree(root1.left, root2.left, diffList)
        diffTree(root1.right, root2.right, diffList)
    }
    
}
diffTree(a1, a2, diffList)
console.log(diffList)
```

最小生成树 - 有向无环图 - 普里姆算法(加点法) - 克鲁斯卡尔算法(加边法)
```js
// 普里姆算法(加点法)
var max = 10000
function Node(value) {
  this.value = value;
  this.neighbor = [];
}
var pointSet = [new Node('A'), new Node('B'), new Node('C'), new Node('D'), new Node('E')]
var distance = [
  [0, 4, 7, max, max],
  [4, 0, 8, 6, max],
  [7, 8, 0, 5, max],
  [max, 6, 5, 0, 7],
  [max, max, max, 7, 0],
]
function getIndex(str) {
  for (var i = 0; i < pointSet.length; i++) {
    if (str == pointSet[i].value) return i;
  }
  return -1
}
// 需要传入点的集合，边的集合，当前已经连接进入的集合
// 根据已有的点来判断，获取距离最短的点
function getMinDisNode(pointSet, distance, nowPointSet) {
  var fromNode = null; //线段起点
  var minDisNode = null; //线段终点
  var minDis = max;
  // 根据当前已有的这些点为起点，以此判断连接其他的点的距离是多少
  for (var i = 0; i < nowPointSet.length; i++) {
    var nowPointIndex = getIndex(nowPointSet[i].value)//获取当前节点的序号
    for (var j = 0; j < distance[nowPointIndex].length; j++) {
      var thisNode = pointSet[j]; //thisNode是distance的点但不是对象
      if (nowPointSet.indexOf(thisNode) < 0
        && distance[nowPointIndex][j] < minDis) { // 这个点不能是接入的点 && 点之间的距离是目前最短的
        fromNode = nowPointSet[i];
        minDisNode = thisNode;
        minDis = distance[nowPointIndex][j];
      }
    }
  }
  fromNode.neighbor.push(minDisNode)
  minDisNode.neighbor.push(fromNode)
  return minDisNode
}
function prim(pointSet, distance, start) {
  var nowPointSet = []
  nowPointSet.push(start)
  // 获取最小代价的边
  while (true) {
    var minDisNode = getMinDisNode(pointSet, distance, nowPointSet)
    nowPointSet.push(minDisNode);
    if (nowPointSet.length == pointSet.length) {
      break;
    }
  }
}
prim(pointSet, distance, pointSet[2])
console.log(pointSet)
```
```js
// 克鲁斯卡尔算法(加边法)
var max = 10000
function Node(value) {
  this.value = value;
  this.neighbor = [];
}
var pointSet = [new Node('A'), new Node('B'), new Node('C'), new Node('D'), new Node('E')]
var distance = [
  [0, 4, 7, max, max],
  [4, 0, 8, 6, max],
  [7, 8, 0, 5, max],
  [max, 6, 5, 0, 7],
  [max, max, max, 7, 0],
]
function canLink(resultList, tempBegin, tempEnd) {
    var beginIn = null;
    var endIn = null;
    for (var i = 0; i < resultList.length; i++) {
        if (resultList[i].indexOf(tempBegin) > -1) {
            beginIn = resultList[i]
        }
        if (resultList[i].indexOf(tempEnd) > -1) {
            endIn = resultList[i]
        }
    }
    // 两个点都是新的点--可以连接，产生新的部落
    // 。。
    if (beginIn != null && endIn != null && beginIn == endIn) {
        return false
    }
    return true
}
function link(resultList, tempBegin, tempEnd) {
// var beginIn = null;
//     var endIn = null;
//     for (var i = 0; i < resultList.length; i++) {
//         if (resultList[i].indexOf(tempBegin) > -1) {
//             beginIn = resultList[i]
//         }
//         if (resultList[i].indexOf(tempEnd) > -1) {
//             endIn = resultList[i]
//         }
//     }
//     if (beginIn != null && endIn != null) {
//         var newArr = [];
//         newArr.push(tempBegin)
//         newArr.push(tempEnd) 
//     }
}
function kruskal(pointSet, distance) {
    var resultList = [];
    while(true) {
        var minDis = max;
        var begin = null;
        var end = null;
        for(var i = 0; i < distance.length; i++) {
            for(var j = 0; j < distance.length; j++) {
              var tempBegin = pointSet[i];
              var tempEnd = pointSet[j];
              if(i!=j  // 去掉自己到自己的距离
              && distance[i][j] < minDis && canLink(resultList, tempBegin, tempEnd)) {
                  minDis = distance[i][j];
                  begin = tempBegin
                  end = tempEnd
              }
            }
        }
        link(resultList, begin, end)
        if (resultList.length == 1
        && resultList.get(0).length == pointSet.length) {
            break;
        }
    }
}
```

二叉搜索树
```js
var arr = [];
for(var i = 0; i < 10000; i ++) {
    arr[i] = Math.floor(Math.random()*10000)
}
function Node(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}
function addNode(root, num) {
    if (root == null) return;
    if (root.value == num) return;
    if(root.value < num) { // 目标值比当前节点大
      if(root.right == null) {
          root.right = new Node(num); // 如果右侧为空，则创建节点
      } else {
          addNode(root.right, num) // 如果右侧不为空则向右递归
      }
    } else {
        if(root.left == null) {
          root.left = new Node(num); 
      } else {
          addNode(root.left, num) 
      }
    }
}
function buildSearchTree(arr) {
    if(arr == null || arr.length == 0) return null;
    var root = new Node(arr[0]);
    for (var i = 0; i< arr.length; i ++) {
        addNode(root, arr[i])
    }
    return root
}
function searchByTree(root, target) {
    if (root == null) return false;
    if(root.value == target) return true;
    if(root.value > target) {
        return searchByTree(root.left, target)
    } else {
        return searchByTree(root.right, target)
    }
}
console.log(searchByTree(buildSearchTree(arr)， 1000))
```

二叉平衡搜索树
- 根节点的左子树与右子树的高度差不能超过1
- 这颗二叉树的每个子树都符合第一条
```js
function getDeep(root) {
    if(root == null) return 0;
    var leftDeep = getDeep(root.left);
    var rightDeep = getDeep(root.right);
    return Math.max(leftDeep, rightDeep) + 1;
}
function isBalance(root) {
    if (root == null) return true;
    var leftDeep = getDeep(root.left)
    var rightDeep = getDeep(root.right);
    if(Math.abs(leftDeep - rightDeep) > 1) { // 不平衡
      return false
    } else {
        return isBalance(root.left) && isBalance(root.right)
    }
}
```

二叉树的单旋（左单旋，右单旋）
某一节点不平衡
如果左边浅，右边深，进行左单旋

左单旋时：
旋转节点：当前不平衡的节点
新根：右子树的根节点
变化分支：旋转节点的右子树的左子树
不变分支：旋转节点的右子树的右子树

右单旋时：
旋转节点：当前不平衡的节点
新根：左子树的根节点
变化分支：旋转节点的左子树的右子树
不变分支：旋转节点的右子树的左子树

二叉树的双旋（左右双旋。右左双旋）

左左双旋 右右双旋

234树（多叉，度为4）

红黑树
1. 节点是红色或黑色
2. 根节点是黑色
3. 每个红色节点的两个子节点都是黑色
4. 从任一节点到其每个叶子的所有路径都包含相同数目的黑色节点

树的深度优先搜索
```js
function Node(value) {
  this.value = value;
  this.childs = [];
}
var a = new Node('a');
var b = new Node('b');
var c = new Node('c');
var d = new Node('d');
var e = new Node('e');
var f = new Node('f');

a.childs.push(c)
a.childs.push(f)
a.childs.push(b)
b.childs.push(d)
b.childs.push(e)

// 树的深度优先搜索
function deepSearch(root, target) {
    if(root == null) return false;
    if(root.value == target) return true;
    var result = false;
    for(var i = 0; i < root.childs.length; i ++) {
       result |= deepSearch(root.childs[i], target);
    }
    return result
}
deepSearch(a, 'c')

// 树的广度优先搜索
function bfs(roots, target) {
  if(roots == null || roots.lenght == 0) return;
  var childs = []
  for(var i = 0; i < roots.length; i++) {
      if (roots[i].value == target) {
          return true
      } else {
          childs = childs.concat(roots[i].childs)
      } 
  }
  return bfs(childs, target)
}
bfs([a], "c")
bfs([a], "n")
```

动态规划-斐波那契数列
```js
// 斐波那契数列  0、1、1、2、3、5、8、13、21...
function fibo(n) {
    if(n <= 0) return -1;
    if(n == 1) return 0;
    if(n == 2) return 1;
    var a = 0;
    var b = 1;
    var c = null;
    for(var i = 3; i <= n; i ++) {
        c = a+b;
        a = b;
        b = c
    }
    return c
}
console.log(fibo(3))

// f(n) = f(n-1) + f(n-2)
function fibo2(n){
    if(n <= 0) return -1;
    if(n == 1) return 0;
    if(n == 2) return 1;
    return fibo2(n-1) + fibo2(n-2);
}
console.log(fibo(7))

```

```js
// 青蛙跳台 一个青蛙一次只能跳一级台阶或者两级台阶
// 问青蛙跳上n级台阶有多少种情况 
function fibo2(n){
    if(n <= 0) return -1;
    if(n == 1) return 1;
    if(n == 2) return 2;
    return fibo2(n-1) + fibo2(n-2);
}

// 变态青蛙跳台阶
// 这只青蛙可以一次跳1级，2级，n级
function jump(n) {
    if(n <= 0) return -1;
    if(n == 1) return 1;
    if(n == 2) return 2;
    var result = 0;
    for(var i = 1; i < n; i ++) {
        result +=jump(n - i);
    }
    return result + 1; // +1是从0级直接跳上去的情况
}

```