<!-- 3.水平垂直居中 -->
```css
div {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
}
```
<!-- css一行文本超出 -->
```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
```

<!-- 多行文本超出显示 -->
```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

<!-- IOS手机容器滚动条滑动不流畅 -->
```css
overflow: auto;
-webkit-overflow-scrolling: touch;
```

<!-- css使用注意事项 -->
1. 使用伪元素时 content: 'xx'. xx是中文的时候，尽量使用unicode编码 避免乱码情况

<!-- background-clip: text 实现彩虹字 -->
.title {
  color: transparent;
  background: -webkit-linear-gradient(30deg, #32c5ff 25%, #b620e0 50%, #f7b500 75%, #20e050 100%);
  background-size: auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-animation: gradientText 300s infinite linear;

  animation: gradientText 300s infinite linear;
  -webkit-text-fill-color: transparent;
}

@keyframes gradientText {
  0% {
    background-position: 0;
  }
  100% {
    background-position: 280px;
  }
}


<!-- 绘制三角形 -->
```css
width: 0;
height: 0;
border: 50px solid transparent;
border-bottom-color: blue;
```

<!-- 绘制扇形 -->
```css
border: 50px solid transparent;
width: 0;
heigt: 0;
border-radius: 50px;
border-top-color: blue;
```