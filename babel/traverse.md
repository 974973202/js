```js
traverse.default(ast, {
    xxx(path, state) {

    }
})

path {
    // 属性：
    node  // 当前 AST 节点
    parent  //  父 AST 节点
    parentPath  //  父 AST 节点的 path
    scope  //  作用域
    hub  //  可以通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串
    container  //  当前 AST 节点所在的父节点属性的属性值
    key  //  当前 AST 节点所在父节点属性的属性名或所在数组的下标
    listKey  //  当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined
    
    // 方法
    get(key)  //  获取某个属性的 path
    set(key, node)  //  设置某个属性的值
    inList() 
    getSibling(key)  //  获取某个下标的兄弟节点
    getNextSibling()  //  获取下一个兄弟节点
    getPrevSibling()  //  获取上一个兄弟节点
    getAllPrevSiblings()  //  获取之前的所有兄弟节点
    getAllNextSiblings()  //  获取之后的所有兄弟节点
    isXxx(opts)  //  判断当前节点是否是某个类型，可以传入属性和属性值进一步判断，比如path.isIdentifier({name: 'a'})
    assertXxx(opts)  //  同 isXxx，但是不返回布尔值，而是抛出异常
    find(callback)  //  从当前节点到根节点来查找节点（包括当前节点），调用 callback（传入 path）来决定是否终止查找
    findParent(callback)  //  从当前节点到根节点来查找节点（不包括当前节点），调用 callback（传入 path）来决定是否终止查找
    
    insertBefore(nodes)   //  在之前插入节点，可以是单个节点或者节点数组
    insertAfter(nodes)  //  在之后插入节点，可以是单个节点或者节点数组
    replaceWith(replacement)  //  用某个节点替换当前节点
    replaceWithMultiple(nodes)  //  用多个节点替换当前节点
    replaceWithSourceString(replacement)  //  解析源码成 AST，然后替换当前节点
    remove()  //  删除当前节点
    
    traverse(visitor, state)  //  遍历当前节点的子节点，传入 visitor 和 state（state 是不同节点间传递数据的方式）
    skip()  //  跳过当前节点的子节点的遍历
    stop()  //   结束所有遍历
}


path.scope {
    bindings  // 当前作用域内声明的所有变量
    block  // 生成作用域的 block
    parent  //  
    parentBlock  // 父级作用域的 block
    path  //  生成作用域的节点对应的 path
    references  //  所有 binding 的引用对应的 path
 
    dump()  //  打印作用域链的所有 binding 到控制台
    getAllBindings()  //  从当前作用域到根作用域的所有 binding 的合并
    getBinding(name)  //  查找某个 binding，从当前作用域一直查找到根作用域
    hasBinding(name)  //  从当前作用域查找 binding，可以指定是否算上全局变量，默认是 false
    getOwnBinding(name)  //  从当前作用域查找 binding
    parentHasBinding(name)  //  查找某个 binding，从父作用域查到根作用域，不包括当前作用域。可以通过 noGlobals 参数指定是否算上全局变量（比如console，不需要声明就可用），默认是 false
    removeBinding(name)  //  删除某个 binding
    moveBindingTo(name, scope)  //  把当前作用域中的某个 binding 移动到其他作用域
    generateUid(name)  //  生成作用域内唯一的名字，根据 name 添加下划线，比如 name 为 a，会尝试生成 _a，如果被占用就会生成 __a，直到生成没有被使用的名字
}

path.scope.block 
export type Scopable =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ClassExpression
  | ClassDeclaration
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | StaticBlock
  | TSModuleBlock;


path.scope.references

```

### path.scope.bindings
- 作用域中保存的是声明的变量和对应的值，每一个声明叫做一个binding。
- 比如这样一段代码 `const a = 1;`
- 它的 path.scope.bindings 是这样的

```js
bindings: {
    a: {
        constant: true,
        constantViolations: [],
        identifier: {type: 'Identifier', ...}
        kind:'const',
        path: {node,...}
        referenced: false
        referencePaths: [],
        references: 0,
        scope: ...
    }
}

// binding 有多种 kind，代表变量是用不同的方式声明的。

// binding.identifier 和 binding.path ，分别代表标识符、整个声明语句。

// 声明之后的变量会被引用和修改， binding.referenced 代表声明的变量是否被引用， binding.constant  代表变量是否被修改过。
// 如果被引用了，就可以通过 binding.referencePaths 拿到所有引用的语句的 path。
// 如果被修改了，可以通过 binding.constViolations 拿到所有修改的语句的 path。
```