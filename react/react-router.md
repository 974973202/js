### react Router
1. react-router: 路由核心库，包含诸多路由功能相关的核心代码
2. react-router-dom: 利用路由核心库，结合实际的页面，实现跟页面路由密切相关的功能

如果是在页面中实现路由，需要安装react-router-dom

### Hash Router 哈希路由
- hash 的变化，不会导致页面刷新
- 兼容性最好

### Borswer History Router 浏览器历史记录路由
- H5新增的history Api 不刷新页面
1. pushState
2. replaceState

### Router组件
不做任何展示，仅提供路由模式配置，另外该组件上下文会提供一些实用的对象和方法，供其他相关组件使用

1. HashRouter：该组件，使用hash模式匹配
2. BorwserRouter: 使用BorwserRouter模式匹配

### Route组件
根据不同的组件，展示不同的内容
```js
path=""
sensitive  // true/false 区分路由大小写
component={A}
exact // 精确匹配
```

### Switch组件
包裹Router组件 匹配到一个就不再匹配

### 路由信息
- Router组件会创建一个上下文，并且，向上下文中注入一些信息

- 该上下文对开发者是隐藏的，Route组件若匹配到了地址，则会将这些上下文中的信息作为属性传入对应的组件

#### history
它并不是window.history对象，我们利用该对象无刷新跳转地址

- 为什么没有直接使用history对象

React-Router中有两种模式：Hash、History，如果直接使用window.history，只能支持一种模式
当使用windows.history.pushState方法时，没有办法收到任何通知，将导致React无法知晓地址发生了变化，结果导致无法重新渲染组件
push：将某个新的地址入栈（历史记录栈）
参数1：新的地址
参数2：可选，附带的状态数据
replace：将某个新的地址替换掉当前栈中的地址
go: 与window.history一致
forward: 与window.history一致
back: 与window.history一致

- location
与history.location完全一致，是同一个对象，但是，与window.location不同

location对象中记录了当前地址的相关信息

我们通常使用第三方库query-string，用于解析地址栏中的数据

- match
该对象中保存了，路由匹配的相关信息

isExact：事实上，当前的路径和路由配置的路径是否是精确匹配的
params：获取路径规则中对应的数据
实际上，在书写Route组件的path属性时，可以书写一个string pattern（字符串正则）

react-router使用了第三方库：Path-to-RegExp，该库的作用是，将一个字符串正则转换成一个真正的正则表达式。

* 向某个页面传递数据的方式：

使用state：在push页面时，加入state
利用search：把数据填写到地址栏中的？后
利用hash：把数据填写到hash后
params：把数据填写到路径中
- 非路由组件获取路由信息
某些组件，并没有直接放到Route中，而是嵌套在其他普通组件中，因此，它的props中没有路由信息，如果这些组件需要获取到路由信息，可以使用下面两种方式：

将路由信息从父组件一层一层传递到子组件
使用react-router提供的高阶组件withRouter，包装要使用的组件，该高阶组件会返回一个新组件，新组件将向提供的组件注入路由信息。

### 路由信息
Router组件会创建一个上下文，并且，向上下文中注入一些信息

该上下文对开发者是隐藏的，Route组件若匹配到了地址，则会将这些上下文中的信息作为属性传入对应的组件

### history
它并不是window.history对象，我们利用该对象无刷新跳转地址

**为什么没有直接使用history对象**
1. React-Router中有两种模式：Hash、History，如果直接使用window.history，只能支持一种模式
2. 当使用windows.history.pushState方法时，没有办法收到任何通知，将导致React无法知晓地址发生了变化，结果导致无法重新渲染组件

- push：将某个新的地址入栈（历史记录栈）
  - 参数1：新的地址
  - 参数2：可选，附带的状态数据
- replace：将某个新的地址替换掉当前栈中的地址
- go: 与window.history一致
- forward: 与window.history一致
- back: 与window.history一致

### location
与history.location完全一致，是同一个对象，但是，与window.location不同

location对象中记录了当前地址的相关信息

我们通常使用第三方库```query-string```，用于解析地址栏中的数据

### match
该对象中保存了，路由匹配的相关信息
- isExact：事实上，当前的路径和路由配置的路径是否是精确匹配的
- params：获取路径规则中对应的数据

实际上，在书写Route组件的path属性时，可以书写一个```string pattern```（字符串正则）

react-router使用了第三方库：Path-to-RegExp，该库的作用是，将一个字符串正则转换成一个真正的正则表达式。
  
**向某个页面传递数据的方式：**

1. 使用state：在push页面时，加入state
2. **利用search：把数据填写到地址栏中的？后**
3. 利用hash：把数据填写到hash后
4. **params：把数据填写到路径中**

### 非路由组件获取路由信息

某些组件，并没有直接放到Route中，而是嵌套在其他普通组件中，因此，它的props中没有路由信息，如果这些组件需要获取到路由信息，可以使用下面两种方式：

1. 将路由信息从父组件一层一层传递到子组件
2. 使用react-router提供的高阶组件withRouter，包装要使用的组件，该高阶组件会返回一个新组件，新组件将向提供的组件注入路由信息。
```js
在Route组件中的path属性中定义路径参数
在组件内通过useParams hook访问路径参数
<BrowserRouter>
    <Routes>
        <Route path='/foo/:id' element={Foo} />
    </Routes>
</BrowserRouter>
​
import { useParams } from 'react-router-dom';
export default function Foo(){
    const params = useParams();
    return (
        <div>
            <h1>{params.id}</h1>
        </div>
    )
}
// 在以前版本中，组件的props会包含一个match对象，在其中可以取到路径参数。但在最新的6.x版本中，无法从props获取参数。

// 并且，针对类组件的withRouter高阶组件已被移除。因此对于类组件来说，使用参数有两种兼容方法：

// 将类组件改写为函数组件
// 字节写一个HOC来包裹类组件，用useParams获取参数后通过props传入原本的类组件
```