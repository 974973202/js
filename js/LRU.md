LRU 缓存是一种常见的缓存策略，它的全称是 Least Recently Used，即最近最少使用。当缓存空间已满时，LRU 缓存会优先淘汰最近最少使用的数据，以腾出空间来存储新的数据。

- 如何保证优先淘汰最近最少使用的数据
  - 每次 get 获取完数据，删除当前数据再加入到末尾
  - 超过最大缓存长度 删除的时候，取第一条数据删除

下面是一个用 JS 实现 LRU 缓存的示例代码：

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // 最大缓存长度
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    } else {
      return -1;
    }
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const lruCache = new LRUCache(2); // 最大缓存长度 2
lruCache.put(1, 1); // 缓存是 {1=1}
lruCache.put(2, 2); // 缓存是 {1=1, 2=2}
lruCache.get(1);    // 返回 1
lruCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lruCache.get(2);    // 返回 null
lruCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lruCache.get(1);    // 返回 null
lruCache.get(3);    // 返回 3
lruCache.get(4);    // 返回 4
```

这个实现使用了 ES6 的 Map 数据结构来存储缓存数据，Map 可以保持插入顺序，因此可以使用它来实现 LRU 缓存。

LRUCache 类有两个方法：get 和 put。get 方法用于获取缓存中指定 key 的值，如果 key 存在，则将其放到 Map 的末尾，表示最近使用过；如果 key 不存在，则返回 -1。put 方法用于向缓存中添加新的 key-value 对，如果 key 已经存在，则更新其 value；如果缓存已满，则淘汰最近最少使用的数据，并将新的 key-value 对添加到 Map 的末尾。

这个实现的时间复杂度为 O(1)，因为 Map 的 get、set 和 delete 操作的时间复杂度都是 O(1)。