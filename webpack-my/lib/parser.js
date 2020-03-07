const fs = require('fs');
const babylon = require('babylon');
const parser = require("@babel/parser");
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

module.exports = {
    getAST: (path) => {
        const content = fs.readFileSync(path, 'utf-8')
    
        // return babylon.parse(content, {
        //     sourceType: 'module',
        // });
        return parser.parse(content, {
          sourceType: "module"
        });
    },
    getDependencis: (ast) => {
        const dependencies = []
        traverse(ast, {
          ImportDeclaration: ({ node }) => {
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