```javascript
  function CodingMan(name) { // 主要考察的是 面向对象以及JS运行机制（同步 异步 任务队列 事件循环）
    function Man(name) {
      setTimeout(() => { // 异步
        console.log(`Hi! This is ${name}`);
      }, 0);
    }

    Man.prototype.sleep = function (time) {
      let curTime = new Date();
      let delay = time * 1000;
      setTimeout(() => { // 异步
        while (new Date() - curTime < delay) { } // 阻塞当前主线程
        console.log(`Wake up after ${time}`);
      }, 0);
      return this;
    }

    Man.prototype.sleepFirst = function (time) {
      let curTime = new Date();
      let delay = time * 1000;
      while (new Date() - curTime < delay) { } // 阻塞当前主线程
      console.log(`Wake up after ${time}`);
      return this;
    }

    Man.prototype.eat = function (food) {
      setTimeout(() => { // 异步
        console.log(`Eat ${food}~~`);
      }, 0)
      return this;
    }

    return new Man(name);
  }

  // CodingMan('Peter');
  CodingMan('Peter').sleep(3).eat('dinner');
  // CodingMan('Peter').eat('dinner').eat('supper');
  // CodingMan('Peter').sleepFirst(5).eat('supper');
```
