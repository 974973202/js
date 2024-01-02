### 常用的 AST 节点类型对照表
| 类型原名称              | 中文名称         | 描述                                                  |
| ----------------------- | ---------------- | ----------------------------------------------------- |
| Program                 | 程序主体         | 整段代码的主体                                        |
| VariableDeclaration     | 变量声明         | 声明一个变量，例如 var let const                      |
| FunctionDeclaration     | 函数声明         | 声明一个函数，例如 function                           |
| ExpressionStatement表   | 达式语句         | 通常是调用一个函数，例如 console.log()                |
| BlockStatement          | 块语句           | 包裹在 {} 块内的代码，例如 if (condition){var a = 1;} |
| BreakStatement          | 中断语句         | 通常指 break                                          |
| ContinueStatement       | 持续语句         | 通常指 continue                                       |
| ReturnStatement         | 返回语句         | 通常指 return                                         |
| SwitchStatement         | witch 语句       | 通常指 Switch Case 语句中的 Switch                    |
| IfStatementIf           | 控制流语句       | 控制流语句，通常指 if(condition){}else{}              |
| Identifier              | 标识符           | 标识，例如声明变量时 var identi = 5 中的 identi       |
| CallExpression          | 调用表达式       | 通常指调用一个函数，例如 console.log()                |
| BinaryExpression        | 二进制表达式     | 通常指运算，例如 1+2                                  |
| MemberExpression        | 成员表达式       | 通常指调用对象的成员，例如 console 对象的 log 成员    |
| ArrayExpression         | 数组表达式       | 通常指一个数组，例如 [1, 3, 5]                        |
| FunctionExpression      | 函数表达式       | 例如const func = function () {}                       |
| ArrowFunctionExpression | 箭头函数表达式   | 例如const func = ()=> {}                              |
| AwaitExpressionawait    | 表达式           | 例如let val = await f()                               |
| ObjectMethod            | 对象中定义的方法 | 例如 let obj = { fn () {} }                           |
| NewExpressionNew        | 表达式           | 通常指使用 New 关键词                                 |
| AssignmentExpression    | 赋值表达式       | 通常指将函数的返回值赋值给变量                        |
| UpdateExpression        | 更新表达式       | 通常指更新成员值，例如 i++                            |
| Literal                 | 字面量           | 字面量                                                |
| BooleanLiteral          | 布尔型字         | 面量布尔值，例如 true false                           |
| NumericLiteral          | 数字型字         | 面量数字，例如 100                                    |
| StringLiteral           | 字符型           | 字面量字符串，例如 vansenb                            |
| SwitchCaseCase          | 语句             | 通常指 Switch 语句中的 Case                           |

## 常见的 AST 节点
### Literal
- 是字面量的意思

| 类型原名称      | 中文名称 | 描述                        |
| --------------- | -------- | --------------------------- |
| Literal         | 字面量   | 字面量                      |
| BooleanLiteral  | 布尔型字 | 面量布尔值，例如 true false |
| NumericLiteral  | 数字型字 | 面量数字，例如 100          |
| StringLiteral   | 字符型   | 字面量字符串，例如 vansenb  |
| RegExpLiteral   | 正则     | /^[a-z]+/                   |
| TemplateLiteral | 模板     | `gang`                      |
| BigintLiteral   | 数字型字 | 1.232233n                   |
| NullLiteral     |          | null                        |

### Identifier
- 各种声明和引用的名字

代码段里的 Identifier 标记注释里

```js
const name = 'guang';  // name

function say(name) { // say name
  console.log(name);  // console  log  name
}

const obj = {  // obj
  name: 'guang'  // name
}
```

### Statement
- statement 是语句，它是可以独立执行的单位

以下代码每行都是一个 Statement
  
```js
break;  // BreakStatement
continue;  // ContinueStatement
return;  // ReturnStatement
debugger;  // DebuggerStatement
throw Error();  // ThrowStatement
{} // BlockStatement
try {} catch(e) {} finally{}  // TryStatement
for (let key in obj) {}  // ForInStatement
for (let i = 0;i < 10;i ++) {}  // ForStatement
for (let key of obj) {} // ForOfStatement
while (true) {} // WhileStatement
do {} while (true) // DoWhileStatement
switch (v){case 1: break;default:;} // SwitchStatement
label: console.log();  // LabeledStatement
with (a){} // WithStatement
```

### Declaration
- 声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。

| 类型原名称               | 描述                  |
| ------------------------ | --------------------- |
| Declaration              |                       |
| VariableDeclaration      | const a = 1;          |
| FunctionDeclaration      | function b(){}        |
| ClassDeclaration         | class C {}            |
| ImportDeclaration        | import d from 'e';    |
| ExportDefaultDeclaration | export default e = 1; |
| ExportNamedDeclaration   | export {};            |
| ExportAllDeclaration     | export * from 'e';    |

### Expression
- expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别

| 类型原名称              | 描述                     |
| ----------------------- | ------------------------ |
| Expression              |                          |
| ArrayExpression         | 数组表达式 [1,2,3]       |
| AssignmentExpression    | 赋值表达式 a = 1         |
| BinaryExpression        | 二元表达式 1 + 2;        |
| UnaryExpression         | 一元表达式 -1;           |
| FunctionExpression      | 函数表达式 function(){}; |
| ArrowFunctionExpression | 箭头函数表达式 () => {}; |
| ClassExpression         | class表达式 class{};     |
| ThisExpression          | this表达式 this;         |
| SuperExpression         | super表达式 super;       |
| BindExpression          | 绑定表达式 a::b;         |
| CallExpression          | console.log(1)           |


### Modules

#### import
- ImportDeclaration

```js
import {c, d} from 'c';
import a from 'a';
import * as b from 'b';
```

- ImportSpicifier: import `{c, d}` from 'c';
- ImportDefaultSpecifier: import `a` from 'a';
- ImportNamespaceSpcifier: import `* as b` from 'b';

#### export
- ExportSpecifier
  
```js
export { b, d};
export default a;
export * from 'c';
```

| 类型原名称               | 描述               |
| ------------------------ | ------------------ |
| ExportNamedDeclaration   | export { b, d};    |
| ExportDefaultDeclaration | export default a;  |
| ExportAllDeclaration     | export * from 'c'; |

### File & Comment
- babel 的 AST 最外层节点是 File
- Comment 注释分为块注释和行内注释

| 类型原名称   | 描述        |
| ------------ | ----------- |
| CommentBlock | /** 6666 */ |
| CommentLine  | // 6666     |