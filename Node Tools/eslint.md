env: Environments，指定代码的运行环境。不同的运行环境，全局变量不一样，指明运行环境这样ESLint就能识别特定的全局变量。同时也会开启对应环境的语法支持，例如：es6。

parser：ESLint 默认使用Espree作为其解析器，但它并不能很好的适应 React 环境，所以刚才安装了 babel-eslint 用来代替默认的解析器，在配置里这么写"parser": "babel-eslint"。

extends：ESLint 不需要自行定义大量的规则，因为很多规则已被分组作为一个规则配置。

plugins：顾名思义就是插件，插件是单独的npm包，命名一般以eslint-plugin开头，写的时候用字符串数组的形式，可以省略eslint-plugin开头。plugins一般包含一个或多个规则配置，可以在extends中引入。

例如：eslint:recommended就是 ESLint 的推荐规则配置，包含了ESLint的规则 里前面有✔︎的部分，recommended 规则只在ESLint升级大版本的才有可能改变。



相对的 eslint:all 是应用所有的规则，但并不推荐这么做。另外，all 规则是根据版本随时变化的。


rules：这里可以对规则进行细致的定义了，覆盖之前前面说的extends中定义的规则。例如 indent就是对缩进的修改。"indent": ["error",4] 前面一项代表错误等级，第二项是具体配置，有些规则有第三项选项，例如 indent 就有 { "SwitchCase": 1 }，代表对switch语句采取什么样的缩进策略，如果不设默认是0



错误等级有三级 0，1，2，分别代表off，warning，error。error错误会终止 lint-staged 执行。