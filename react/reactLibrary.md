react-use详情
1 传感器
useBattery — 跟踪设备电池状态。图片
useGeolocation — 跟踪用户设备的地理位置状态。图片
useHover and useHoverDirty — 跟踪鼠标悬停某个元素的状态。图片
useHash —跟踪用户hash变化。图片
useIdle — 跟踪用户是否处于非活动状态。
useIntersection — 跟踪元素的视窗变化区域（用于懒加载IntersectionObserver）图片
useKey, useKeyPress, useKeyboardJs, and useKeyPressEvent — 追踪按键。图片
useLocation and useSearchParam — 跟踪页面导航栏的位置状态。
useLongPress — 跟踪某些元素的长按手势。
useMedia —跟踪 CSS 媒体查询的状态。图片
useMediaDevices — 跟踪连接的硬件设备的状态。
useMotion — 跟踪设备运动传感器的状态。
useMouse and useMouseHovered — 跟踪鼠标位置的状态。图片
useMouseWheel — 跟踪滚动鼠标滚轮的 deltaY。图片
useNetworkState — 跟踪浏览器网络连接的状态。图片
useOrientation — 跟踪设备屏幕方向的状态。
usePageLeave — 当鼠标离开页面边界时触发。
useScratch — 跟踪鼠标点击和滑动状态。
useScroll — 跟踪 HTML 元素的滚动位置。图片
useScrolling — 跟踪 HTML 元素是否正在滚动。
useStartTyping — 检测用户何时开始输入。
useWindowScroll — 跟踪窗口滚动位置。图片
useWindowSize — 跟踪窗口尺寸。图片
useMeasure and useSize — 跟踪 HTML 元素的尺寸。图片
createBreakpoint — 跟踪 innerWidth
useScrollbarWidth — 检测浏览器的原生滚动条宽度。图片

2 UI
useAudio — 播放音频并展示其控件。图片
useClickAway —当用户点击目标区域外时触发回调。
useCss — 动态调整 CSS。
useDrop and useDropArea — 跟踪文件、链接和复制粘贴放置。
useFullscreen —全屏显示元素或视频。图片
useSlider — 在任何 HTML 元素上提供滑动行为。图片
useSpeech — 从文本字符串合成语音。图片
useVibrate — 使用振动 API 提供物理反馈。Vibration API.图片
useVideo — 播放视频、跟踪其状态并展示播放控件。图片

3 Animations
useRaf —在每个 requestAnimationFrame 上重新渲染组件。
useInterval and useHarmonicIntervalFn — 使用 setInterval 在设定的间隔上重新渲染组件。
useSpring — 根据弹簧动力学随时间插入数字。
useTimeout — 超时后重新渲染组件。
useTimeoutFn — 超时后调用给定函数。图片
useTween — 重新渲染组件，同时对从 0 到 1 的数字进行补间。图片
useUpdate —返回一个回调，它在调用时重新渲染组件。

4 Side-effects
useAsync, useAsyncFn, and useAsyncRetry — 解析异步函数。
useBeforeUnload — 当用户尝试重新加载或关闭页面时显示浏览器警报。
useCookie — 提供读取、更新和删除 cookie 的方法。图片
useCopyToClipboard — 将文本复制到剪贴板。
useDebounce —函数去抖]图片
useError — 错误调度程序。图片
useFavicon — 设置页面的 favicon。
useLocalStorage — 管理 localStorage 中的值。
useLockBodyScroll — 锁定主体元素的滚动。
useRafLoop — 在 RAF 循环内调用给定的函数。
useSessionStorage — 管理 sessionStorage 中的值。
useThrottle and useThrottleFn — throttles a function.图片
useTitle — 置页面的标题。
usePermission — 查询浏览器 API 的权限状态。

5 Lifecycles
useEffectOnce — 修改后的 useEffect 钩子，只运行一次。
useEvent — 订阅事件。
useLifecycles — calls mount and unmount callbacks.
useMountedState and useUnmountPromise — 踪组件是否已安装。
usePromise — resolves promise only while component is mounted.
useLogger — 在组件经历生命周期时控制台打印。
useMount — 调用挂载回调。
useUnmount — 调用卸载回调。
useUpdateEffect — 仅对更新运行效果。
useIsomorphicLayoutEffect — 服务端渲染时不显示警告的 useLayoutEffect。
useDeepCompareEffect, useShallowCompareEffect, and useCustomCompareEffect — 根据其依赖项的深度比较运行效果

6 State
createMemo — 记忆钩子工厂。
createReducer — 带有自定义中间件的 reducer 钩子工厂。
createReducerContext and createStateContext — 组件之间共享状态的钩子工厂。
useDefault — 当 state 为 null 或 undefined 时返回默认值。
useGetSet — 返回状态 getter get() 而不是原始状态。
useGetSetState — as if useGetSet and useSetState had a baby（这句原谅我不厚道的笑了）.
useLatest — 返回最新的 state 或 props
usePrevious — 返回最新的  state 或 props.图片
usePreviousDistinct — 与 usePrevious 类似，但使用谓词来确定是否应更新以前的内容。
useObservable — 跟踪 Observable 的最新值。
useRafState — 创建仅在 requestAnimationFrame 之后更新的 setState 方法。图片
useSetState — 创建类似于 this.setState 的 setState 方法。图片
useStateList —循环迭代数组。图片
useToggle and useBoolean — 跟踪布尔值的状态。图片
useCounter and useNumber — 跟踪数字的状态。图片
useList and useUpsert — 跟踪数组的状态。图片
useMap — — 跟踪对象的状态。图片
useSet — 跟踪 Set 的状态。图片
useQueue —实现简单的队列。
useStateValidator — 跟踪对象的状态
useStateWithHistory — 存储先前的状态值并提供遍历它们的句柄
useMultiStateValidator — 与 useStateValidator 类似，但一次跟踪多个状态
useMediatedState —与常规 useState 类似，但通过自定义函数进行调解
useFirstMountState —检查当前渲染是否是第一个
useRendersCount — 计算组件渲染
createGlobalState — 跨组件共享状态
useMethods — useReducer 的简洁替代品

7 其他各种各样的
useEnsuredForwardedRef and ensuredForwardRef — 安全地使用 React.forwardedRef