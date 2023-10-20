import parser from "@babel/parser";
import { default as traverse } from "@babel/traverse";
import generator from "@babel/generator";

export default function AstAnalysis(code: string) {
  // 解析代码
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"]
  });

  const imports: Record<string, any> = {};

  // 遍历AST并合并相同的import语句
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (path.node.specifiers.length > 0) {
        path.node.specifiers.forEach((specifier: any) => {
          const importedName = specifier?.imported?.name ?? specifier.local.name;
          const localName = specifier.local.name;
          if (!imports[source]) {
            imports[source] = [];
          }
          imports[source].push({
            importedName,
            localName
          });
        });
      } else {
        // 处理 import "antd/xxx" 的情况
        if (!imports[source]) {
          imports[source] = [];
        }
      }
      path.remove();
    },
  });

  // 生成新的import语句
  const newImports: any = Object.entries(imports).map(([source, names]) => {
    const specifiers = names.map(({ importedName, localName }: any) => ({
      type: "ImportSpecifier",
      imported: { type: "Identifier", name: importedName },
      local: { type: "Identifier", name: localName },
    }));
    return {
      type: "ImportDeclaration",
      specifiers,
      source: { type: "StringLiteral", value: source },
    };
  });

  // 将新的import语句插入AST
  ast.program.body.unshift(...newImports);

  // 生成新的代码
  const newCode = generator(ast).code;

  return newCode;
}
