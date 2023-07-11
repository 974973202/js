const fs = require('fs');
const babylon = require('babylon');
const parser = require("@babel/parser"); // 生成AST
const traverse = require('@babel/traverse').default; // 遍历AST树
const { transformFromAst } = require('@babel/core'); // 给定AST，对其进行转换

module.exports = {
  /**
   * 分析模块获得AST
   */
    getAST: (path) => {
        const content = fs.readFileSync(path, 'utf-8')
    
        // return babylon.parse(content, {
        //     sourceType: 'module',
        // });
        return parser.parse(content, {
          sourceType: "module"
        });
    },
    /**
     * 获取依赖模块的路径
     */
    getDependencis: (ast) => {
        const dependencies = []; // 路径信息
        traverse(ast, {
          ImportDeclaration: ({ node }) => {
            // 获取模块的依赖路径
            // import a from './a.js' 获取 './a.js'
            dependencies.push(node.source.value);
          }
        });
        return dependencies;
    },
    transform: (ast) => {
        const { code } = transformFromAst(ast, null, {
          presets: ["@babel/preset-env"]
        });
      
        return code;
    }
};