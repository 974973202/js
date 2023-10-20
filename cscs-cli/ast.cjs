const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

// 读取文件
const code = fs.readFileSync('./ast-test.js', 'utf-8');

// 解析代码
const ast = parser.parse(code, {
  sourceType: 'module',
});

// 遍历AST并合并相同的import语句
const imports = {};
traverse(ast, {
  ImportDeclaration(path) {
    const source = path.node.source.value;
    path.node.specifiers.forEach(specifier => {
      const name = specifier.local.name;
      if (!imports[source]) {
        imports[source] = [];
      }
      imports[source].push(name);
    });
    path.remove();
  },
});

// 生成新的import语句
const newImports = Object.entries(imports).map(([source, names]) => {
  const specifiers = names.map(name => ({
    type: 'ImportSpecifier',
    imported: { type: 'Identifier', name },
    local: { type: 'Identifier', name },
  }));
  return {
    type: 'ImportDeclaration',
    specifiers,
    source: { type: 'StringLiteral', value: source },
  };
});

// 将新的import语句插入AST
ast.program.body.unshift(...newImports);

// 生成新的代码
const newCode = generator(ast).code;

console.log(newCode);
