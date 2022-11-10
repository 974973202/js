### CSS选择器以及这些选择器的优先级
* !important > 内联样式（style）> id选择器 > 类选择器(.)/属性选择器([])/伪类选择器(:) > 元素选择器(p)/关系选择器(+)/伪元素选择器(::) > 通配符选择器(*)
> !important
> 内联样式（1000）
> ID选择器（0100）
> 类选择器/属性选择器/伪类选择器（0010）
> 元素选择器/关系选择器/伪元素选择器（0001）
> 通配符选择器（0000）
> * 伪类选择器  示例	示例说明
>  > <p>:checked	input:checked	选择所有选中的表单元素
>  > <p>:disabled	input:disabled	选择所有禁用的表单元素
>  > <p>:empty	p:empty	选择所有没有子元素的p元素
>  > <p>:enabled	input:enabled	选择所有启用的表单元素
>  > <p>:first-of-type	p:first-of-type	选择的每个 p 元素是其父元素的第一个 p 元素
>  > <p>:in-range	input:in-range	选择元素指定范围内的值
>  > <p>:invalid	input:invalid	选择所有无效的元素
>  > <p>:last-child	p:last-child	选择所有p元素的最后一个子元素
>  > <p>:last-of-type	p:last-of-type	选择每个p元素是其母元素的最后一个p元素
>  > <p>:not(selector)	:not(p)	选择所有p以外的元素
>  > <p>:nth-child(n)	p:nth-child(2)	选择所有 p 元素的父元素的第二个子元素
>  > <p>:nth-last-child(n)	p:nth-last-child(2)	选择所有p元素倒数的第二个子元素
>  > <p>:nth-last-of-type(n)	p:nth-last-of-type(2)	选择所有p元素倒数的第二个为p的子元素
>  > <p>:nth-of-type(n)	p:nth-of-type(2)	选择所有p元素第二个为p的子元素
>  > <p>:only-of-type	p:only-of-type	选择所有仅有一个子元素为p的元素
>  > <p>:only-child	p:only-child	选择所有仅有一个子元素的p元素
>  > <p>:optional	input:optional	选择没有"required"的元素属性
>  > <p>:out-of-range	input:out-of-range	选择指定范围以外的值的元素属性
>  > <p>:read-only	input:read-only	选择只读属性的元素属性
>  > <p>:read-write	input:read-write	选择没有只读属性的元素属性
>  > <p>:required	input:required	选择有"required"属性指定的元素属性
>  > <p>:root	root	选择文档的根元素
>  > <p>:target	#news:target	选择当前活动#news元素(点击URL包含锚的名字)
>  > <p>:valid	input:valid	选择所有有效值的属性
>  > <p>:link	a:link	选择所有未访问链接
>  > <p>:visited	a:visited	选择所有访问过的链接
>  > <p>:active	a:active	选择正在活动链接
>  > <p>:hover	a:hover	把鼠标放在链接上的状态
>  > <p>:focus	input:focus	选择元素输入后具有焦点
>  > <p>:first-letter	p:first-letter	选择每个p 元素的第一个字母
>  > <p>:first-line	p:first-line	选择每个p 元素的第一行
>  > <p>:first-child	p:first-child	选择器匹配属于任意元素的第一个子元素的p 元素
>  > <p>:before	p:before	在每个p 元素之前插入内容
>  > <p>:after	p:after	在每个p 元素之后插入内容
>  > <p>:lang(language)	p:lang(it)	为p 元素的lang属性选择一个开始值

子选择器：p>int
兄弟选择器：h2 + p h2后的第一个p

- 单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。

### BFC
* 什么是BFC
- 块级格式化上下文，
- 决定元素如何对其内容进行定位
- 与其他元素的关系和相互作用
* 触发BFC的条件
> <p>根元素或其它包含它的元素
> <p>浮动元素 (元素的 float 不是 none)
> <p>绝对定位元素 (元素具有 position 为 absolute 或 fixed)
> <p>内联块 (元素具有 display: inline-block)
> <p>表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
> <p>表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
> <p>具有overflow 且值不是 visible 的块元素
> <p>弹性盒（flex或inline-flex）
> <p>display: flow-root
> <p>column-span: all
```
但其中，最常见的就是overflow:hidden、float:left/right、position:absolute。
也就是说，每次看到这些属性的时候，就代表了该元素以及创建了一个BFC了
```
* BFC的效果
> <p> 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）
> <p> 处于同一个BFC中的元素相互影响，可能会发生外边距重叠
> <p> 每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此
> <p> BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
> <p> 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算
> <p> 浮动盒区域不叠加到BFC上
```
这么多性质有点难以理解，但可以作如下推理来帮助理解：html的根元素就是<html>，而根元素会创 建
一个BFC，创建一个新的BFC时就相当于在这个元素内部创建一个新的<html>，子元素的定位就如同在一
个新<html>页面中那样，而这个新旧html页面之间时不会相互影响的。
上述这个理解并不是最准确的理解，甚至是将因果倒置了（因为html是根元素，因此才会有BFC的特性，
而不是BFC有html的特性），但这样的推理可以帮助理解BFC这个概念
```
* BFC可以解决的问题
> 垂直外边距重叠问题
> 去除浮动
> 自适用两列布局（float + overflow）

### 清除浮动
- clear:both;
- overflow:hidden；
- after伪类

### 盒模型
> 包括内容区域(context)、 内边距区域(padding)、边框区域(border)、 外边距区域(margin)
- box-sizing: content-box（W3C盒子模型）：**元素的宽高大小**表现为**内容的大小**。
- box-sizing: border-box（IE盒子模型）：**元素的宽高**表现为**内容 + 内边距 + 边框的大小**

### 水平垂直居中
```css
text-align:center;设置文本或img标签等一些内联对象（或与之类似的元素）的居中。
margin:0 auto;设置块元素（或与之类似的元素）的居中。
```

### 三列布局
- 定位元素
```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .left, .right {
    width: 200px;
    height: 200px;
    background: palevioletred;
    position: absolute;
    top: 0;
  }
  .middle {
    width: 100%;
    background: paleturquoise;
    height: 200px;
    margin: 0 200px;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
</style>
<body>
  <div class="container">
    <div class="left">111</div>
    <div class="middle">
      kajsfhkjashfkafhasjhskd
    </div>
    <div class="right"></div>
  </div>
</body>
```

- 浮动元素
```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .left, .right {
    width: 200px;
    height: 200px;
    background: palevioletred;
  }
  .middle {
    width: 100%;
    background: paleturquoise;
    height: 200px;
    margin: 0 200px;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }
</style>

<body>
  <div class="container">
    <div class="left">111</div>
    <div class="right"></div>
    <div class="middle">
      kajsfhkjashfkafhasjhskd
    </div>
  </div>
</body>
```

- 圣杯布局
```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .wrap{
  min-width: 600px;
}
#content{ 
  overflow: hidden;  
  padding: 0px 200px;
}
#left,#right{
  width: 200px;
  height: 200px;
  background-color:pink;
}
#middle{
  background-color: green;
  width: 100%;
}
#middle,#left,#right{
  float: left;
  padding-bottom: 10000px; 
  margin-bottom: -10000px;
}
#left{
  margin-left: -100%;
  position: relative;
  left: -200px;
}
#right{
  margin-left: -200px;
  position: relative;
  left: 200px;
}

</style>

<body>
    <div class="wrap">
      <div id="content">
        <div id="middle">
          <p>middle</p>
          <p>middle</p>
          <p>middle</p>
        </div>
        <div id="left">left</div>
        <div id="right">right</div>
      </div>
    </div>
</body>
```

- 双飞翼布局
- 相较于圣杯布局，少了定位多加了个盒子和外边距
```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .wrap {
    min-width: 600px;
  }
  #left,
  #right {
    width: 200px;
    height: 200px;
    background-color: pink;
  }
  #middle {
    background-color: green;
    width: 100%;
    float: left;
  }
  #content {
    overflow: hidden;
  }
  #left {
    float: left;
    margin-left: -100%;
  }
  #right {
    float: left;
    margin-left: -200px;
  }
  .middle-inner {
    margin: 0 200px;
  }
</style>

<body>
  <div class="wrap">
    <div id="content">
      <div id="middle">
        <div class="middle-inner">
          middle
        </div>
      </div>
      <div id="left">left</div>
      <div id="right">right</div>
    </div>
  </div>
</body>
```

### 如何实现左侧宽度固定，右侧宽度自适应的布局(两列布局)
> float + margin实现
> 利用calc计算宽度
> float + overflow实现
> flex实现

### 换行
- 块元素 flex-wrap: nowrap;
- 文字  white-space: nowrap;

### 三角形的实现
- border 的 color 属性实现 border-color: transparent transparent #000 transparent;
- clip-path
  1. clip-path: url ()
  ```html
    <svg height="0" width="0"> 
      <defs> 
          <clipPath id="svgPath">
              <path id="heart" d="M 250 500 Q 50 250 200 350 Q 200 350 300 450 Q 300 150 350 350 C 400 400 400 150 450 450 C 500 450 600 400 600 250 A 50 50 0 1 1 250 500 Z" />
          </clipPath> 
      </defs> 
    </svg>
    <img class="clipImg" src="https://pic.qqtn.com/up/2019-9/15690311636958128.jpg" />
  ```
  ```css
    .clipImg{
      width: 800px;
      clip-path:url(#svgPath)
    }
  ```
  2. 矩形剪裁 clip-path:inset(top,right,bottom,left)
  3. 圆形剪裁 clip-path:circle(50% at 50% 50%)    at前的50% 代表 半径为50%
  4. 椭圆剪裁 clip-path: ellipse(50px 60px at 0 10% 20%); at 前参数为圆心位置，at后面参数为椭圆半径
  5. 多边形剪裁 clip-path: polygon(30% 50%，20% 10% ，20% 10%)

### 伪元素和伪类的区别
- 伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。
因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素
> 双冒号(::)表示伪元素
> 单冒号(:)表示伪类

### 绝对定位
- 子元素是相对父元素的padding、border还是content进行定位?
> 相对于padding

### 相对定位
- 浮动、绝对定位和固定定位会脱离文档流，相对定位不会脱离文档流

### 首行缩进
- 文本缩进，块级(block)用text-indent，内联(inline)用margin-left

### flex 布局（display: flex）
- 容器属性
- flex-direction 决定主轴方向（容器排列方向）
```
  flex-direction: row | row-reverse | column | column-reverse;
```

- flex-wrap 如果一条轴线排不下，定义换行规则
```
  flex-wrap: nowrap | wrap | wrap-reverse;
```

- flex-flow flex-direction和flex-wrap的简写形式
```
  flex-flow: <flex-direction> || <flex-wrap>;
```

- justify-content 定义容器在主轴上的对齐方式
```
  justify-content: flex-start | flex-end | center | space-between | space-around;
```

- align-items 定义容器在交叉轴上的对齐方式
```
  align-items: flex-start | flex-end | center | baseline | stretch;
```

- align-content 定义多根轴线的对齐方式，如果容器只有一根轴线，该属性不起作用
```
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```

- 项目属性
- order 定义项目的排列顺序，数值越小，排列越靠前，默认为0
- flex-grow 定义项目的放大比例，默认为0（即如果存在剩余空间，也不放大）
- flex-shrink 定义项目的缩小比例，默认为1（即如果空间不足，该项目将缩小）
- flex-basis 定义了在分配多余空间之前，项目占据的主轴空间。默认值为auto（项目本来大小）
- flex 是flex-grow、flex-shrink和flex-basis的简写，默认值为 0 1 auto
```
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

该属性有两个快捷值: auto(1 1 auto) 和 none(0 0 auto)

建议优先使用这个属性，而不是单独写三个分离的属性

因为浏览器会推算相关值
```

- align-self 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性，默认值为
auto（表示继承父元素align-items属性，如果没有父元素，等同于stretch）
```
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

### CSS动画
- transition: 过渡动画
```
  transition-property: 属性
  transition-duration: 间隔
  transition-timing-function: 曲线
  transition-delay: 延迟
  常用钩子: transitionend
```

- animation / keyframes
```
animation-name: 动画名称，对应@keyframes
animation-duration: 间隔
animation-timing-function: 曲线
animation-delay: 延迟
animation-iteration-count: 次数 n / infinite: 循环动画
animation-direction: 方向
  normal: 默认值，按正常播放
  reverse: 动画反向播放
  alternate: 奇数次正向播放，偶数次反向播放
  alternate-reverse: 偶数次正向播放，奇数次反向播放
animation-fill-mode: 静止模式
  forwards: 停止时，保留最后一帧
  backwards: 停止时，回到第一帧
  both: 同时运用 forwards / backwards
animation-play-state: paused / running; 暂停动画 / 正在运行的动画
常用钩子: animationend
```

- transition和animation
- 主要的区别transition不能立即执行，animation不能用事件触发;
1. 如果要灵活定制多个帧以及循环，用animation.
2. 如果要简单的from to 效果，用 transition.
3. 如果要使用js灵活设定动画属性，用transition.

### CSS3D动画  开启3D transform-style
```
transform-style: flat / preserve-3d;
flat: 默认值，子元素将不保留其3d位置
preserve-3d： 子元素将保留其3d位置
设置了preserve-3d就不能防止子元素溢出设置overflow: hidden; 否则preserve-3d失效

perspective: 600px;
物体距人眼的距离

perspective-origin: 50% 50%;
设置观看方向

backface-visibility: visible / hidden;
元素运动过程是否展示元素背面
```

### Css有哪些引入方式？ 通过link和@import引入有什么区别？
- Css引入方式有4种 内联、内嵌、外链、导入

- 外链link 除了可以加载css之外,还可以定义rss、rel等属性，没有兼容性问题，支持使用javascript改变样式

- @import 是css提供的，只能用于加载css，不支持通过javascript修改样式

- 页面被加载的时候，link会被同时加载，而@import则需等到页面加载完后再加载，可能出现无样式网页

- 可以通过 JS 操作 DOM ，插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import的方式插入样式

### CSS优化、提高性能的方法有哪些
- 尽量将样式写在单独的css文件里面，在head元素中引用 将代码写成单独的css文件有几点好处：
> 内容和样式分离，易于管理和维护
> 减少页面体积
> css文件可以被缓存、重用，维护成本降低
- 不使用@import
- 避免使用复杂的选择器，层级越少越好 建议选择器的嵌套最好不要超过三层，比如：
- 精简页面的样式文件，去掉不用的样式
- 利用CSS继承减少代码量
- 避免！important，可以选择其他选择器
- 动画使用transform属性代替margin,height,width...等
- 开启gpu硬件加速 **（合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率）**

将元素的will-change 设置为 opacity、transform、top、left、bottom、right 。这样子渲染引擎会为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。
对于不支持will-change 属性的浏览器，使用一个3D transform属性来强制提升为合成 transform: translateZ(0)
```
transform: translateZ(0)
opacity
filters
Will-change
```

### CSS3新特性
新增各种CSS选择器
圆角           （border-radius:8px）
多列布局        （multi-column layout）
阴影和反射        （Shadow\Reflect）
文字特效      （text-shadow、box-shadow）
文字渲染      （Text-decoration）
线性渐变      （gradient）
过渡          （transition）
旋转          （transform）
旋转基准点    （transform-origin） 
增加了旋转rotate,缩放scale,定位,倾斜skew,动画，多背景
transform:\scale(0.85,0.90)\ translate(0px,-30px)\ skew(-9deg,0deg)\Animation:

### 什么是CSS 预处理器 / 后处理器？
- 预处理器例如：LESS、Sass、Stylus，用来预编译Sass或less，增强了css代码的复用性，
  还有层级、mixin、变量、循环、函数等，具有很方便的UI组件模块化开发能力，极大的提高工作效率。

- 后处理器例如：PostCSS，通常被视为在完成的样式表中根据CSS规范处理CSS，让其更有效；目前最常做的
  是给CSS属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

- CSS 选择符从右往左匹配查找，避免 DOM 深度过深

### 使用动画（js实现动画，css3实现动画）时两者的区别？
> css实现动画：animation transition transform
> js实现动画: setInterval setTimeout requestAnimationFrame
1. js实现的是帧动画
2. css实现的是补间动画
- 帧动画：使用定时器，每隔一段时间，更改当前的元素   浏览器不确定渲染
- 补间动画：过渡（加过渡只要状态发生改变产生动画）动画(多个节点来控制动画)性能会更好   浏览器确定渲染

### CSS动画流畅的原因
- [js动画和css动画的区别]https://blog.csdn.net/weixin_34032779/article/details/93403585
- 渲染线程分为main thread(主线程)和compositor thread(合成器线程)。
- 如果CSS动画只是改变transform和opacity，这时整个CSS动画得以在compositor thread完成（而JS动画则会在main thread执行，然后触发compositor进行下一步操作）
- 在JS执行一些昂贵的任务时，main thread繁忙，CSS动画由于使用了compositor thread可以保持流畅，

* 在主线程中，维护了一棵Layer树（LayerTreeHost），管理了TiledLayer，在compositor thread，维护了同样一颗LayerTreeHostImpl，管理了LayerImpl，这两棵树的内容是拷贝关系。因此可以彼此不干扰，当Javascript在main thread操作LayerTreeHost的同时，compositor thread可以用LayerTreeHostImpl做渲染。当Javascript繁忙导致主线程卡住时，合成到屏幕的过程也是流畅的。
为了实现防假死，鼠标键盘消息会被首先分发到compositor thread，然后再到main thread。这样，当main thread繁忙时，compositor thread还是能够响应一部分消息，例如，鼠标滚动时，加入main thread繁忙，compositor thread也会处理滚动消息，滚动已经被提交的页面部分（未被提交的部分将被刷白）。

::v-deep

[CSS速查总表]https://www.html.cn/book/css/properties/background/index.htm
[CSS参考手册]https://css.doyoe.com/

[你未必知道的CSS知识点]https://juejin.im/post/5d9ec8b0518825651b1dffa3#heading-32
[css特效]https://juejin.im/post/5e070cd9f265da33f8653f00
[巧用CSS实现酷炫的充电动画]https://juejin.im/post/5e00240ee51d45583c1cc9a7