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

```js
export const SelectOptions = [
  {
    name: '北京市',
    code: '110000',
    level: 1,
    children: [
      {
        name: '延庆区',
        code: '110119',
        parentCode: '110000',
        level: 3,
      },
      {
        name: '密云区',
        code: '110118',
        parentCode: '110000',
        level: 3,
      },
    ],
  },
  {
    name: '河北省',
    code: '130000',
    level: 1,
    children: [
      {
        name: '石家庄市',
        code: '130100',
        parentCode: '130000',
        level: 2,
        children: [
          {
            name: '长安区',
            code: '130102',
            parentCode: '130100',
            level: 3,
          },
          {
            name: '桥西区',
            code: '130104',
            parentCode: '130100',
            level: 3,
          },
        ],
      },
      {
        name: '唐山市',
        code: '130200',
        parentCode: '130000',
        level: 2,
        children: [
          {
            name: '路南区',
            code: '130202',
            parentCode: '130200',
            level: 3,
          },
          {
            name: '路北区',
            code: '130203',
            parentCode: '130200',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '湖北省',
    code: '420000',
    level: 1,
    children: [
      {
        name: '武汉市',
        parentCode: '420000',
        code: '420100',
        level: 2,
        children: [
          {
            name: '江岸区"',
            parentCode: '420100',
            code: '420102',
            level: 3,
          },
          {
            name: '东湖生态旅游风景区',
            parentCode: '420100',
            code: '42010001',
            level: 3,
          },
        ],
      },
      {
        name: '襄阳市',
        parentCode: '420000',
        code: '420600',
        level: 2,
        children: [
          {
            name: '襄阳高新技术产业开发区',
            parentCode: '420600',
            code: '42060001',
            level: 3,
          },
          {
            name: '襄城区',
            parentCode: '420600',
            code: '420602',
            level: 3,
          },
        ],
      },
      {
        name: '孝感市',
        parentCode: '420000',
        code: '420900',
        level: 2,
        children: [
          {
            name: '孝南区',
            parentCode: '420900',
            code: '420902',
            level: 3,
          },
          {
            name: '孝感高新技术产业开发区',
            parentCode: '420900',
            code: '42090001',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '湖北省copy',
    code: '4200001',
    level: 1,
    children: [
      {
        name: '武汉市copy',
        parentCode: '4200001',
        code: '4201001',
        level: 2,
        children: [
          {
            name: '江岸区copy',
            parentCode: '4201001',
            code: '4201021',
            level: 3,
          },
          {
            name: '东湖生态旅游风景区copy',
            parentCode: '4201001',
            code: '420100011',
            level: 3,
          },
        ],
      },
      {
        name: '襄阳市copy',
        parentCode: '4200001',
        code: '4206001',
        level: 2,
        children: [
          {
            name: '襄阳高新技术产业开发区copy',
            parentCode: '4206001',
            code: '420600011',
            level: 3,
          },
          {
            name: '襄城区copy',
            parentCode: '4206001',
            code: '4206021',
            level: 3,
          },
        ],
      },
      {
        name: '孝感市copy',
        parentCode: '4200001',
        code: '4209001',
        level: 2,
        children: [
          {
            name: '孝南区',
            parentCode: '4209001',
            code: '4209021',
            level: 3,
          },
          {
            name: '孝感高新技术产业开发区copy',
            parentCode: '4209001',
            code: '420900011',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '江苏省',
    code: '320000',
    level: 1,
    children: [
      {
        name: '南京市',
        parentCode: '320000',
        code: '320100',
        level: 2,
        children: [
          {
            name: '鼓楼区',
            parentCode: '320100',
            code: '320106',
            level: 3,
          },
          {
            name: '浦口区',
            parentCode: '320100',
            code: '320111',
            level: 3,
          },
        ],
      },
      {
        name: '徐州市',
        parentCode: '320000',
        code: '320300',
        level: 2,
        children: [
          {
            name: '鼓楼区',
            parentCode: '320300',
            code: '320302',
            level: 3,
          },
          {
            name: '云龙区',
            parentCode: '320300',
            code: '320303',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '湖南省',
    code: '430000',
    level: 1,
    children: [
      {
        name: '长沙市',
        parentCode: '430000',
        code: '430100',
        level: 2,
        children: [
          {
            name: '湖南湘江新区"',
            parentCode: '430100',
            code: '43010001',
            level: 3,
          },
          {
            name: '宁乡经济技术开发区',
            parentCode: '430100',
            code: '43010002',
            level: 3,
          },
        ],
      },
      {
        name: '株洲市',
        parentCode: '430000',
        code: '430200',
        level: 2,
        children: [
          {
            name: '株洲高新技术产业开发区',
            parentCode: '430200',
            code: '43020001',
            level: 3,
          },
          {
            name: '荷塘区',
            parentCode: '430200',
            code: '430202',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '广西壮族自治区',
    code: '450000',
    level: 1,
    children: [
      {
        name: '南宁市',
        parentCode: '450000',
        code: '450100',
        level: 2,
        children: [
          {
            name: '南宁高新技术产业开发区',
            parentCode: '450100',
            code: '45010001',
            level: 3,
          },
          {
            name: '南宁经济技术开发区',
            parentCode: '450100',
            code: '45010002',
            level: 3,
          },
        ],
      },
      {
        name: '柳州市',
        parentCode: '450000',
        code: '450200',
        level: 2,
        children: [
          {
            name: '城中区',
            parentCode: '450200',
            code: '450202',
            level: 3,
          },
          {
            name: '鱼峰区',
            parentCode: '450200',
            code: '450203',
            level: 3,
          },
          {
            name: '柳南区',
            parentCode: '450200',
            code: '450204',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    name: '境外',
    code: '990100',
    level: 1,
  },
];


function findData(list: any[], name: string, father?: any) {
    const itemText = list.find((item) => item.name === name);
    if (itemText) {
      newData = itemText;
      if (itemText.level > itemType) {
        itemType = itemText.level;
      }

      if (father) {
        father.children = father.children.filter((ele: any) => {
          if (ele) return ele.name === name;
        });
        newData = father;
      }
      if (father) findData(tree || [], father.name);

      if (itemText.level === itemType) {
        if (newData.level === 2) {
          itemType = 0;
          const newArrChild = newArr[newArr.length - 1];
          newArrChild.children.push(newData);
        }
        if (newData.level === 1) {
          itemType = 0;
          newArr.push(newData);
        }
      }
      return true;
    }

    // 找根下面有没有 children 二级结构
    for (const item of list) {
      if (Array.isArray(item.children) && item.name !== name) {
        findData(item.children, name, item);
      }
    }
  }
  findData(SelectOptions, name);
```