<!--
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2023-01-04 14:56:35
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-01-05 09:58:04
 * @FilePath: \js\performance\index.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
### 以用户为中心的性能指标
- 简单归纳为 加载速度、视觉稳定、交互延迟
 - 加载速度 决定了 用户是否可以尽早感受到页面已经加载完成
 - 视觉稳定 衡量了 页面上的视觉变化对用户造成的负面影响大小
 - 交互延迟 决定了 用户是否可以尽早感受到页面已经可以操作

 - 性能检测的库： web-vitals

- 白屏（FP）
 - FP首次绘制：页面视觉首次发生变化的时间点。比如设置的body背景色；FP不包含默认背景绘制，但包含非默认的背景绘制。
```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-paint')) {
    console.log('fp', entry);
  }
}).observe({ type: 'paint', buffered: true });
```

- 灰屏（FCP）
 - FCP首次内容绘制：首次绘制任何文本、图像、非空白canvas或者SVG的时间点
```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('fcp', entry);
  }
}).observe({ type: 'paint', buffered: true });
```
- FP和FCP的区别：FCP是首次绘制有效内容的时间点；所以FP会等于或者先于FCP

- 首次有效绘制（FMP）(首屏）
 -  页面渲染过中 元素增量最大的点
```js
 export const initFMP = (): void => {
  new MutationObserver((records: Array<MutationRecord>) => {
    // 对当前的 document 进行计算评分
    // 或者对 records.addedNodes的每个 node 元素，计算评分累加;每次遍历元素还需要判断此元素是否在可视区域
  }).observe(document, { childList: true, subtree: true });
};
```

- 最大内容绘制（LCP）
 - 页面内首次开始加载的时间点，到 可视区域内最大的图像或者文本块完成渲染 的 相对时间
 - 最大内容绘制完成时，往往可以认为 页面将要加载完成
 - 为了提供良好的用户体验，我们应该努力将 最大内容绘制控（LCP） 制在2.5 秒或以内
```js
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const entry = entries[entries.length - 1];
  console.log('lcp', entry);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

- 首次输入延迟（FID）
 - 从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 JavaScript 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间
 - FID 时间在 100ms 内的能 让用户得到良好的使用体验
```js
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const entry = entries[entries.length - 1];
  const delay = entry.processingStart - entry.startTime;
  console.log('FID:', delay, entry);
}).observe({ type: 'first-input', buffered: true });
```

- 累计布局偏移（CLS）
 - 测量整个页面生命周期（页面可见性变成隐藏）内发生的所有 意外布局偏移 中最大一的 布局偏移分数。
 - 每当一个已渲染的可见元素的位置从一个可见位置变更到下一个可见位置时，就发生了 布局偏移 