### useRequest
```js
const {
  data, // 数据
  error, // err
  loading, // loading true false
  run, // 关联manual 自调用执行
  runAsync, // 异步函数，返回promise的得自己try catch 捕获错误。不走 onSuccess，onError
  params, // run(1, 2, 3)，则 params 等于 [1, 2, 3]
  cancel, // 中断请求,取消轮询
  refresh, // 使用上一次的参数，重新发起请求
  refreshAsync, // 和runAsync效果一致
  mutate, // 支持立即修改 useRequest 返回的 data 参数。
  fetches,
} = useRequest(service, {
  manual, // true : 自调用执行
  initialData, // 请求未响应前的初始数据
  refreshDeps, // refreshDeps: [userId], 当userId变化时，自请求
  onBefore, // 触发之前
  onSuccess, // 请求成功触发
  onError, // 请求失败触发
  onFinally, // 请求完成触发
  formatResult, // 处理响应的结果后返回到 data
  cacheKey, //SWR 模式 cacheKey: '请求唯一标识' 缓存接口数据，一些数据不是经常变化的接口
  cacheTime, // 设置缓存数据回收时间，如果设置为 -1, 则表示缓存数据永不过期
  staleTime, // 缓存数据保持新鲜时间, 如果设置为 -1，则表示数据永远新鲜
  setCache, // 自定义缓存 配套getCache，设置后cacheKey和cacheTime无效
  getCache, 
  loadingDelay, // 调用后延迟多少m执行 延迟 loading 变为 true 的时间，防止闪烁
  defaultParams, // 首次默认执行时，传递给 service 的参数	
  pollingInterval, // 轮询，pollingInterval: 1000，定时发送请求
  pollingWhenHidden, // 在页面隐藏时，是否继续轮询 true false
  fetchKey,  // 请求分类 并行请求 (id) => id
  refreshOnWindowFocus, // 屏幕聚焦重新请求
  focusTimespan, // 重新请求间隔，单位为毫秒
  debounceInterval, // 防抖
  throttleInterval, // 节流
  ready, // 判断 true 的时候执行，false不执行
  throwOnError, // true ---?
  paginated: true, // 进入分页模式，自动帮你处理表格常见逻辑
  loadMore: true, // 进入加载更多模式,配合其它参数，可以帮你处理上面所有的逻辑。
  retryCount: 3, // 请求失败重试次数
  retryInterval, // 请求失败重试时间间隔
});

// useRequest   fetchKey 请求分类 并行请求
export default () => {
  const { run, fetches } = useRequest(deleteUser, {
    manual: true,
    fetchKey: id => id, // 不同的 ID，分类不同
  });
​
  return (
    <div>
      <Button loading={fetches.A?.loading} onClick={() => { run('A') }}>删除 1</Button>
      <Button loading={fetches.B?.loading} onClick={() => { run('B') }}>删除 2</Button>
      <Button loading={fetches.C?.loading} onClick={() => { run('C') }}>删除 3</Button>
    </div>
  );
};

// 相比 @umijs/use-request 本身， 
import { useRequest } from 'umi'; // 有如下两点差异：

// 1. 按照接口请求规范内置了 formatResult: res => res?.data 让你可以更方便的使用数据，当然你也可以自己配置 formatResult 来覆盖内置的这个逻辑。
// 2. 按照接口错误规范统一了错误处理逻辑
```