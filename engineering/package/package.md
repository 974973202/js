### 剖析package
- description用于添加模块的的描述信息，方便别人了解你的模块
- keywords用于给你的模块添加关键字
* 当你使用 npm search 检索模块时，会到description 和 keywords 中进行匹配

- 描述开发人员的字段有两个：author 和 contributors， author 指包的主要作者，一个 author 对应一个人。 contributors 指贡献者信息，一个 contributors 对应多个贡献者，值为数组，对人的描述可以是一个字符串
- homepage 用于指定该模块的主页
- repository 用于指定模块的代码仓库
- bugs 指定一个地址或者一个邮箱，对你的模块存在疑问的人可以到这里提出问题

#### 依赖配置
我们的项目可能依赖一个或多个外部依赖包，根据依赖包的不同用途，我们将他们配置在下面几个属性下：dependencies、devDependencies、peerDependencies、bundledDependencies、optionalDependencies

- dependencies 指定了项目运行所依赖的模块，开发环境和生产环境的依赖模块都可以配置到这里
  - 指定项目运行时所依赖的模块  loadsh

- devDependencies 有一些包有可能你只是在开发环境中用到，例如你用于检测代码规范的 eslint ,用于进行测试的 jest ，用户使用你的包时即使不安装这些依赖也可以正常运行，反而安装他们会耗费更多的时间和资源，所以你可以把这些依赖添加到 devDependencies 中，这些依赖照样会在你本地进行 npm install 时被安装和管理，但是不会被安装到生产环境
  - 指定项目开发时所需要的模块，主要是用来打包，解析文件的一些包

- peerDependencies 用于指定你正在开发的模块所依赖的版本以及用户安装的依赖包版本的兼容性。 
  - 指定当前模块所在的宿主环境所需要的模块及其版本
  
- optionalDependencies 某些场景下，依赖包可能不是强依赖的，这个依赖包的功能可有可无，当这个依赖包无法被获取到时，你希望 npm install 继续运行，而不会导致失败，你可以将这个依赖放到 optionalDependencies 中，注意 optionalDependencies 中的配置将会覆盖掉 dependencies 所以只需在一个地方进行配置
* 当然，引用 optionalDependencies 中安装的依赖时，一定要做好异常处理，否则在模块获取不到时会导致报错

- bundledDependencies 的值是一个数组，数组里可以指定一些模块，这些模块将在这个包发布时被一起打包

- main 属性可以指定程序的主入口文件
- files 属性用于描述你 npm publish 后推送到 npm 服务器的文件列表，如果指定文件夹，则文件夹内的所有内容都会包含进来。
* 你还可以通过配置一个 .npmignore 文件来排除一些文件, 防止大量的垃圾文件推送到 npm, 规则上和你用的 .gitignore 是一样的。.gitignore 文件也可以充当.npmignore 文件

### 发包
npm login
npm public

npm version major
npm version minor
npm version patch

npm unpublic

查看全局安装的软件包：npm list -g --depth

[前端工程化-剖析npm的包管理机制]https://juejin.im/post/5df789066fb9a0161f30580c