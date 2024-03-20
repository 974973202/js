1. esbuild-node-externals
2. styles-import-plugin.js    loader: 'tsx'   less？

### 组件库
基座：yalc 
开发打包：gulp + esbuild

### 发包
1. es 代码包
2. install 脚本包
- 在package files里
```json
"files": [
    "es",
    "install"
  ],
```

### 装组件包的时候 yarn 或 yarn add @xxx
1. 执行 srcipts postinstall周期 node install/install.js
- 写入路由  install/routes/credit-risk.route.ts
- 组件页面  install/pages/credit-risk/**
- 导出组件的组件  install/credit-risk-components.shared.ts

2. 写入到本项目的 src/.components/*

### react-base-core 项目的启动打包 会执行 核心库的 读写文件覆盖路由，写入权限，静态文件等。
1. combineRoutes(); // 合并路由
2. combineAccess(); // 合并权限
3. createAppFile(); // 写入 app.tsx
4. createOverrideRoutes(); // 根据src/page目录生成路由
5. createAccessFile(); // 写入权限文件
6. copyPublic(); // copy 静态文件