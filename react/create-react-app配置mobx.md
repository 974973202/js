1. npx create-react-app my-app cd my-app npm run eject

### 两种方案(第一个不行换第二个)
```javascript
yarn add --dev babel-plugin-transform-decorators-legacy //安装es6装饰器函数解析器插件

打开package.json
"babel": { 
  "plugins": [ "transform-decorators-legacy" ], 
  "presets": [ "react-app" ] 
}

npm install --save mobx mobx-react
OK
```
```javascript
yarn add --dev @babel/plugin-proposal-decorators

打开package.json
"babel": { 
  "presets": [ "react-app" ],
  "plugins": [ 
    [ "@babel/plugin-proposal-decorators", { "legacy": true } ] 
  ] 
}

npm install --save mobx mobx-react //one安装了不用重复安装
OK
```


启用装饰器语法支持

  方式一:
    
      1. npm run eject
      2. npm install @babel/plugin-proposal-decorators
      3. package.json

        "babel": {
            "plugins": [
                [
                    "@babel/plugin-proposal-decorators",
                    {
                        "legacy": true
                    }
                ]
            ]
        }
            
  方式二:

      1. npm install react-app-rewired @babel/plugin-proposal-decorators customize-cra

      2. 在项目根目录下创建 config-overrides.js

          const { override, addDecoratorsLegacy } = require("customize-cra");

          module.exports = override(addDecoratorsLegacy());
      
      3. package.json

          "scripts": {
              "start": "react-app-rewired start",
              "build": "react-app-rewired build",
              "test": "react-app-rewired test",
          }
        
解决vscode编辑器关于装饰器语法的警告

  "javascript.implicitProjectConfig.experimentalDecorators": true