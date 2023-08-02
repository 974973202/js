### library
lerna  yargs

- chalk和ora 
  - 文本颜色和loading
- gradient-string
  - 渐变色

## 脚手架初始化
- 通过 lerna 创建 package
```bash
packages
├── cli # 脚手架入口
├── command # 命令基础类
├── init # 脚手架1：项目初始化命令
└── utils # 通用工具类
```
### import-local
作用: 全局安装一个脚手架后，本地是不需要安装脚手架的。但是当我们本地安装脚手架的时候，意味着我们项目里用到了这个脚手架。当与全局冲突的时候，比如全局和本地都有这个脚手架，但是版本不同，那么我们应该使用本地的脚手架。这就是

### semver
作用: 校验一个版本号是否合法semver.valid('1.2.3') // '1.2.3'。清除版本号里一些多余的语句semver.clean('  =v1.2.3   ') // '1.2.3'。比较版本号的大小semver.lt('1.2.3', '9.8.7') // true

### 