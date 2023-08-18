### 1. 两数之和
- 给定一个数组 nums 和一个目标值 target，在该数组中找出和为目标值的两个数
- 输入：nums: [8, 2, 6, 5, 4, 1, 3] ；target:7
- 输出：[2, 5]

```js
// 时间复杂度O(n)、 空间复杂度O(n)
function twoNumAdd(arr, target) {
  if (Array.isArray(arr)) {
    // 使用map将遍历过的数字存起来，空间换时间
    let map = {};
    for (let i = 0; i < arr.length; i++) {
      // 从map中查找是否有key 等于 target-nums[i]，如果有，则条件成立，返回结果
      if (map[target - arr[i]] !== undefined) {
        return [target - arr[i], arr[i]];
      } else {
        // 条件不成立，将该值存起来
        map[arr[i]] = i;
      }
    }
  }
  return [];
}
```

### 2. 三数之和
- 题目：给定一个数组nums，判断 nums 中是否存在三个元素a，b，c，使得 a + b + c = target，找出所有满足条件且不重复的三元组合
- 输入：nums: [5, 2, 1, 1, 3, 4, 6] ；target:8
- 输出：[[1, 1, 6], [1, 2, 5], [1, 3, 4]]
  
```js
// 用`双端指针`的方式，将三数之和转化为两数之和
function findThree(arr, target) {
  // 先将数组从小到大排序
  arr.sort();
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    // 跳过重复的arr[i]值, 比如[2, 1, 1],跳过第二个1
    if (i && arr[i] === arr[i - 1]) continue;
    let left = i + 1;
    let right = arr.length - 1;
    
    // 双端指针left、right
    while (left < right) {
      let sum = arr[i] + arr[left] + arr[right];
      if (sum > target) {
        right--;
      } else if (sum < target) {
        left++;
      } else {
        // 先取arr[left]，然后left++, 两步合成一步；arr[right--]同样的逻辑
        result.push([arr[i], arr[left++], arr[right--]]);
        while (arr[left] === arr[left - 1]) {
          // 跳过重复的arr[left]值,
          left++;
        }
        while (arr[right] === arr[right + 1]) {
          // 跳过重复的arr[right]值
          right--;
        }
      }
    }
  }
  return result;
}
```

### 3. 版本号排序
- 题目：输入一组版本号，输出从大到小的排序
- 输入：['2.1.0.1', '0.402.1', '10.2.1', '5.1.2', '1.0.4.5']
- 输出：['10.2.1', '5.1.2', '2.1.0.1', '1.0.4.5', '0.402.1']

```js
function versionSort(arr) {
  return arr.sort((a, b) => {
    let i = 0;
    const arr1 = a.split(".");
    const arr2 = b.split(".");
    while (true) {
      // 取出相同位置的数字
      const s1 = arr1[i];
      const s2 = arr2[i];
      i++;
      // 若s1 或 s2 不存在，说明相同的位置已比较完成，接下来比较arr1 与 arr2的长度，长的版本号大
      if (s1 === undefined || s2 === undefined) {
        return arr2.length - arr1.length;
      }
      if (s1 === s2) continue;
      // 比较相同位置的数字大小
      return s2 - s1;
    }
  });
}
```

### 4. 第一个不重复的字符  
- 题目：输入一个字符串，找到第一个不重复字符的下标
- 输入：'abcabcde'
- 输出：6

```js
// 时间复杂度O(n)、 空间复杂度O(n)
function findOneStr(str) {
  if (!str) return -1;
  // 使用map存储每个字符出现的次数
  let map = {};
  let arr = str.split("");
  arr.forEach(item => {
    let val = map[item];
    // val为undefined时，表示未存储，map[item] = 1；否则map[item] = val + 1
    map[item] = val ? val + 1 : 1;
  });
  // 再遍历一遍找到出现1次的下标
  for (let i = 0; i < arr.length; i++) {
    if (map[arr[i]] == 1) {
      return i;
    }
  }
  return -1;
}
```

### 5. 字符串所有排列组合
- 题目：输入一个字符串，打印出该字符串中，所有字符的排列组合
- 输入：'abc'
- 输出：['abc', 'acb', 'bca', 'bac', 'cab', 'cba']
  
```js
/**
 * 利用回溯算法，计算所有字符串的组合
 * @param {array} list - 字符串列表
 * @param {array} result - 最终的结果
 * @param {string} current - 当前的字符串
 * @param {string} temp - 当前固定的字符
*/
function stringGroup(list = [], result = [], current = "", temp = "") {
  current += temp;
  if (list.length === 0) {
    // 递归的出口，将对应结果添加到list中
    return result.push(current);
  }
  for (let i = 0; i < list.length; i++) {
    // 每次递归 固定第一个字符
    temp = list.shift();
    stringGroup(list, result, current, temp);
    // 将删除的temp重新添加到queue尾部，实现将数组反转的效果，如[a,b,c]反转为[c,b,a]
    list.push(temp);
  }
  // 这里去重是解决str中有重复的字母，比如str为'aacd'
  return [...new Set(result)];
}
```

### 6. 数组转成树
```js
function convert(arr, parentId = 0) {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parentId === parentId) {
            const children = convert(arr, arr[i].id)
            if (children.length > 0) {
                arr[i].children = children
            }
            result.push(arr[i])
        }
    }
    return result
}

function convert(arr, parentId = 0) {
  return arr
    .filter((item) => item.parentId === parentId)
    .map((item) => ({ ...item, children: convert(arr, item.id) }));
}

const arr = [
    { id: 1, name: '部门A', parentId: 0 },
    { id: 2, name: '部门B', parentId: 1 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 2 },
    { id: 5, name: '部门E', parentId: 2 },
    { id: 6, name: '部门F', parentId: 3 },
]

console.log(convert(arr))

```


### 7 - 9 列表转成树
```js
// 输入 [
//   { id: 1, title: "child1", parentId: 0 },
//   { id: 2, title: "child2", parentId: 0 },
//   { id: 3, title: "child1_1", parentId: 1 },
//   { id: 4, title: "child1_2", parentId: 1 },
//   { id: 5, title: "child2_1", parentId: 2 }
// ]

// 输出 [
//   {
//     "id": 1,
//     "title": "child1",
//     "parentId": 0,
//     "children": [
//       {
//         "id": 3,
//         "title": "child1_1",
//         "parentId": 1
//       },
//       {
//         "id": 4,
//         "title": "child1_2",
//         "parentId": 1
//       }
//     ]
//   },
//   {
//     "id": 2,
//     "title": "child2",
//     "parentId": 0,
//     "children": [
//       {
//         "id": 5,
//         "title": "child2_1",
//         "parentId": 2
//       }
//     ]
//   }
// ]

// 深度优先遍历
// 递归版本
function deepTree(tree, arr = []) {
  if (!tree || !tree.length) return arr;
  tree.forEach(data => {
    arr.push(data.id);
    // 遍历子树
    data.children && deepTree(data.children, arr);
  });
  return arr;
}

// 非递归版本
function deepTree(tree) {
  if (!tree || !tree.length) return;
  let arr = [];
  let stack = [];
  //先将第一层节点放入栈
  for (let i = 0, len = tree.length; i < len; i++) {
    stack.push(tree[i]);
  }
  let node;
  while (stack.length) {
    // 获取当前第一个节点
    node = stack.shift();
    arr.push(node.id);
    //如果该节点有子节点，继续添加进入栈顶
    if (node.children && node.children.length) {
      stack = node.children.concat(stack);
    }
  }
  return arr;
}

// 广度优先遍历
function rangeTree(tree) {
  if (!tree || !tree.length) return;
  let arr = [];
  let node, list = [...tree];
  // 取出当前节点
  while ((node = list.shift())) {
    arr.push(node.id);
    node.children && list.push(...node.children);
  }
  return arr;
}

// 输入：tree：上文第11题生成的tree func：data => data.title === "child2_1"
// 输出：{ id: 5, parentId: 2, title: "child2_1" }
```

### 使用广度优先遍历将该对象转换为数组的代码：
```js
// 1. 常规循环
function convertToArray(obj) {
  let result = [];
  result.push({id: obj.id, name: obj.name});
  if (obj.children) {
    obj.children.forEach(child => {
      result = result.concat(convertToArray(child));
    });
  }
  return result;
}
// 2. 广度优先
// 我们使用一个队列来存储待处理的节点，从根节点开始将其加入队列中。然后，我们从队列中取出第一个节点并将其转换为包含_id_、_name_和_depth_属性的新对象，其中_depth_属性表示当前节点的深度。然后，我们将新对象添加到结果数组中。

// 接下来，我们检查该节点是否有_children_属性，如果有，则遍历每个_child_并将其添加到队列中，其中_depth_属性是当前节点的_depth_属性加1。

// 遍历完整个对象后，我们将结果数组返回。
const objToArray = (obj) => {
  const queue = [{ ...obj, depth: 0 }];
  const result = [];
  while (queue.length > 0) {
    const current = queue.shift();
    result.push({ id: current.id, name: current.name, depth: current.depth });
    if (current.children) {
      current.children.forEach(child => {
        queue.push({ ...child, depth: current.depth + 1 });
      });
    }
  }
  return result;
}

const obj = {
    id: 1,
    name: '部门A',
    children: [
        {
            id: 2,
            name: '部门B',
            children: [
                { id: 4, name: '部门D' },
                { id: 5, name: '部门E' }
            ]
        },
        {
            id: 3,
            name: '部门C',
            children: [{ id: 6, name: '部门F' }]
        }
    ]
}

const objArray = objToArray(obj);
console.log(objArray);
```


### 异步控制并发数
```js
function limitRequest(urls = [], limit = 3) {
  return new Promise((resolve, reject) => {
    const len = urls.length
    let count = 0

    // 同时启动limit个任务
    while (limit > 0) {
      start()
      limit -= 1
    }

    function start() {
      const url = urls.shift() // 从数组中拿取第一个任务
      if (url) {
        axios.post(url).then(res => {
          // todo
        }).catch(err => {
          // todo
        }).finally(() => {
          if (count == len - 1) {
            // 最后一个任务完成
            resolve()
          } else {
            // 完成之后，启动下一个任务
            count++
            start()
          }
        })
      }
    }

  })
}

// 测试
// limitRequest(['http://xxa', 'http://xxb', 'http://xxc', 'http://xxd', 'http://xxe'])
```


### 一个数组的全排列
```js
// 一个数组的全排列
var arr = [1, 2, 3];
//swap用来交换数组a中的两个元素
function swap(arr, p, q) {
  [arr[p], arr[q]] = [arr[q], arr[p]]
}

//全排列函数pai，在数组arr中，对p位置到q位置之间的元素进行全排列
function pai(arr, p, q) {
  if (p == q) {
    console.log(arr) //一个数的全排列就是自己，输出自己
  } else {
    for (let i = p; i < q; i++) {
      swap(arr, i, p);//把 arr 中的每个元素都作一次头元素
      pai(arr, p + 1, q);//对头元素后的数据再次递归实现全排列
      swap(arr, i, p);//排完之后要换回来，防止重复排列
    }
  }
}
pai(arr, 0, arr.length);
```

### 多叉树, 获取每一层的节点之和
```js
function layerSum(root) {
  if (root.children) {
    for (const item of root.children) {
      layerSum(item)
      root.value += item.value
    }
    return root.value
  }
  return root.value

}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] }
  ]
});

console.log(res);
```

### 特定数组按序合并
```js
// 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 
// 和 [A, B, C, D]，
// 合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]
let a1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let a2 = ['A', 'B', 'C', 'D'].map((item) => {
  return item + 3
})

let a3 = [...a1, ...a2].sort().map((item) => {
  if (item.includes('3')) {
    return item.split('')[0]
  }
  return item
})
```

### 滑动窗口最大值
```js
// 给定一个数组 nums，有一个大小为 k 的滑动窗口，从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口中的k个数字。滑动窗口每次只向右移动一位，求返回滑动窗口最大值
// nums: [1,3,-1,-3,5,3,6,7]； k: 3

function maxSlidingWindow(nums, k) {
  // window存储当前窗口中数据的下标
  const window = [];
  // result存储窗口中的最大值
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (i - window[0] > k - 1) {
      // 剔除窗口长度超出范围时左侧的最大值
      window.shift(); 
    }
    for (let j = window.length - 1; j >= 0; j--) {
      // 当前窗口的值依次和要插入的值做比较，如果小于要插入的值，剔除掉该值，直到window为空为止（保证window中最左侧的值为最大值）
      if (nums[window[j]] <= nums[i]) {
        window.pop();
      }
    }
    // 添加右侧新加入的值，插入新值时有两种情况：
    // 1、新值为最大值时，则window此时为空；
    // 2、新值不为最大值时，window已剔除掉比新值小的值
    window.push(i);
    if (i >= k - 1) {
      // 窗口是从0开始移动，当移动的距离大于等于目标范围后，以后再往后移动一次，就要写入当前窗口的最大值
      result.push(nums[window[0]]);
    }
  }
  return result;
}
```

### 买卖股票问题
- 题目：给定一个整数数组，其中第 i 个元素代表了第 i天的股票价格；非负整数 fee 代表了交易股票的手续费用，求返回获得利润的最大值
- 输入：arr: [1, 12, 13, 9, 15, 8, 6, 16]；fee: 2
- 输出：22
  
```js
/**
 * 贪心算法求解
 * @param {array} list - 股票每天的价格列表
 * @param {number} fee - 手续费
 * */
function buyStock(list, fee) {
  // min为当前的最小值，即买入点
  let min = list[0],
    sum = 0;
  for (let i = 1; i < list.length; i++) {
    // 从1开始，依次判断
    if (list[i] < min) {
      // 寻找数组的最小值
      min = list[i];
    } else {
      // 计算如果当天卖出是否赚钱
      let temp = list[i] - min - fee;
      if (temp > 0) {
        // 赚钱 存数据
        sum += temp;
        // 关键代码：重新计算min，分两种情况，如果后面继续涨，则默认继续持有；若后面跌，则以后面的价格重新买入
        min = list[i] - fee;
      }
    }
  }
  return sum;
}
```

### 最长递增子序列
- 题目：一个整数数组 nums，找到其中一组最长递增子序列的值
- 输入：[3,5,7,1,2,8]
- 输出：[3,5,7,8]

```js
function lengthOfLIS(nums) {
  if (!nums.length) return 0;
  // 创建一个和原数组等长的数组dp，用来存储每一项的最长递增子序列
  // 比如[1,2,2] 表示第二项和第三项的最长递增子序列都为2
  let dp = new Array(nums.length).fill(1);
  // 双层for循环，每一项都和之前的所有项一一进行比较，计算出该项的最长递增子序列个数，存储到dp中
  for (let i = 0; i < nums.length; i++) {
    // 当前项依次和之前的每一项进行比较，累加出当前项的最长递增子序列
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        // 比较当前项已有的最大值和之前项最大值，比如当比较到第三项[1,2,2]时，如第三项比第二项大，所以第三项的计算结果为[1,2,3]
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  // 取出一组最长递增子序列的具体值（注意：最长递增子序列有可能有多组值，这里是只取出其中一组值）
  // 找到dp中的最大值，该值就是nums的最长递增子序列的个数
  let max = Math.max(...dp);
  let result = [];
  for (let i = max; i >= 1; i--) {
    // 倒序遍历，根据长度获取对应的值
    findArrNode(dp, i, result, nums);
  }
  return result;
}
function findArrNode(dp, value, result, arr) {
  // 找到符合条件最后一项的下标，这样才能保证数组的顺序是正确的
  let index = dp.lastIndexOf(value);
  // 存储对应的值
  result.unshift(arr[index]);
  // 对dp进行截取，保证只取最大项之前的数据
  dp.length = index + 1;
}
```