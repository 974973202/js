> 如果某目录下存在tsconfig.json文件，则表示这个目录是TypeScript项目的根目录。

> 在命令行中用tsc指令（不带文件名参考）编译TypeScript项目时,编译器会自动从目录中寻找tsconfig.json文件，并根据其中的配置信息对项目进行编译。


### 一、文件选项配置
files : 表示编译需要编译的单个文件列表
```json
  "files": [
    // 指定编译文件是src目录下的a.ts文件
    "scr/a.ts"
  ]
```

include: 表示编译需要编译的文件或目录
```json
  "include": [
    // "scr" // 会编译src目录下的所有文件，包括子目录
    // "scr/*" // 只会编译scr一级目录下的文件
    "scr/*/*" // 只会编译scr二级目录下的文件
  ]
```

exclude：表示编译器需要排除的文件或文件夹，默认排除node_modules文件夹下文件。
```json
  "exclude": [
    // 排除src目录下的lib文件夹下的文件不会编译
    "src/lib"
  ]
```

extends: 引入其他配置文件，继承配置
  ```json
    // 把基础配置抽离成tsconfig.base.json文件，然后引入
    "extends": "./tsconfig.base.json"
  ```

编译选项配置
  compilerOptions:配置编译选项
```json
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
  // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
  "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}
```

工程引用配置
References：指定工程引用依赖

在项目开发中，有时候我们为了方便将前端项目和后端node项目放在同一个目录下开发，两个项目依赖同一个配置文件和通用文件，但我们希望前后端项目进行灵活的分别打包，那么我们可以进行如下配置：

Project

- src
- client //客户端项目
- index.ts // 客户端项目文件
- tsconfig.json // 客户端配置文件
```json
{
  "extends": "../../tsconfig.json", // 继承基础配置
  "compilerOptions": {
    "outDir": "../../dist/client", // 指定输出目录
  },
  "references": [ // 指定依赖的工程
    {"path": "./common"}
  ]
}
```

- common // 前后端通用依赖工程
- index.ts // 前后端通用文件
- tsconfig.json // 前后端通用代码配置文件
```json
{
  "extends": "../../tsconfig.json", // 继承基础配置
  "compilerOptions": {
    "outDir": "../../dist/client", // 指定输出目录
  }
}
```

- server // 服务端项目
- index.ts // 服务端项目文件
- tsconfig.json // 服务端项目配置文件
```json
{
  "extends": "../../tsconfig.json", // 继承基础配置
  "compilerOptions": {
    "outDir": "../../dist/server", // 指定输出目录
  },
  "references": [ // 指定依赖的工程
    {"path": "./common"}
  ]
}
```

- tsconfig.json // 前后端项目通用基础配置
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "composite": true, // 增量编译
    "declaration": true
  }
}
```

这样配置以后，就可以单独地构建前后端项目。
前端项目构建：tsc -v src/client
后端项目构建：tsc -b src/server