### 简化使用，Commander 提供了一个全局对象
```js
const { Command } = require('commander');
const program = new Command();

// option(flags: string, description?: string, defaultValue?: string | boolean | string[]): this;
// option<T>(flags: string, description: string, fn: (value: string, previous: T) => T, defaultValue?: T): this;
// option(flags: string, description: string, regexp: RegExp, defaultValue?: string | boolean | string[]): this;
program.options()

program.command()
// 当 .command() 带有描述参数时，不能采用 .action(callback) 来处理子命令，否则会出错。


```

