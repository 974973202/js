lerna是一个管理多个npm包的工具，常见命令包括：

1. lerna init：初始化lerna仓库
2. lerna create：创建一个新的npm包
3. lerna bootstrap：安装依赖并链接包
4. lerna add：向某个包中添加依赖
5. lerna run：在所有包中执行npm script
6. lerna publish：发布所有更新的包

举例：

1. lerna init

```
lerna init --independent
```

2. lerna create

```
lerna create my-package
```

3. lerna bootstrap

```
lerna bootstrap
```

4. lerna add

```
lerna add lodash --scope=my-package
lerna add lodash packages/cli
```

5. lerna run

```
lerna run test
```

6. lerna publish

```
lerna publish
```