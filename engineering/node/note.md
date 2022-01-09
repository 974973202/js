# 为什么要学习node
1. 提高沟通效率
2. 快速开发全栈项目
3. 架构思想

# 并发处理
1. 多进程
2. 多线程
3. 异步IO
4. 协程

# 下载github资源
- download-git-repo   可以配合ora优化下载进度
```js
  const download = require('download-git-repo');
  download('github:xxx', 'dir', (err) => {
    console.log(err)
  })
```

### node.js特点
1. 事件驱动
2. 异步、非阻塞I/O
3. 性能出众
4. 单线程
5. 适合开发服务器端的应用层（BFF） -- 提供数据服务
6. 前端工程化的工具
7. 桌面应用开发（vscode）

# koa 

### node API
- process
```js
 const a = process.argv;
 console.log(a);
//  [ 'C:\\Program Files\\nodejs\\node.exe',
//   'C:\\Users\\lzxv8\\Desktop\\js\\index',
//   'aa' ]
// 第三个参数是用户向程序传递数据的基础

//  node index aa
```

- #!/usr/bin/env node

### 
app.js index.js 一设置程序的代码；
model/ 数据库模型；
views/ 用来渲染页面的模板；
controllers/ routes/   HTTP 请求处理器
middleware/ 中间件组件
