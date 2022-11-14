### 常用的 AST 节点类型对照表
类型原名称 | 中文名称 | 描述
-|-|-
Program | 程序主体 | 整段代码的主体
VariableDeclaration | 变量声明 | 声明一个变量，例如 var let const
FunctionDeclaration | 函数声明 | 声明一个函数，例如 function
ExpressionStatement表 | 达式语句 | 通常是调用一个函数，例如 console.log()
BlockStatement | 块语句 | 包裹在 {} 块内的代码，例如 if (condition){var a = 1;}
BreakStatement | 中断语句 | 通常指 break
ContinueStatement | 持续语句 | 通常指 continue
ReturnStatement | 返回语句 | 通常指 return
SwitchStatement | witch 语句 | 通常指 Switch Case 语句中的 Switch
IfStatementIf | 控制流语句 | 控制流语句，通常指 if(condition){}else{}
Identifier | 标识符 | 标识，例如声明变量时 var identi = 5 中的 identi
CallExpression | 调用表达式 | 通常指调用一个函数，例如 console.log()
BinaryExpression | 二进制表达式 | 通常指运算，例如 1+2
MemberExpression | 成员表达式 | 通常指调用对象的成员，例如 console 对象的 log 成员
ArrayExpression | 数组表达式 | 通常指一个数组，例如 [1, 3, 5]
FunctionExpression | 函数表达式 | 例如const func = function () {}
ArrowFunctionExpression | 箭头函数表达式 | 例如const func = ()=> {}
AwaitExpressionawait | 表达式 | 例如let val = await f()
ObjectMethod | 对象中定义的方法 | 例如 let obj = { fn () {} }
NewExpressionNew | 表达式 | 通常指使用 New 关键词
AssignmentExpression | 赋值表达式 | 通常指将函数的返回值赋值给变量
UpdateExpression | 更新表达式 | 通常指更新成员值，例如 i++
Literal | 字面量 | 字面量
BooleanLiteral | 布尔型字 | 面量布尔值，例如 true false
NumericLiteral | 数字型字 | 面量数字，例如 100
StringLiteral | 字符型 | 字面量字符串，例如 vansenb
SwitchCaseCase | 语句 | 通常指 Switch 语句中的 Case