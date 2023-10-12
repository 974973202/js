# koa 洋葱模型

中间件类似于面向切面编程AOP
加入减少一个功能，不影响原来的功能 

```js
async function fn1(ctx, next) {
  console.log("fn1");
  await next(true);
  console.log("fn11");
}
async function fn2(ctx, next) {
  console.log("fn2");
  await delay(3000);
  await next(false);
  console.log("fn22");
}
async function fn3(ctx, next) {
  console.log("fn3");
}

function delay(wait) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
}

/**
 * 递归加函数组合compose
 */
function compose(middlewares) {
  return function (args) {
    // 执行第一个next
    return dispatch(0);

    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(args, function next() {
          return dispatch(i + 1);
        })
      );
    }
  };
}

// const middlewares = [fn1, fn2, fn3];
const finalFn = compose([fn1, fn2, fn3]);
finalFn('cpdd');
```

koa常用插件
路由：koa-router
跨域处理：@koa/cors
压缩：koa-compress
静态资源：koa-static
协议处理：koa-json,koa-body
安全：鉴权方式：koa-session,koa-jwt, 通信头：koa-helmet
日志：koa-logrer

### express和koa的区别
1. 语法区别
experss 异步使用 回调
koa1 异步使用 generator + yeild
koa2 异步使用 await/async

2. 中间件区别
koa采用洋葱模型，进行顺序执行，出去反向执行，支持context传递数据
express本身无洋葱模型，需要引入插件，不支持context
express的中间件中执行异步函数，执行顺序不会按照洋葱模型，异步的执行结果有可能被放到最后，response之前。
这是由于，其中间件执行机制，递归回调中没有等待中间件中的异步函数执行完毕，就是没有await中间件异步函数

3. 集成度区别
express 内置了很多中间件，集成度高，使用省心，
koa 轻量简洁，容易定制