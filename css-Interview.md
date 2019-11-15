[你未必知道的CSS知识点]https://juejin.im/post/5d9ec8b0518825651b1dffa3#heading-32

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

### BFC
* 什么是BFC
> 是块级格式化上下文，决定元素如何对其内容进行定位 以及 与其他元素的关系和相互作用
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

### 盒模型
> 包括内容区域(context)、 内边距区域(padding)、边框区域(border)、 外边距区域(margin)
- box-sizing: content-box（W3C盒子模型）：**元素的宽高大小**表现为**内容的大小**。
- box-sizing: border-box（IE盒子模型）：**元素的宽高**表现为**内容 + 内边距 + 边框的大小**

### 如何实现左侧宽度固定，右侧宽度自适应的布局(两列布局)
> float + margin实现
> 利用calc计算宽度
> float + overflow实现
> flex实现

### 三列布局

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