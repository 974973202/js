public，任何地方
private，只能在类的内部访问
protected，能在类的内部访问和子类中访问
Readonly 属性设置为只读

const和readonly的区别
const用于变量，readonly用于属性
const在运行时检查，readonly在编译时检查
使用const变量保存的数组，可以使用push，pop等方法。但是如果使用ReadonlyArray<number>声明的数组不能使用push，pop等方法

extends 继承
namespace 命名空间
declare 声明形式


函数重载
重载签名：就是对参数形式的不同书写，可以定义多种模式。
实现签名：对函数内部方法的具体实现

枚举(enum)：对代码具有侵入式

### Record
Record能够快速创建对象类型。它的使用方式是Record<K, V>，能够快速的为object创建统一的key和value类型
```js
const person: Record<string, string> = {
  name: 'l',
  age: 18 // X --- value type should string
} 
```
### Pick
Pick：主要作用是从一组属性中拿出某个属性，并将其返回
Pick的使用方法是Pick<P, K>，如（P）类型中拥有name,age,desc三个属性，那么K为 name则最终将取到只有name的属性，其他的将会被排出。
### Omit
Omit：主要作用是从一组属性中排除某个属性，并将排除属性后的结果返回。
Omit的使用方法是Omit<P, K>，与Pick的结果是相反的，如果说Pick是取出，那么Omit则是过滤的效果.
### Exclude
Exclude：从一个联合类型中排除掉属于另一个联合类型的子集
来看下，Exclude使用形式是Exclude<T, S>，如果T中的属性在S不存在那么就会返回
```js
interface A {
  show: boolean,
  hidden: boolean,
  status: string
}
interface B {
  show: boolean,
  name: string
}
type outPut = Exclude<keyof A, keyof B> // hidden  status  name
```
### Extract
Extract：跟Exclude相反，从从一个联合类型中取出属于另一个联合类型的子集
举一反三，如果Exclude是取差集，那么Extract就是取交集。会返回两个联合类型中相同的部分。
### Partial
Partial是一个将类型转为可选类型的工具，对于不明确的类型来说，需要将所有的属性转化为可选的?.形式，转换成为可选的属性类型
```js
interface Person {
  name: string,
}
const a: Partial<Person> = {} // name?: string | undefined
```

### never, void 的区别
```js
// never，never表示永远不存在的类型。比如一个函数总是抛出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。函数的返回值就是never类型。
// void, 没有显示的返回值的函数返回值为void类型。如果一个变量为void类型，只能赋予undefined或者null
```





<!-- TypeScript不会防止屎山的出现，也没有大多数人传言中的那么香。
只是很多吹捧的人会把屎山说香。它只是一个类型系统，并没有传的那么神乎其神，
能做的只是杜绝了很多奇技淫巧，让代码可以在一个较为正常的环境下进行开发。 -->