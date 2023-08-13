## About

## Getting Started

### 安装：

```bash
npm install -g @study-cli/core
```

### 创建项目

项目/组件初始化

```bash
study-cli init 
```

强制清空当前文件夹

```bash
study-cli init --force
```

### 发布项目

发布项目/组件

```bash
study-cli publish
```

强制更新所有缓存

```bash
study-cli publish --force
```

正式发布

```bash
study-cli publish --prod
```

手动指定build命令

```bash
study-cli publish --buildCmd "npm run build:test"
```


## More

清空本地缓存：

```bash
study-cli clean
```

DEBUG 模式：

```bash
study-cli --debug
```

调试本地包：

```bash
study-cli init --packagePath /Users/sam/Desktop/study-cli/packages/init/
```
