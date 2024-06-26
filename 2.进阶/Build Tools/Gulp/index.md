### Gulp
自动化工具

```js
gulpfile.js
const gulp = require('gulp')

task() // create task
parallel() // 并行执行task
series() // 串行执行task 按顺序执行

src -> pipe -> dest // 来源 管道 目标
```

### Vinyl
- 是描述文件的元数据对象。Vinyl 实例的主要属性是文件系统中文件核心的 path 和 contents 核心方面。Vinyl 对象可用于描述来自多个源的文件（本地文件系统或任何远程存储选项上）
  - Vinyl 适配器
   1. 一个签名为 src(globs, [options]) 的方法，返回一个生成 Vinyl 对象的流。
   2. 一个带有签名为 dest(folder, [options]) 的方法，返回一个使用 Vinyl 对象的流

### src()
- 创建一个流，用于从文件系统读取 Vinyl 对象

### dest()
- 创建一个用于将 Vinyl 对象写入到文件系统的流

### series()
- 将任务函数和/或组合操作组合成更大的操作，这些操作将按顺序依次执行。对于使用 series() 和 parallel() 组合操作的嵌套深度没有强制限制。

### parallel()
- 将任务功能和/或组合操作组合成同时执行的较大操作。对于使用 series() 和 parallel() 进行嵌套组合的深度没有强制限制。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');

const jsTask = () => {
  return src("./src/**/*.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser({ toplevel: true }))
    .pipe(dest("./dist"))
}

module.exports = {
  jsTask
}
```