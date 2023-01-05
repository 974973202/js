### Vue3 带来的新变化 & 新特性总览
#### 在 API 特性方面：

- Composition API：可以更好的逻辑复用和代码组织，同一功能的代码不至于像以前一样太分散，虽然 Vue2 中可以用 minxin 来实现复用代码，但也存在问题，比如：方法或属性名会冲突、代码来源也不清楚等
- SFC Composition API语法糖：
 - Teleport传送门：可以让子组件能够在视觉上跳出父组件(如父组件overflow:hidden)
 - Fragments：支持多个根节点，Vue2 中，编写每个组件都需要一个父级标签进行包裹，而Vue3 不需要，内部会默认添加 Fragments；
 - SFC CSS变量：支持在 <style></style> 里使用 v-bind，给 CSS 绑定 JS 变量(color: v-bind(str))，且支持 JS 表达式 (需要用引号包裹起来)；
 - Suspense：可以在组件渲染之前的等待时间显示指定内容，比如loading；
 - v-memo：新增指令可以缓存 html 模板，比如 v-for 列表不会变化的就缓存，简单说就是用内存换时间

#### 在 框架 设计层面：

- 代码打包体积更小：许多Vue的API可以被Tree-Shaking，因为使用了es6module，tree-shaking 依赖于 es6模块的静态结构特性；
- 响应式 的优化：用 Proxy 代替 Object.defineProperty，可以监听到数组下标变化，及对象新增属性，因为监听的不是对象属性，而是对象本身，还可拦截 apply、has 等方法；
- 虚拟DOM的优化：保存静态节点直接复用(静态提升)、以及添加更新类型标记（patchflag）（动态绑定的元素）
 - 静态提升：静态提升就是不参与更新的静态节点，只会创建一次，在之后每次渲染的时候会不停的被复用；
 - 更新类型标记：在对比VNode的时候，只对比带有更新类型标记的节点，大大减少了对比Vnode时需要遍历的节点数量；还可以通过 flag 的信息得知当前节点需要对比的内容类型；
 - 优化的效果：Vue3的渲染效率不再和模板大小成正比，而是与模板中的动态节点数量成正比；
- Diff算法 的优化：Diff算法 使用 最长递增子序列 优化了对比流程，使得 虚拟DOM 生成速度提升 200%

#### 在 兼容性 方面：

- Vue3 不兼容 IE11，因为IE11不兼容Proxy

#### 其余 特点

- v-if的优先级高于v-for，不会再出现vue2的v-for，v-if混用问题；
- vue3中v-model可以以v-model:xxx的形式使用多次，而vue2中只能使用一次；多次绑定需要使用sync
- Vue3 用 TS 编写，使得对外暴露的 api 更容易结合 TypeScript。

### Vue3 响应式
#### Vue3 响应式的特点
- 众所周知 Vue2 数据响应式是通过 Object.defineProperty() 劫持各个属性 get 和 set，在数据变化时发布消息给订阅者，触发相应的监听回调，而这个API存在很多问题；
- Vue3 中为了解决这些问题，使用 Proxy结合Reflect代替Object.defineProperty，

 - 支持监听对象和数组的变化，
 - 对象嵌套属性只代理第一层，运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能取得很大进步；
 - 并且能拦截对象13种方法，动态属性增删都可以拦截，新增数据结构全部支持，

- Vue3 提供了 ref 和 reactive 两个API来实现响应式；

#### 什么是Proxy
- Proxy是ES6中的方法，Proxy用于创建一个目标对象的代理，在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，这样我们可以不直接操作对象本身，而是通过操作对象的代理对象来间接来操作对象；
- defineProperty 和 Proxy 的区别

 - Object.defineProperty 是 Es5 的方法，Proxy 是 Es6 的方法
 - defineProperty 是劫持对象属性，Proxy 是代理整个对象；
 - defineProperty 监听对象和数组时，需要迭代对象的每个属性；
 - defineProperty 不兼容 IE8，Proxy 不兼容 IE11
 - defineProperty 不支持 Map、Set 等数据结构
 - defineProperty 只能监听 get、set，而 Proxy 可以拦截多达13种方法；
 - Proxy 兼容性相对较差，且无法通过 pollyfill 解决；所以Vue3不支持IE；

#### 为什么需要 Reflect

 - 使用 Reflect 可以修正 Proxy 的this指向问题
 - Proxy 的一些方法要求返回 true/false 来表示操作是否成功，比如set方法，这也和 Reflect 相对应；
 - 之前的诸多接口都定义在 Object 上，历史问题导致这些接口越来越多越杂，所以干脆都挪到 Reflect 新接口上，目前是13种标准行为，可以预期后续新增的接口也会放在这里；

#### Vue3 响应式对数组的处理
- Vue2 对数组的监听做了特殊的处理，在 Vue3 中也需要对数组做特殊的处理
- Vue3 对数组实现代理时，也对数组原型上的一些方法进行了重写

- 原因：
  - 比如使用 push、pop、shift、unshift、splice这些方法操作响应式数组对象时，会隐式地访问和修改数组的length属性，所以我们需要让这些方法间接读取length属性时禁止进行依赖追踪
  - 还比如使用 includes、indexOf 等对数组元素进行查找时，可能是使用代理对象进查找，也可能使用原始值进行查找，所以就需要重写查找方法，让查找时先去响应式对象中查找，没找到再去原始值中查找

#### Proxy 只会代理对象的第一层，Vue3 如何处理
- 判断当前 Reflect.get 的返回值是否为 Object，如果是则再通过 reactive 方法做代理，这样就实现了深度观测
- 检测数组的时候可能触发了多个 get/set，那么如何防止触发多次呢？我们可以判断 key 是否是当前被代理的 target 自身属性

#### Vue3 解构丢失响应式

- 对Vue3响应式数据使用ES6解构出来的是一个**引用对象类型**时，它还是响应式的，但是结构出的是基本数据类型时，响应式会丢失
- 因为Proxy只能监听对象的第一层，深层对象的监听Vue是通过reactive方法再次代理，所以返回的引用仍然是一个Proxy对象；而基本数据类型就是值

#### Vue3 响应式 对 Set、Map 做的处理
- Vue3 对 Map、Set做了很多特殊处理，这是因为Proxy无法直接拦截 Set、Map，因为 Set、Map的方法必须得在它们自己身上调用；Proxy 返回的是代理对象；
- 所以 Vue3 在这里的处理是，封装了 toRaw() 方法返回原对象，通过Proxy的拦截，在调用诸如 set、add方法时，在原对象身上调用方法；

### Ref 和 Reactive 定义响应式数据

- 在 vue2 中， 定义数据都是在data中， 而vue3中对响应式数据的声明，可以使用 ref 和reactive，reactive的参数必须是对象，而ref可以处理基本数据类型和对象
- ref在JS中读值要加.value，可以用isRef判断是否ref对象，reactive不能改变本身，但可以改变内部的值
- 在模板中访问从 setup 返回的 ref 时，会自动解包；因此无须再在模板中为它写 .value；
- Vue3区分 ref 和 reactive 的原因就是 Proxy 无法对原始值进行代理，所以需要一层对象作为包裹；

#### Ref 原理

- ref内部封装一个RefImpl类，并设置get/set，当通过.value调用时就会触发劫持，从而实现响应式。
- 当接收的是对象或者数组时，内部仍然是 reactive 去实现一个响应式；

#### Reactive 原理

- reactive内部使用Proxy代理传入的对象，从而实现响应式。
- 使用 Proxy 拦截数据的更新和获取操作，再使用 Reflect 完成原本的操作（get、set）

#### 使用注意点

- reactive内部如果接收Ref对象会自动解包（脱ref）；
- Ref 赋值给 reactive 属性 时，也会自动解包；
- 值得注意的是，当访问到某个响应式数组或 Map这样的原生集合类型中的 ref 元素时，不会执行 ref 的解包。
- 响应式转换是深层的，会影响到所有的嵌套属性，如果只想要浅层的话，只要在前面加shallow即可（shallowRef、shallowReactive）

