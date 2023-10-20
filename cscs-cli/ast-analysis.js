// import parser from "@babel/parser";
// import traverse from "@babel/traverse";
// import generate from "@babel/generator";

const c = `/*
* @Author: liangzx liangzx@chinacscs.com
* @Date: 2023-07-05 18:25:02
* @LastEditors: liangdh liangdh@chinacscs.com
* @LastEditTime: 2023-07-06 15:13:48
* @FilePath: \frontend\packages\credit-risk\src\pages\capital\countMethod\components\formula.tsx
* @Description:
*
*/
import _ from 'lodash';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export const ddd = () => {} 
`

// const babelCore = require("@babel/core");
import babelCore from "@babel/core";


const options = {
  code: true,
  ast: true,
  sourceMaps: true,
  plugins: [],
  presets: [],
}

babelCore.transform(c, options, (err, result) => {
  console.log(sourceCode);
  console.log(result.code);
  console.log(result.map);
  console.log(result.ast);
})

// function AstAnalysis(code) {
//   // 解析代码
//   const ast = parser.parse(code, {
//     sourceType: "module",
//     plugins: ["jsx", "typescript"]
//   });

//   const imports = {};
//   // 遍历AST并合并相同的import语句
//   traverse.default(ast, {
//     ImportDeclaration(path) {
//       const source = path.node.source.value;
//       if (path.node.specifiers.length > 0) {
//         path.node.specifiers.forEach((specifier) => {
//           const importedName = specifier?.imported?.name ?? specifier.local.name;
//           const localName = specifier.local.name;
//           if (!imports[source]) {
//             imports[source] = [];
//           }
//           imports[source].push({
//             importedName,
//             localName
//           });
//         });
//       } else {
//         // 处理 import "antd/xxx" 的情况
//         if (!imports[source]) {
//           imports[source] = [];
//         }
//       }
//       path.remove();
//     },
//   });

//   // 生成新的import语句
//   const newImports = Object.entries(imports).map(([source, names]) => {
//     const specifiers = names.map(({ importedName, localName }) => ({
//       type: "ImportSpecifier",
//       imported: { type: "Identifier", name: importedName },
//       local: { type: "Identifier", name: localName },
//     }));
//     return {
//       type: "ImportDeclaration",
//       specifiers,
//       source: { type: "StringLiteral", value: source },
//     };
//   });


//   // 将新的import语句插入AST
//   ast.program.body.unshift(...newImports);

//   // 生成新的代码
//   const newCode = generate.default(ast).code;

//   return newCode;
// }


// const nc = AstAnalysis(c)
// console.log(nc);

// module.exports.AstAnalysis = AstAnalysis
