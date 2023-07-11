### 剖析 package

#### 描述配置
- name 项目的名称，如果是第三方包的话，其他人可以通过该名称使用 npm install 进行安装。

- version 项目的版本号，开源项目的版本号通常遵循 semver 语义化规范
  - 1.2.3-bate.1-meta
  - major.minor.patch - pre-release - metadata
  - 主版本号.次版本号.修订号 - 先行版本号
  - 主版本号：当做了不兼容的 API 修改
  - 次版本号：当做了向下兼容的功能性新增
  - 修订号：当做了向下兼容的问题修正
  - 先行版本号可以作为发布正式版之前的版本
    - 一些常见的先行版本号名称:
    - alpha：是内部测试版,一般不向外部发布,会有很多Bug.一般只有测试人员使用。
    - beta：也是测试版，这个阶段的版本会一直加入新的功能。在Alpha版之后推出
    - rc：Release　Candidate) 系统平台上就是发行候选版本。RC版不会再加入新的功能了，主要着重于除错

  - ^:它将当前库的版本更新到第一个数字（major version)中的最新版本，比如：“^12.2.2”，库会匹配更新到 12.X.X 的最新版本，但是不会更新到 13.X.X 版本.
  - ~:当下载的时候，它会自动更新到中间那个数字（minor version）的最新版本，比如：“~2.2.0”，库就会更新到 2.2.X 的最新版本，但是不会更新到 2.3.X 版本.
  
  - version 版本包可以通过 semver 库进行校验

- repository 项目的仓库地址以及版本控制信息。
  ```json
    "repository": {
      "type": "git",
      "url": "https://github.com/facebook/react.git",
      "directory": "packages/react"
    }
  ```

- description 用于添加模块的的描述信息，方便别人了解你的模块
  ```json
    "description": "React is a JavaScript library for building user interfaces."
  ```

- keywords 一组项目的技术关键词
  ```json
    "keywords": [
      "ant",
      "component",
      "components",
      "design",
      "framework",
      "frontend",
      "react",
      "react-component",
      "ui"
    ],
  ```

- homepage 项目主页的链接，通常是项目 github 链接，项目官网或文档首页。

* 当你使用 npm search 检索模块时，会到 description 和 keywords 中进行匹配

- 描述开发人员的字段有两个：author 和 contributors， author 指包的主要作者，一个 author 对应一个人。 contributors 指贡献者信息，一个 contributors 对应多个贡献者，值为数组，对人的描述可以是一个字符串
- bugs 项目 bug 反馈地址，通常是 github issue 页面的链接
- license 项目的开源许可证。常见的开源许可证有 BSD、MIT、Apache等
  - ISC：在所有副本中保留版权声明和许可证声明，使用者就可以拿你的代码做任何想做的事情，你也无需承担任何责任
  - MIT：在所有副本或主要部分中保留版权声明和许可证声明，使用者就可以拿你的代码做任何想做的事情，你也无需承担任何责任
- funding 指定项目的资金支持方式和链接

#### 文件配置
- bin
  bin 属性用于指定在全局安装时可执行的命令。它是一个对象，其中键是命令的名称，值是命令的路径
  ```json
  {
    "name": "my-package",
    "version": "1.0.0",
    "bin": {
      "my-command": "./bin/my-command.js"
    }
  }
  ```
  在全局安装时，会创建一个名为 my-command 的可执行命令，它的实际路径是 ./bin/my-command.js。
  使用 bin 属性可以方便地将项目中的命令行工具安装到全局环境中，使其可以在任何地方使用。

- files
  项目在进行 npm 发布时，可以通过 files 指定需要跟随一起发布的内容来控制 npm 包的大小，避免安装时间太长。
  发布时默认会包括 package.json，license，README 和main 字段里指定的文件。忽略 node_modules，lockfile 等文件。
  在此基础上，我们可以指定更多需要一起发布的内容。可以是单独的文件，整个文件夹，或者使用通配符匹配到的文件。
  ```json
    "files": [
      "filename.js",
      "directory/",
      "glob/*.{js,json}"
    ]
  ```
  一般情况下，files 里会指定构建出来的产物以及类型文件，而 src，test 等目录下的文件不需要跟随发布。

- type
  在 node 支持 ES 模块后，要求 ES 模块采用 .mjs 后缀文件名。只要遇到 .mjs 文件，就认为它是 ES 模块。如果不想修改文件后缀，就可以在 package.json文件中，指定 type 字段为 module。
  ```json
    "type": "module"
  ```
  这样所有 .js 后缀的文件，node 都会用 ES 模块解释。
  如果还要使用 CommonJS 模块规范，那么需要将 CommonJS 脚本的后缀名都改成.cjs，不过两种模块规范最好不要混用，会产生异常报错。

- main
  项目发布时，默认会包括 package.json，license，README 和main 字段里指定的文件，因为 main 字段里指定的是项目的入口文件，在 browser 和 Node 环境中都可以使用。
  如果不设置 main 字段，那么入口文件就是根目录下的 index.js。
  比如 packageA 的 main 字段指定为 index.js。
  ```json
    "main": "./index.js"
  ```
  我们引入 packageA 时，实际上引入的就是 node_modules/packageA/index.js。
  这是早期只有 CommonJS 模块规范时，指定项目入口的唯一属性。

- browser
  main 字段里指定的入口文件在 browser 和 Node 环境中都可以使用。如果只想在 web 端使用，不允许在 server 端使用，可以通过 browser 字段指定入口。
  ```json
    "browser": "./browser/index.js"
  ```

- module
  同样，项目也可以指定 ES 模块的入口文件，这就是 module 字段的作用。
  ```json
    "module": "./index.mjs"
  ```
  当一个项目同时定义了 main，browser 和 module，像 webpack，rollup 等构建工具会感知这些字段，并会根据环境以及不同的模块规范来进行不同的入口文件查找。
  ```json
    "main": "./index.js", 
    "browser": "./browser/index.js",
    "module": "./index.mjs"
  ```
  比如 webpack 构建项目时默认的 target 为 'web'，也就是 Web 构建。它的 resolve.mainFeilds 字段默认为  ['browser', 'module', 'main']。
  ```js
    module.exports = {
      //...
      resolve: {
        mainFields: ['browser', 'module', 'main'],
      },
    };
  ```
  此时会按照 browser -> module -> main 的顺序来查找入口文件。

- exports 字段可以配置不同环境对应的模块入口文件，并且当它存在时，它的优先级最高。

- workspaces
  项目的工作区配置，用于在本地的根目录下管理多个子项目。可以自动地在 npm install 时将 workspaces 下面的包，软链到根目录的 node_modules 中，不用手动执行 npm link 操作。
  workspaces 字段接收一个数组，数组里可以是文件夹名称或者通配符。比如：
  ```json
    "workspaces": [
      "workspace-a"
    ]
  ```
  表示在 workspace-a 目录下还有一个项目，它也有自己的 package.json。
  package.json
  workspace-a
    └── package.json
  通常子项目都会平铺管理在 packages 目录下，所以根目录下 workspaces 通常配置为：
  ```json
    "workspaces": [
      "packages/*"
    ]
  ```

#### 脚本配置
- script 
 - npm钩子，也称npm生命周期。npm默认提供pre和post两个钩子，当我们执行任意npm run脚本时，都将自动触发pre/post的钩子但是这2个钩子的内容需要由你自定义
  ```json
    {
      "scripts": {
        "preabc": "xxx",
        "abc": "xxx",
        "postabc": "xxx"
      }
    }
  ```
  - 当你执行npm run abc时，会自动按照下面的顺序执行
  ```js
    npm run preabc -> npm run abc -> npm run postabc
  ```

- config 
  config 用于设置 scripts 里的脚本在运行时的参数。比如设置 port 为 3001：
  ```json
    "config": {
      "port": "3001"
    }
  ```
  在执行脚本时，我们可以通过 npm_package_config_port 这个变量访问到 3001。
  ```js
    console.log(process.env.npm_package_config_port); // 3001
  ```

#### 依赖配置

我们的项目可能依赖一个或多个外部依赖包，根据依赖包的不同用途，我们将他们配置在下面几个属性下：dependencies、devDependencies、peerDependencies、bundledDependencies、optionalDependencies

1. dependencies 指定了项目运行所依赖的模块，开发环境和生产环境的依赖模块都可以配置到这里
  - 指定项目运行时所依赖的模块 loadsh

2. devDependencies 有一些包有可能你只是在开发环境中用到，例如你用于检测代码规范的 eslint ,用于进行测试的 jest ，用户使用你的包时即使不安装这些依赖也可以正常运行，反而安装他们会耗费更多的时间和资源，所以你可以把这些依赖添加到 devDependencies 中，这些依赖照样会在你本地进行 npm install 时被安装和管理，但是不会被安装到生产环境
  - 指定项目开发时所需要的模块，主要是用来打包，解析文件的一些包

3. peerDependencies 用于指定你正在开发的模块所依赖的版本以及用户安装的依赖包版本的兼容性。
  - 通常用于表示与另一个包的依赖与兼容性关系来警示使用者。
  - 指定当前模块所在的宿主环境所需要的模块及其版本
  - 减小打包体积：例如使用react开发的组件库，安装react是必不可少的，而使用组件库的开发者，本地项目肯定安装了react，因此开发的组件库中不必把react打包进去（期望项目的使用者来提供这些模块的实现）
  - 版本一致性：使用你的组件库的开发者需要确保他们项目中安装了与你声明的对等依赖版本兼容的包，以确保组件库正常运行

4. optionalDependencies 某些场景下，依赖包可能不是强依赖的，这个依赖包的功能可有可无，当这个依赖包无法被获取到时，你希望 npm install 继续运行，而不会导致失败，你可以将这个依赖放到 optionalDependencies 中，注意 optionalDependencies 中的配置将会覆盖掉 dependencies 所以只需在一个地方进行配置
  * 当然，引用 optionalDependencies 中安装的依赖时，一定要做好异常处理，否则在模块获取不到时会导致报错

5. peerDependenciesMeta

6. bundledDependencies 的值是一个数组，数组里可以指定一些模块，这些模块将在这个包发布时被一起打包
  - main 属性可以指定程序的主入口文件
  - files 属性用于描述你 npm publish 后推送到 npm 服务器的文件列表，如果指定文件夹，则文件夹内的所有内容都会包含进来。
  ```json
    "bundleDependencies": [
      "react",
      "react-dom"
    ]

    <!-- 这个字段数组中的值必须是在 dependencies，devDependencies 两个里面声明过的依赖才行。 -->
  ```

7. overrides
8. resolutions

  * 你还可以通过配置一个 .npmignore 文件来排除一些文件, 防止大量的垃圾文件推送到 npm, 规则上和你用的 .gitignore 是一样的。.gitignore 文件也可以充当.npmignore 文件


#### 发布配置
- private 如果是私有项目，不希望发布到公共 npm 仓库上，可以将 private 设为 true。

- publishConfig   npm 包发布时使用的配置。
  比如在安装依赖时指定了 registry 为 taobao 镜像源，但发布时希望在公网发布，就可以指定 publishConfig.registry。
  ```json
    "publishConfig": {
      "registry": "https://registry.npmjs.org/"
    }
  ```

#### 系统配置
和项目关联的系统配置，比如 node 版本或操作系统兼容性之类。这些要求只会起到提示警告的作用，即使用户的环境不符合要求，也不影响安装依赖包
- engines
  一些项目由于兼容性问题会对 node 或者包管理器有特定的版本号要求，比如：
  ```json
  "engines": {
    "node": ">=14 <16",
    "pnpm": ">7"
  }
  ```
  要求 node 版本大于等于 14 且小于 16，同时 pnpm 版本号需要大于 7。
- os
  在 linux 上能正常运行的项目可能在 windows 上会出现异常，使用 os 字段可以指定项目对操作系统的兼容性要求。
  ```json
    "os": ["darwin", "linux"]
  ```
- cpu
  指定项目只能在特定的 CPU 体系上运行。
  ```json
    "cpu": ["x64", "ia32"]
  ```

#### 第三方配置
- types 或者 typings  指定 TypeScript 的类型定义的入口文件
- unpkg 可以让 npm 上所有的文件都开启 CDN 服务。
- jsdelivr
- browserslist 置项目的浏览器兼容情况
  - babel 和 autoprefixer 等工具会使用该配置对代码进行转换。当然你也可以使用 .browserslistrc 单文件配置
  ```json
    "browserslist": [
      "> 1%",
      "last 2 versions"
    ]
  ```
- lint-staged
- husky

### 发包

npm login
npm public

npm version major
npm version minor
npm version patch

npm unpublic

查看全局安装的软件包：npm list -g --depth

[前端工程化-剖析 npm 的包管理机制]https://juejin.im/post/5df789066fb9a0161f30580c


### 常用命令的生命周期脚本
- npm publish 命令的生命周期会执行的脚本顺序：

  - prepublish > prepare > prepublishOnly > publish > postpublish
  - prepublishOnly: 最重要的一个生命周期，如果你需要在发包之前自动做一些事情，如测试、构建等，可以在这里完成
　　

 - npm pack 命令的生命周期会执行的脚本顺序：

   - prepare > prepack > postpack
　　

 - npm install 命令的生命周期会执行的脚本顺序：

   - prepare > preinstall > install > postinstall
　　

 - npm uninstall 命令的生命周期会执行的脚本顺序：

   - preuninstall > uninstall > postuninstall
　

 - npm version 命令的生命周期会执行的脚本顺序：

   - preversion > version > postversion
　　


 - npm test 命令的生命周期会执行的脚本顺序：

   - pretest > test > posttest
　　

 - npm start 命令的生命周期会执行的脚本顺序：

   - prestart > start > poststart
　　

 - npm stop 命令的生命周期会执行的脚本顺序：

   - prestop > stop > poststop
　　

 - npm restart 命令的生命周期会执行的脚本顺序：

   - prerestart > restart > postrestart
　　

 - npm shinkwrap 命令的生命周期会执行的脚本顺序：

   - preshinkwrap > shinkwrap > postshinkwrap


### prepare钩子
- 一个最常用的生命周期钩子，它的执行时机：
  - npm install 之后自动执行
  - npm publish 之前自动执行
  - 常用的git hook工具husky通常就被放置在这个钩子里执行
  ```css
  {
    prepare: "husky install";
  }
  ```
