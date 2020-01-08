### 如何使用 react hooks 实现一个计数器的组件
```
  function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {
      const timer = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }, [])

    return <h1>{count}</h1>
  }
```

### React.Fiber 原理
- [React.Fiber原理]https://www.youtube.com/watch?v=ZCuYPiUIONs

### 基础react面试
- [常见react面试题汇总（适合中级前端）]https://segmentfault.com/a/1190000016885832?utm_source=tag-newest