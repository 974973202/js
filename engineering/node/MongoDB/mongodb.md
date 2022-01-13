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