### !default和!global
- !default用来定义局部变量，!global可以把局部变量转全局变量
```scss
#main {
  $width: 5em !global;
  width: $width;
}
#sidebar {
  width: $width;
}
//编译后
#main {
  width: 5em;
}
#sidebar {
  width: 5em;
}
```

### 混入：@mixin、@include
- @mixin用来定义代码块、@include引入
```scss
@mixin color-links {
    color: blue;
    background-color: red;
}
span {
   @include color-links;
}
// 编译后
span {
  color: blue;
  background-color: red; 
}
```

### @content 向混合样式中导入内容
- 从获取@include{}中传递过来的所有内容导入到指定位置
```scss
@mixin apply-to-ie6-only {
  * html {
    @content;
  }
}
@include apply-to-ie6-only {
  #logo {
    background-image: url(/logo.gif);
  }
}
// 编译后
* html #logo {
  background-image: url(/logo.gif);
}
```

### @at-root 跳出嵌套
- 跳出到和父级相同的层级
```scss
.block {
    color: red;
    @at-root #{&}__element {
        color: blue;
    }
    @at-root #{&}--modifier {
        color:orange;
    }
}
// 编译后
.block {
   color: red;
}
.block__element {
   color: blue;
}
.block--modifier {
  color: orange;
}
```

### @each in 遍历列表
```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
// 编译后
.puma-icon {
  background-image: url('/images/puma.png'); 
}
.sea-slug-icon {
  background-image: url('/images/sea-slug.png'); 
}
.egret-icon {
  background-image: url('/images/egret.png'); 
}
.salamander-icon {
  background-image: url('/images/salamander.png'); 
}
```

### @if @else 条件判断
```scss
p {
  @if 1 + 1 == 2 { border: 1px solid; }
  @if 5 < 3 { border: 2px dotted; }
  @else  { border: 3px double; }
}
// 编译后
p {
  border: 1px solid; 
}

// -------
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
// 编译后
p { color: green; }
```

### @for
```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
// 编译后
.item-1 {
  width: 2em; }
.item-2 {
  width: 4em; }
.item-3 {
  width: 6em; }
```

### sass内置函数
1. map-has-key
 - map-has-key($map,$key) 函数将返回一个布尔值。当 $map 中有这个 $key，则函数返回 true，否则返回 false。 通过map-get($map,$key)获取$key对应的值
 ```scss
    $map: ('xs' : '200px', 'sm': '100px');
    $key: 'xs';
    @if map-has-key($map, $key) {
        @debug map-get($map, $key) // 200px
    }
 ```

2. unquote
 - unquote($string)：删除字符串中的引号   @debug unquote('Hello Sass!') // Hello Sass!

3. inspect
 - inspect($value)函数返回 $value 的字符串表示形式  @debug inspect(('width': 200px)); // "('width': 200px)"

4. str-index
 - inspect($str, $value)返回字符串的第一个索引位置(索引从1开始)，如果字符串不包含该子字符串，则返回 null
 - @debug str-index("sans-serif", "ans"); // 2

5. str-slice
 - str-slice($str, $beginIndex, $endIndex) 截取字符串的指定字符
 - debug str-index("(.el-message)", 2, -2); // .el-message

* 备注：sass中可以使用@debug调试，在控制台打印需要的内容


### Sass 与 Less 区别
- Sass 是在服务端处理的，以前是 Ruby，现在是 Dart-Sass 或 Node-Sass，而 Less 是在客户端处理的，需要引入 less.js 来处理 Less 代码输出 CSS 到浏览器，也可以在开发服务器将 Less 语法编译成 CSS 文件，输出 CSS 文件到生产包目录，有 npm less、Less.app、SimpleLess、CodeKit.app 这样的工具，也有在线编译地址。
- 变量符不一样，Less 是 @，而 Sass 是 $。
- Sass 的功能比 Less 强大，基本可以说是一种真正的编程语言。Less 只是一套自定义的语法及一个解析器，为 CSS 加入动态语言的特性。
- Less 相对 Sass 清晰明了，安装便捷，易于上手，对编译环境要求比较宽松，适合小型项目。Sass 更适用于复杂或大型项目。
- 输出设置，Less 没有输出设置，Sass 提供 4 种输出选项：nested/compact/compressed/expanded，输出样式的风格可以有 4 种选择，默认为 nested。
- `Sass 支持条件语句，可以使用 if...else.../for...while...each循环等，Less 不支持`。
- Sass 引用的外部文件命名必须以 _ 开头，Sass 会认为以 _ 文件是一个引用文件，不会将其编译为 CSS 文件。Less 引用外部文件和 CSS 中的 @import 没什么差异。
- Less 中的变量运算可以带或不带单位，Sass 需要带单位。
- Sass 有工具库 Compass，简单说，Sass 和 Compass 的关系有点像 Javascript 和 jQuery 的关系，Compass 是 Sass 的工具库。在它的基础上，封装了一系列有用的模块和模板，补充强化了 Sass 的功能。Less 有 UI 组件库 Bootstrap，Bootstrap 是 Web 前端开发中一个比较有名的前端 UI 组件库，Bootstrap 的样式文件部分源码就是采用 Less 语法编写