1. npx create-react-app my-app cd my-app npm run eject

### 两种方案(第一个不行换第二个)
```javascript
yarn add --dev babel-plugin-transform-decorators-legacy //安装es6装饰器函数解析器插件

打开package.json
"babel": { "plugins": [ "transform-decorators-legacy" ], "presets": [ "react-app" ] }

npm install --save mobx mobx-react
OK
```
```javascript
yarn add --dev @babel/plugin-proposal-decorators

打开package.json
"babel": { "presets": [ "react-app" ], "plugins": [ [ "@babel/plugin-proposal-decorators", { "legacy": true } ] ] }

npm install --save mobx mobx-react //one安装了不用重复安装
OK
```