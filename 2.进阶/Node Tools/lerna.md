### lerna
- 是一个优化基于git + npm的多package项目的管理工具

常见命令包括：

1. lerna init：初始化lerna仓库
2. lerna create：创建一个新的npm包    lerna create my-package
3. lerna bootstrap：安装依赖并链接包
4. lerna add：向某个包中添加依赖   
  - 往指定路径安装依赖：lerna add lodash packages/cli
5. lerna run：在所有包中执行npm script
6. lerna publish：发布所有更新的包
7. lerna link
8. lerna exec -- rm -rf node_modules/  删除每个包下的node_modules

### 本地依赖开发
file: ../


### 原生开发痛点
1. 重复操作
  - 多package本地link
  - 多package依赖安装
  - 多package代码提交
  - 多package代码发布
2. 版本一致性
  - 发布时版本一致性
  - 发布后互相依赖版本升级