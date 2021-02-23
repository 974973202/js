# koa 洋葱模型

```js
async function fn1(next) {
  console.log("fn1");
  await next(true);
  console.log("fn11");
}
async function fn2(next) {
  console.log("fn2");
  await delay(3000);
  await next(false);
  console.log("fn22");
}
async function fn3(next) {
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
  return function (...args) {
    // 执行第一个next
    return dispatch(0);

    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next(bool) {
          // console.log(bool)
          return dispatch(i + 1);

          // if(bool) {
          //   return dispatch(i+1)
          // } else {
          //   setTimeout(() => {
          //     return dispatch(i+1)
          //   })
          // }
        })
      );
    }
  };
}

// const middlewares = [fn1, fn2, fn3];
const finalFn = compose([fn1, fn2, fn3]);
finalFn();
```

koa常用插件
路由：koa-router
跨域处理：@koa/cors
压缩：koa-compress
静态资源：koa-static
协议处理：koa-json,koa-body
安全：鉴权方式：koa-session,koa-jwt, 通信头：koa-helmet
日志：koa-logrer