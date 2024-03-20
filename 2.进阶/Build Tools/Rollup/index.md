### Rollup 
- 默认只支持 ES 模块
- webpack构建App应用，rollup适用于类库或纯js项目
- import只能作为顶层的语句出现，不能出现在function里面或是if里面。
- ES import的模块名只能是字符串常量。
- 不管import的语句出现的位置在哪里，在模块初始化的时候所有的import都必须导入完成。

### Rollup 常用插件介绍
1. @rollup/plugin-commonjs 将CommonJS模块进行es转换
 - strictRequires：根据项目需求选择合适的模式，例如设置为true以保留Node.js语义，或设置为"auto"以在必要时包装CommonJS文件。
 - exclude 和 include：根据项目需求指定要忽略或包含的文件。可以使用picomatch模式来匹配文件路径。
 - extensions：指定在无扩展名导入时搜索的扩展名的顺序。
 - transformMixedEsModules：根据项目需求决定是否启用混合模块转换。
 - ignore：根据项目需求指定要保留未转换的require语句的模块。

2. @rollup/plugin-node-resolve  用于解析Node.js模块。让Rollup打包时使用Node.js模块（包括外部依赖）
3. @rollup/plugin-typescript  用于将TypeScript代码转换为可在浏览器中运行的JavaScript代码