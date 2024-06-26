### 包管理工具安装和版本切换
- npm 
  - node 预装了 npm ，所以安装 node 后，不需要手动安装 npm
  - npm 中，要安装 nvm 才能完成版本切换
- yarn
  - yarn 需要手动安装。建议全局安装 yarn ---  `npm install yarn -g`
  - yarn中的版本切换
```
# yarn set version latest # 最新版
# yarn set version canary # 最新的经典版
# yarn set version classic # 最新的经典版
# yarn set version 3.x
yarn set version <version>
```
- pnpm
  - pnpm 也需要全局安装，才能使用 `npm install pnpm -g`

### npm 、yarn 和 pnpm 常用命令
- `npm init` | `yarn init` | `pnpm init`: 初始化命令
- `npm run` | `yarn run/yarn` | `pnpm`: 运行脚本
- `npm publish` | `yarn publish`: 发布包
- `npm cache clean` | `yarn cache clean`：清除缓存
- `npm install` | `yarn` | `pnpm install/i`: 安装所有依赖
- `npm install [package]` | `yarn add [package]` | `pnpm add [package]`: 安装某个依赖项
- `npm install --save-dev/-D [package]` | `yarn add --dev/-D [package]` | `pnpm add --dev/-D [package]`: 安装开发依赖
- `npm uninstall [package]` | `yarn remove [package]` | `pnpm remove/rm [package]`: 卸载依赖
- `npm update` | `yarn upgrade` | `pnpm update/up` : 更新全部依赖
- `npm update [package]` | `yarn upgrade [package]` | `pnpm update/up [package]` : 更新某个依赖

#### 安全性
npm 最不好的缺点之一就是安全性，曾经的版本发生过几个严重的安全漏洞， npm 6 开始则是在安装之前会检查安全漏洞，
并且支持使用 npm audit 手动检查安装包的安全性，如果发现安全问题，可以运行 npm audit fix 修复漏洞。
因为 npm/yarn 是扁平化依赖结构，有个非常严重的问题就是可以非法访问未声明的包，而 pnpm 是将依赖通过 link 的形式避免了非法访问依赖的问题，如果没在 package.json 声明的话，是无法访问的。

yarn 和 pnpm 同样也支持 yarn/pnpm audit 手动检查安装包的安全性。

yarn 和 npm 都是使用 hash加密算法 确保包的完整性。

#### lock 文件
在 package.json 跟踪的依赖项和版本总是不准确的，因为 ~ ^ * 等前缀表示依赖更新时对应的版本范围。
范围版本可以在更新依赖时自动升级依赖到兼容性的次要版本或者补丁版本，让软件包支持最新的功能或者修复最近的错误。

所以，为了避免不同设备安装依赖时的版本不匹配的问题，在 lock 文件中定义了精确的安装版本。在每次新装（更新）依赖时，npm 和 yarn 会分别
创建（更新） package-lock.json 和 yarn.lock 文件。这样就能保证其他设备安装完全相同的包。

### 深入理解yarn及yarn install 工作流程解析
- 和npm区别
  - yarn在下载和安装依赖包采用的是`多线程`的方式，而npm是`单线程`的方式执行，速度上就拉开了差距
  - yarn会在用户本地缓存已下载过的依赖包，优先会从缓存中读取依赖包，只有本地缓存不存在的情况才会采取远端请求的方式；反观npm则是全量请求，速度上再次拉开差距
  - yarn把所有的`依赖躺平至同级`，有效的减少了相同依赖包重复下载的情况，加快了下载速度而且也减少了node_modules的体积；反观npm则是严格的根据依赖树下载并放置到对应位置，`导致相同的包多次下载、node_modules体积大的问题`

- 和pnpm区别
  - 和yarn一样有一个统一管理依赖包的目录
  - pnpm保留了npm2版本原有的依赖树结构，但是node_modules下所有的依赖包都是通过软连接的方式保存

### yarn工作流程
- yarn在安装依赖包时会分为主要5个步骤
  - checking：检查配置项（.yarnrc、命令行参数、package.json信息等）、兼容性（cpu、nodejs版本、操作系统等）是否符合package.json中的约定
    - 查找.yarnrc文件
    - 解析用户输入的指令
    - 初始化共用实例，初始化config配置项、reporter日志。config会在init时，逐步向父级递归查询 
     package.json是否配置了workspace字段。如果当前是workspace项目则yarn.lock是以workspace根目录 的yarn.lock为准
    - 获取项目依赖 -- package.json的dependencies、devDependencies、optionalDependencies内所有依赖包名+版本号
    - 执行 add 指令，读取yarn.lock文件，根据package.json中的生命周期执行对应script脚本 -- `preinstall`，`install`，`postinstall`，`prepublish`，`prepare`

  - resolveStep：通过解析项目package.json的依赖形成一颗依赖树，并且会解析出整个依赖树上所有包的具体版本信息

  - fetchStep：下载全部依赖包，如果依赖包已经在缓存中存在则跳过下载，反之则下载对应依赖包到缓存文件夹内，当这一步都完成后代表着所有依赖包都已经存在缓存中了

  - linkStep：将缓存的依赖包（因为上一步下载的包都是在缓存中）扁平化的复制副本到项目的依赖目录下

  - buildStep：对于一些二进制包，需要进行编译，在这一步进行

- 在进行 yarn install 过程中的5个步骤，如下图所示：
![](https://lzx-blog.oss-cn-chengdu.aliyuncs.com/yarn-vscode.png)
对应着 yarn install 执行的五个阶段
 > Validating package.json（检查 package.json）：检查运行环境

 > Resolving packages（解析包）：整合依赖信息

> Fetching packages（获取包）：获取依赖包到缓存中

> Linking dependencies（连接依赖）：复制依赖到 node_modules

> Building fresh packages（构建安装）：执行 install 阶段的 scripts