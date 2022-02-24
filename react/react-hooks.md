### State Hook

State Hook 是一个在函数组件中使用的函数（useState），用于在函数组件中使用状态

useState

- 函数有一个参数，这个参数的值表示状态的默认值
- 函数的返回值是一个数组，该数组一定包含两项
  - 第一项：当前状态的值
  - 第二项：改变状态的函数

一个函数组件中可以有多个状态，这种做法非常有利于横向切分关注点。

**注意的细节**

1. useState 最好写到函数的起始位置，便于阅读
2. useState 严禁出现在代码块（判断、循环）中
3. useState 返回的函数（数组的第二项），引用不变（节约内存空间）
4. 使用函数改变数据，若数据和之前的数据完全相等（使用 Object.is 比较），不会导致重新渲染，以达到优化效率的目的。
5. 使用函数改变数据，传入的值不会和原来的数据进行合并，而是直接替换。
6. 如果要实现强制刷新组件
   1. 类组件：使用 forceUpdate 函数
   2. 函数组件：使用一个空对象的 useState
   ```js
   import React, { useState } from "react";
   // import React, { Component } from 'react'
   // export default class App extends Component {
   //     render() {
   //         return (
   //             <div>
   //                 <button onClick={()=>{
   //                     //不会运行shouldComponentUpdate
   //                     this.forceUpdate();//强制重新渲染
   //                 }}>强制刷新</button>
   //             </div>
   //         )
   //     }
   // }
   export default function App() {
     console.log("App Render");
     const [, forceUpdate] = useState({});
     return (
       <div>
         <p>
           <button
             onClick={() => {
               forceUpdate({});
             }}
           >
             强制刷新
           </button>
         </p>
       </div>
     );
   }
   ```
7. **如果某些状态之间没有必然的联系，应该分化为不同的状态，而不要合并成一个对象**
8. 和类组件的状态一样，函数组件中改变状态可能是异步的（在 DOM 事件中），多个状态变化会合并以提高效率，此时，不能信任之前的状态，而应该使用回调函数的方式改变状态。如果状态变化要使用到之前的状态，尽量传递函数。

### Effect Hook

Effect Hook：用于在函数组件中处理副作用

```js
// 挂载与更新执行
useEffect(()=>{})

// 卸载与更新执行
useEffect(() => {
  //...
  return () => {}
})

// 挂载特定更新执行
useEffect(() => {}, [])
```

副作用：

1. ajax 请求
2. 计时器
3. 其他异步操作
4. 更改真实 DOM 对象
5. 本地存储
6. 其他会对外部产生影响的操作

函数：useEffect，该函数接收一个函数作为参数，接收的函数就是需要进行副作用操作的函数

**细节**

1. 副作用函数的运行时间点，是在页面完成真实的 UI 渲染之后。因此它的执行是异步的，并且不会阻塞浏览器
   1. 与类组件中 componentDidMount 和 componentDidUpdate 的区别
   2. componentDidMount 和 componentDidUpdate，更改了真实 DOM，但是用户还没有看到 UI 更新，同步的。
   3. useEffect 中的副作用函数，更改了真实 DOM，并且用户已经看到了 UI 更新，异步的。
2. 每个函数组件中，可以多次使用 useEffect，但不要放入判断或循环等代码块中。
3. useEffect 中的副作用函数，可以有返回值，返回值必须是一个函数，该函数叫做清理函数
   1. 该函数运行时间点，在每次运行副作用函数之前
   2. 首次渲染组件不会运行
   3. 组件被销毁时一定会运行
4. useEffect 函数，可以传递第二个参数
   1. 第二个参数是一个数组
   2. 数组中记录该副作用的依赖数据
   3. 当组件重新渲染后，只有依赖数据与上一次不一样的时，才会执行副作用
   4. 所以，当传递了依赖数据之后，如果数据没有发生变化
      1. 副作用函数仅在第一次渲染后运行
      2. 清理函数仅在卸载组件后运行
5. 副作用函数中，如果使用了函数上下文中的变量，则由于闭包的影响，会导致副作用函数中变量不会实时变化。
6. 副作用函数在每次注册时，会覆盖掉之前的副作用函数，因此，尽量保持副作用函数稳定，否则控制起来会比较复杂。

### 自定义 Hook

State Hook： useState
Effect Hook：useEffect

自定义 Hook：将一些常用的、跨越多个组件的 Hook 功能，抽离出去形成一个函数，该函数就是自定义 Hook，自定义 Hook，由于其内部需要使用 Hook 功能，所以它本身也需要按照 Hook 的规则实现：

1. 函数名必须以 use 开头
2. 调用自定义 Hook 函数时，应该放到顶层

例如：

1. 很多组件都需要在第一次加载完成后，获取所有学生数据
2. 很多组件都需要在第一次加载完成后，启动一个计时器，然后在组件销毁时卸载

> 使用 Hook 的时候，如果没有严格按照 Hook 的规则进行，eslint 的一个插件（eslint-plugin-react-hooks）会报出警告

### react 少见写法

```js
import { useEffect, useState } from "react";
import { getAllStudents } from "../services/student";
/**
 * 组件首次渲染后，启动一个Interval计时器
 * 组件卸载后，清除该计时器
 */
export default (func, duration) => {
  useEffect(() => {
    const timer = setInterval(func, duration);
    return () => {
      clearInterval(timer);
    };
  }, []);
};
/**
 * 当组件首次加载完成后，获取所有学生数据
 */
export default function useAllStudents() {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    (async () => {
      const stus = await getAllStudents();
      setStudents(stus);
    })();
  }, []);
  return students;
}
// ---------------------
import React from "react";
import { getAllStudents } from "./services/student";

class AllStudents extends React.Component {
  state = {
    stus: [],
  };

  async componentDidMount() {
    const stus = await getAllStudents();
    this.setState({
      stus,
    });
  }

  render() {
    if (typeof this.props.render === "function") {
      return this.props.render(this.state.stus);
    }
    return null;
  }
}

function Test(props) {
  const list = props.stus.map((it) => <li key={it.id}>{it.name}</li>);
  return <ul>{list}</ul>;
}

export default function App() {
  return (
    <div>
      <AllStudents render={(stus) => <Test stus={stus} />} />
    </div>
  );
}
// -----------------------
import React from "react";
import useAllStudents from "./myHooks/useAllStudents";

function Test() {
  const stus = useAllStudents();
  const list = stus.map((it) => <li key={it.id}>{it.name}</li>);
  return <ul>{list}</ul>;
}

export default function App() {
  return (
    <div>
      <Test />
    </div>
  );
}
```

### useReducer

```js
// useReducer.js
import React from "react";
import useReducer from "./useReducer";
/**
 * useReducer函数
 * @param {function} reducer reducer函数，标准格式
 * @param {any} initialState 初始状态
 * @param {function} initFunc 用于计算初始值的函数
 */
export default function useReducer(reducer, initialState, initFunc) {
  const [state, setState] = useState(
    initFunc ? initFunc(initialState) : initialState
  );

  function dispatch(action) {
    const newState = reducer(state, action);
    console.log(`日志：n的值  ${state}->${newState}`);
    setState(newState);
  }

  return [state, dispatch];
}
// ---------------
import React, { useReducer } from "react";
// import useReducer from "./useReducer"
/**
 * 该函数，根据当前的数据，已经action，生成一个新的数据
 * @param {*} state
 * @param {*} action
 */
function reducer(state, action) {
  switch (action.type) {
    case "increase":
      return state + 1;
    case "decrease":
      if (state === 0) {
        return 0;
      }
      return state - 1;
    default:
      return state;
  }
}

export default function App() {
  const [n, dispatch] = useReducer(reducer, 10, (args) => {
    console.log(args); // 10
    return 100;
  });
  return (
    <div>
      <button
        onClick={() => {
          dispatch({ type: "decrease" });
        }}
      >
        -
      </button>
      <span>{n}</span>
      <button
        onClick={() => {
          dispatch({ type: "increase" });
        }}
      >
        +
      </button>
    </div>
  );
}
```

### useCallback  返回缓存的函数 (不是固定的)

用于得到一个固定引用值的函数，通常用它进行性能优化
useCallback:
该函数有两个参数：

1. 函数，useCallback 会固定该函数的引用，只要依赖项没有发生变化，则始终返回之前函数的地址
2. 数组，记录依赖项

该函数返回：引用相对固定的函数地址

```js
import React, { useState, useCallback } from "react";

class Test extends React.PureComponent {
  render() {
    console.log("Test Render");
    return (
      <div>
        <h1>{this.props.text}</h1>
        <button onClick={this.props.onClick}>改变文本</button>
      </div>
    );
  }
}

function Parent() {
  console.log("Parent Render");
  const [txt, setTxt] = useState(1);
  const [n, setN] = useState(0);
  // const handleClick = useCallback(() => {
  //   setTxt(txt + 1);
  // }, [txt]);
  const handleClick = () => {
    setTxt(txt + 1);
  });

  return (
    <div>
      {/* 函数的地址每次渲染都发生了变化，导致了子组件跟着重新渲染，若子组件是经过优化的组件，则可能导致优化失效 */}
      <Test text={txt} onClick={handleClick} />
      <input
        type="number"
        value={n}
        onChange={(e) => {
          setN(parseInt(e.target.value));
        }}
      />
    </div>
  );
}
```

### useMemo  返回缓存的变量  (不是固定的)

- 和 useCallBack 类似，但是用途更广，且**必须有返回**值
- 用于保持一些比较稳定的数据，通常用于性能优化
**如果React元素本身的引用没有发生变化，一定不会重新渲染**
```js
// 事例
const list = useMemo(() => {
  const list = [];
  for (let i = range.min; i <= range.max; i++) {
    list.push(<Item key={i} value={i}></Item>);
  }
  return list;
}, [range.min, range.max]);
```

### ImperativeHandle Hook
让父组件拿到子组件返回的值
例： APP拿到Test组件返回的method方法

- 函数：useImperativeHandleHook
```js
import React, { useRef, useImperativeHandle } from 'react'

function Test(props, ref) {
    useImperativeHandle(ref, () => {
        //如果不给依赖项，则每次运行函数组件都会调用该方法
        //如果使用了依赖项，则第一次调用后，会进行缓存，只有依赖项发生变化时才会重新调用函数
        //相当于给 ref.current = 1
        return {
            method(){
                console.log("Test Component Called")
            }
        }
    }, [])
    return <h1>Test Component</h1>
}

// 函数组件包裹成类组件
const TestWrapper = React.forwardRef(Test)

export default function App() {
    // const [, forceUpdate] = useState({})
    const testRef = useRef();
    return (
        <div>
            <TestWrapper ref={testRef} />
            <button onClick={() => {
                testRef.current.method();
                // console.log(testRef)
                // forceUpdate({})
            }}>点击调用Test组件的method方法</button>
        </div>
    )
}
```

### useRef
使用useRef修改数据不会出发render
useRef可以保存状态  const ref = useRef(100)

createRef


### useLayoutEffect
- useEffect：浏览器渲染完成后，用户看到新的渲染结果之后
- useLayoutEffectHook  DOM加载完成还未渲染

- 应该尽量使用useEffect，因为它不会导致渲染阻塞，如果出现了问题，再考虑使用useLayoutEffectHook

- useLayoutEffectHook的挂载更新快于useEffect


### React Hooks

- [ReactHooks 详解]https://juejin.im/post/5dbbdbd5f265da4d4b5fe57d
- [ReactHooksAPI]https://juejin.im/post/5e53d9116fb9a07c9070da44
