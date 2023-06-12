```
脚手架工具：
  专用：vue-cli create-react-app angular-cli gatsby-cli
  通用：Yeoman Plop
自动化构建：npm scripts & script hooks Grunt Glip FIS
模块化打包：webpack Rollup Parcel
标准化规范：ESLint StyleLint Prettier
自动化测试：Mocha Jest Enzyme Cypress Nightmare Puppeteer
自动化部署：Git Hook   Lint-staged CI/CD
```

### 执行vue create app 具体做了什么
1. 会在环境变量$PATH中查询vue命令 --- 相当于执行 which vue
2. 查询实际的链接文件
3. 通过/usr/bin/env node 执行文件