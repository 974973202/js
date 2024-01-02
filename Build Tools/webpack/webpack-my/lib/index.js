const Compiler = require('./compiler');


const options = require('../simplepack.config');

new Compiler(options).run();

// 可以将 ES6 语法转换成 ES5 的语法
//  ·通过 babylon 生成AST
//  ·通过 babel-core 将AST重新生成源码 可以分析模块之间的依赖关系
//  · 通过 babel-traverse 的 ImportDeclaration 方法获取依赖属性
// 生成的 JS 文件可以在浏览器中运行


// （1）搭建结构，读取配置参数
// （2）用配置参数对象初始化 Compiler 对象
// （3）挂载配置文件中的插件
// （4）执行 Compiler 对象的 run 方法开始执行编译
// （5）根据配置文件中的 entry 配置项找到所有的入口
// （6）从入口文件出发，调用配置的 loader 规则，对各模块进行编译
// （7）找出此模块所依赖的模块，再对依赖模块进行编译
// （8）等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 chunk
// （9）把各个代码块 chunk 转换成一个一个文件加入到输出列表
// （10）确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统
