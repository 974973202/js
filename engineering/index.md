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

### 全局安装@vue/cli 具体做了什么
1. 把包下载到node下的node_modules
2. 找到package 下的 bin 名称来安装一个软链接

### 如何直接执行 ./test.js 文件
- 文件头部添加 #!/usr/bin/env node   相当于执行 node ./test.js

### glob和正则表达式
1. 都是用来匹配文件路径名的工具。
2. glob是一个简单的通配符匹配工具，它可以根据通配符模式匹配文件路径名。通配符模式是一种简化的正则表达式，只包含两个特殊字符：*和?。其中*表示匹配任意数量的任意字符，?表示匹配一个任意字符。
3. 正则表达式是一种更强大的模式匹配工具，它可以根据正则表达式模式匹配文件路径名。正则表达式模式是一种更复杂的模式，可以包含各种特殊字符和元字符，用于匹配不同类型的字符和字符串。
4. 使用glob时，我们可以使用通配符模式来匹配文件路径名，例如`*.txt`可以匹配所有以.txt结尾的文件。
5. 而使用正则表达式时，我们可以根据正则表达式模式来匹配文件路径名，例如`[a-zA-Z]+\.txt`可以匹配所有以字母开头并以.txt结尾的文件。
6. 总的来说，glob更简单易用，适合简单的文件路径名匹配；而正则表达式更灵活强大，适合复杂的模式匹配需求。


```js
import [ create, all ] from 'mathjs'
const config = {
   number:'BigNumber'
   precision: 20
}

const math = create(all, config);

export default {
   methods : {
      //除
      numberExcept: function (arg1，arg2) {
        return math.divide(arg1, arg2);
      },
      //乘
      numberRide: function (arg1，arg2) {
        return math.multiply(argl, arg2);
      },
      //加
      numberAdd:function (argl,arg2) {
        return math.add(argl, arg2);
      },
      //减
      numberSub:function (argl,arg2) {
        return math add(arg1, -arg2);
      }
  }
}
```