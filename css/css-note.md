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