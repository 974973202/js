### Next.js 有两套路由解决方案，
之前的方案称之为“Pages Router”，
目前的方案称之为“App Router” Next.js v13

### App Router方案
- 约定了文件：布局（layout.js）、模板（template.js）、加载状态（loading.js）、错误处理（error.js）、404（not-found.js）

### CSR、SSR、SSG、ISR 都可以混合使用

#### CSR 客户端渲染
- 首页渲染和SEO

#### SSR 服务端渲染
- 响应时间会更长渲染快，对应到性能指标 TTFB (Time To First Byte)，SSR 更长

#### SSG 静态站点生成  getStaticProps
- 将页面编译为静态的 HTML 文件
详细点说就是打开一篇博客文章页面，既然所有人看到的内容都是一样的，没有必要在用户请求页面的时候，服务端再请求接口

### ISR 增量静态再生
- 博客的主体内容也许是不变的，但像比如点赞、收藏这些数据总是在变化的。使用 SSG 编译成 HTML 文件后，这些数据就无法准确获取了，那你可能就退而求其次改为 SSR 或者 CSR 了。

所以Next.js 提出了 ISR
- 只用在 getStaticProps 中添加一个 revalidate
- revalidate表示当发生请求的时候，至少间隔多少秒才更新页面

### RSC React Server Components 
- RSC Payload 的渲染是在服务端，但不会一开始就返回给客户端，而是在客户端请求相关组件的时候才返回给客户端，RSC Payload 会包含组件渲染后的数据和样式，客户端收到 RSC Payload 后会重建 React 树，修改页面 DOM

### Next.js v13 推出了基于 React Server Component 的 App Router 路由解决方案

nextjs12
getStaticProps 在每次构建的时候调用
getStaticPaths 用于定义预渲染的路径
getStaticPaths 定义了哪些路径被预渲染，getStaticProps获取路径参数，请求数据传给页面。

getServerSideProps 在每次请求的时候被调用
getInitialProps