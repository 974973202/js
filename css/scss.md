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