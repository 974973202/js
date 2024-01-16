### 创建元素
```js
// document.createElement()
var div = document.createElement("div");
// 创建文本节点  document.createTextNode
```

### 节点关系
```js
// 父节点
const child = document.getElementById('div')
child.parentNode

// 子节点
const parent = document.getElementById('div');
parent.childNodes

// 兄弟节点：下一个nextSibling，某个previousSibling
// 第一个或最后一个子节点：firstChild、lastChild
```

e.preventDefault(); // 阻止默认事件
e.stopPropagation(); // 阻止冒泡


### offsetHeight scrollHeight clientHeight 区别
## offsetHeight offsetWidth
包括：border + padding + content

## clientHeight clientWidth
包括：padding + content

## scrollHeight scrollWidth
包括：padding + 实际内容的尺寸

## scrollTop scrollLeft
DOM 内部元素滚动的距离

```js
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 使用示例
var element = document.getElementById('myElement');
if (isElementInViewport(element)) {
  console.log('元素完全出现在屏幕中');
} else {
  console.log('元素未完全出现在屏幕中');
}
```