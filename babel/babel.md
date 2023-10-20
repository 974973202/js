### Babel 是一个 JavaScript 编译器
- Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中
- Babel 本身不具备转化功能，而是将转化功能分解到插件中，如果不配置任何插件，经过babel的代码和输入是相同的

### 基本使用
- npm install --save-dev @babel/core @babel/cli @babel/preset-env
```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage", // 只包含你所需要的polyfill
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

### 核心库 @babel/core

### CLI 命令行工具 @babel/cli

### 你的使用场景是什么？
你是否采用的是单一仓库（monorepo）模式？
你是否需要编译 node_modules？
那么 **babel.config.json babel.config.js** 文件可以满足你的的需求！

你的配置文件是否仅适用于项目的某个部分？
那么 **.babelrc.json .babelrc.js** 文件适合你！
```js
// one 
{
    presets: [...],
    plugins: [...],
}
// two
module.exports = {
    presets: [...],
    plugins: [...],
}
```

### 预设（Presets）
- Babel 的预设（preset）可以被看作是一组 Babel 插件和/或 options 配置的可共享模块
- Preset 顺序是颠倒的（从后往前）
- 官方提供的一些预设
   > @babel/preset-env for compiling ES2015+ syntax
   > @babel/preset-typescript for TypeScript
   > @babel/preset-react for React
   > @babel/preset-flow for Flow

### 插件 plugins
- 插件在 Presets 前运行
- 插件顺序从前往后排列(和Preset相反)
- 插件开发
  ```js
  export default function() {
    return {
        visitor: {
            Identifier(path) {
                const name = path.node.name;
                // reverse the name: JavaScript -> tpircSavaJ
                path.node.name = name
                .split("")
                .reverse()
                .join("");
            },
        },
    };
    }
  ```

### plugins和Presets参数
```js
// one 
{
  "presets": [
    "presetA", // bare string
    ["presetA"], // wrapped in array
    ["presetA", {}] // 2nd argument is an empty options object
  ],
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}

// two
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      }
    ]
  ],
  "plugins": [
    [
      "transform-async-to-module-method",
      {
        "module": "bluebird",
        "method": "coroutine"
      }
    ]
  ]
}
```

### 集成
- @babel/cli
- @babel/polyfill
- @babel/plugin-transform-runtime 
  > A plugin that enables the re-use of Babel's injected helper code to save on codesize.
- @babel/register
  > 运行时进行即时编译
- @babel/standalone 
  > @babel/standalone provides a standalone build of Babel for use in browsers and other non-Node.js environments.

### 工具
- @babel/parser
```js
// API
import { parse, parseExpression, tokTypes } from '@babel/parser' // 可以把源码转换成AST
// parse() parses the provided code as an entire ECMAScript program, while parseExpression() tries to parse a single Expression with performance in mind. When in doubt, use .parse().
```
- @babel/core  
 - Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse，并实现了插件功能, 里面就包含了@babel/parser、@babel/traverse、@babel/generate、@babel/types等

- @babel/generator
 - 可以把AST生成源码，同时生成sourcemap
```js
// Turns an AST into code.
```
- @babel/code-frame
- @babel/runtime
- @babel/template
- @babel/traverse // 用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- @babel/types  // 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用

### babel原理
> ES6、7代码输入 -> @babel/parser进行解析 -> 得到AST（抽象语法树）-> plugin用@babel/traverse对
AST树进行遍历转译 ->得到新的AST树->用@babel/generate通过AST树生成ES5代码、