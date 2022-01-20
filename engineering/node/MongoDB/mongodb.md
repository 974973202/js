## 启动mongoDB
E:\MongoDB\bin\mongod --dbpath E:\data\db

## 连接
E:\MongoDB\bin\mongo.exe

## 配置 net start MongoDB
E:\MongoDB\bin\mongod.exe --config "E:\MongoDB\mongod.cfg" --install

- 错误： net start MongoDB 服务没有响应控制功能。  请键入 NET HELPMSG 2186 以获得更多的帮助。
- 解决办法： https://blog.csdn.net/sl_world/article/details/82181731
```
mongod --dbpath "E:\MongoDB\data\db" --logpath "E:\MongoDB\data\log\mongo.log" --install --serviceName "MongoDB"
```

### show dbs
- 有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。
1. admin： 从权限的角度来看，这是"root"数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
2. local: 这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
3. config: 当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息



- 查所有库 show dbs
- 切库/创建 use xx
- 向库里插入数据 db.xx.insert({name:'为民小学',age:10});
- 查看当前库db.getName()
- 删除当前库db.dropDatabase()
- 查看当前库下集合 show collections
- 创建集合 db.createCollection('xx')
- 向集合下插入数据 db.xx.insert({name: 'Lily', age: 8})
- 插入单个文档到集合中 db.xx.insertOne()
- 插入多个文档到集合中 db.xx.insertMany()
## save
- db.xx.save({name: 'Lily', age: 8})
- 和insert的区别 如果不指定 _id 字段 save() 方法类似于 insert() 方法。如果指定 _id 字段，则会更新该 _id 的数据

### MongoDB 图形管理界面
● Robo 3T
● Studio 3T
● Navicat
● MongoDB Compass

## 基础操作（若数据库名为collection）
- 创建文档
- 插入单个文档到集合中 db.collection.insertOne()
- 插入多个文档到集合中 db.collection.insertMany([{}, {}])
- 向集合下插入数据 db.collection.insert({name: 'Lily', age: 8})
  在 MongoDB 中，存储在集合中的每个文档都需要一个唯一的 _id 字段作为主键。如果插入的文档省略 _id 字段，则 MongoDB 驱动程序会自动为 _id 字段生成 ObjectId

- 查询文档
```
● db.collection.find(query, projection)
  ○ query ：可选，使用查询操作符指定查询条件
  ○ projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。
● db.collection.findOne()
```
- 查询所有 db.inventory.find()
  格式化打印结果  db.myCollection.find().pretty()
- 指定返回的文档字段
  db.inventory.find({}, {
    item: 1,
    qty: 1
  })

- 相等条件查询 db.inventory.find( { status: "D" } )
- 指定 OR 条件
```js
  // 使用 $or 运算符，您可以指定一个复合查询
  // 例检索状态为 A 或数量小于 $lt30 的集合
  db.inventory.find({
    $or: [
      { status: "A" },
      { qty: { $lt: 30 } }
    ]
  })
```
- 指定 AND 和 OR 条件
```js
  // 复合查询文档选择状态为“ A”且qty小于（$ lt）30或item以字符p开头的
  db.inventory.find({
    status: "A",
    $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
  })
```

### 查询运算符
- 比较运算符：
$eq	匹配等于指定值的值。
$gt	匹配大于指定值的值。
$gte	匹配大于或等于指定值的值。
$in	匹配数组中指定的任何值。
$lt	匹配小于指定值的值。
$lte	匹配小于或等于指定值的值。
$ne	匹配所有不等于指定值的值。
$nin	不匹配数组中指定的任何值。
- 逻辑运算符：
$and	将查询子句与逻辑连接，并返回与这两个子句条件匹配的所有文档。
$not	反转查询表达式的效果，并返回与查询表达式不匹配的文档。
$nor	用逻辑NOR连接查询子句，返回所有不能匹配这两个子句的文档。
$or	用逻辑连接查询子句，或返回与任一子句条件匹配的所有文档。

```js
// 匹配嵌套文档
// 查询嵌套字段
// 查询数组中的元素
```

### 更新操作
● db.collection.updateOne(<filter>, <update>, <options>)
● db.collection.updateMany(<filter>, <update>, <options>)
● db.collection.replaceOne(<filter>, <update>, <options>)
```js
// 更新单个数据
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)
// ● 使用 $set 运算符将 size.uom 字段的值更新为 cm，将状态字段的值更新为 P
// ● 使用 $currentDate 运算符将 lastModified 字段的值更新为当前日期。如果 lastModified 字段不存在，则 $currentDate 将创建该字段。

// 更新多个数据
db.inventory.updateMany(
   { "qty": { $lt: 50 } },
   {
     $set: { "size.uom": "in", status: "P" },
     $currentDate: { lastModified: true }
   }
)
// ● 使用 $set 运算符将 size.uom 字段的值更新为 "in"，将状态字段的值更新为 "p"
// ● 使用 $currentDate 运算符将 lastModified 字段的值更新为当前日期。如果 lastModified 字段不存在，则 $currentDate 将创建该字段。

// 替换数据   替换 _id 字段以外的文档的全部内容
db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 } ] }
)
```

### 删除操作
● db.collection.deleteMany()
● db.collection.deleteOne()
```js
db.inventory.deleteMany() // 删除所有
db.inventory.deleteMany({ status : "A" }) // 删除特定
db.inventory.deleteOne( { status: "D" } ) // 删除一个
```

### node 连接 MongoDB
```js
const { MongoClient, ObjectID } = require('mongodb')

const client = new MongoClient('mongodb://127.0.0.1:27017', {
  useUnifiedTopology: true
})

async function run () {
  try {
    // 开始连接
    await client.connect()
    const testDb = client.db('test')
    const inventoryCollection = testDb.collection('inventory')

    // 创建文档
    const ret = await inventoryCollection.insertOne({
      a: 1,
      b: '2',
      c: true,
      d: [1, 2, 3]
    })

    console.log(ret)


    // 查询文档
    const ret = await inventoryCollection.findOne({
      item: 'notebook'
    })

    // find()  ret.toArray()
    // findOne() ret
    // console.log(ret)
    console.log(await ret.toArray())

    // 删除文档
    // const ret = await inventoryCollection({
    //   _id: ObjectID('5fa5164f95060000060078b1')
    // })
    // console.log(ret)

    // 更新文档
    const ret = await inventoryCollection.updateOne({
      _id: ObjectID('5fa5164f95060000060078af')
    }, {
      $set: {
        qty: 100
      }
    })
    console.log(ret)


  } catch (err) {
    // 连接失败
    console.log('连接失败', err)
  } finally {
    // 关闭连接
    await client.close()
  }
}
run()

```

### MongoDB 连接 WEB
```js
// 接口设计
GET /collection：返回资源对象的列表（数组）
GET /collection/resource：返回单个资源对象
POST /collection：返回新生成的资源对象
PUT /collection/resource：返回完整的资源对象
PATCH /collection/resource：返回完整的资源对象
DELETE /collection/resource：返回一个空文档




// 使用 Express 快速创建 Web 服务
const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')

const connectUri = 'mongodb://localhost:27017'

const dbClient = new MongoClient(connectUri)

const app = express()

// 配置解析请求体数据 application/json
// 它会把解析到的请求体数据放到 req.body 中
// 注意：一定要在使用之前就挂载这个中间件
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/articles', async (req, res, next) => {
  try {
    // 1. 获取客户端表单数据
    const { article } = req.body

    // 2. 数据验证
    if (!article || !article.title || !article.description || !article.body) {
      return res.status(422).json({
        error: '请求参数不符合规则要求'
      })
    }

    // 3. 把验证通过的数据插入数据库中
    //    成功 -> 发送成功响应
    //    失败 -> 发送失败响应
    await dbClient.connect()

    const collection = dbClient.db('test').collection('articles')

    article.createdAt = new Date()
    article.updatedAt = new Date()
    const ret = await collection.insertOne(article)

    article._id = ret.insertedId
    
    res.status(201).json({
      article
    })
  } catch (err) {
    // 由错误处理中间件统一处理
    next(err)
    // res.status(500).json({
    //   error: err.message
    // })
  }
})

app.get('/articles', async (req, res, next) => {
  try {
    let { _page = 1, _size = 10 } = req.query
    _page = Number.parseInt(_page)
    _size = Number.parseInt(_size)
    await dbClient.connect()
    const collection = dbClient.db('test').collection('articles')
    const ret = await collection
      .find() // 查询数据
      .skip((_page - 1) * _size) // 跳过多少条 10 1 0 2 10 3 20 n
      .limit(_size) // 拿多少条
    const articles = await ret.toArray()
    const articlesCount = await collection.countDocuments() // 获取数据条数
    res.status(200).json({
      articles,
      articlesCount
    })
  } catch (err) {
    next(err)
  }
})

app.get('/articles/:id', async (req, res, next) => {
  try {
    await dbClient.connect()
    const collection = dbClient.db('test').collection('articles')

    const article = await collection.findOne({
      _id: ObjectID(req.params.id)
    })

    res.status(200).json({ article })
  } catch (err) {
    next(err)
  }
})

app.patch('/articles/:id', async (req, res, next) => {
  try {
    await dbClient.connect()
    const collection = dbClient.db('test').collection('articles')

    await collection.updateOne({
      _id: ObjectID(req.params.id)
    }, {
      $set: req.body.article
    })

    const article = await await collection.findOne({
      _id: ObjectID(req.params.id)
    })

    res.status(201).json({ article })
  } catch (err) {
    next(err)
  }
})

app.delete('/articles/:id', async (req, res, next) => {
  try {
    await dbClient.connect()
    const collection = dbClient.db('test').collection('articles')
    await collection.deleteOne({
      _id: ObjectID(req.params.id)
    })
    res.status(204).json({})
  } catch (err) {
    next(err)
  }
})

// 它之前的所有路由中调用 next(err) 就会进入这里
// 注意：4个参数，缺一不可
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message
  })
})

app.listen(3000, () => {
  console.log('app listenning at port 3000.')
})
```

### express中间件
1.应用程序中间件
2.路由级别中间件 router = express.Router()
3.错误处理中间件
4.内置中间件
5.第三方中间件