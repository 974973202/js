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
- 切库 use xx
- 向库里插入数据 db.xx.insert({name:'为民小学',age:10});
- 查看当前库db.getName()
- 删除当前库db.dropDatabase()
- 查看当前库下集合 show collections
- 创建集合 db.createCollection('xx')
- 向集合下插入数据 db.xx.insert({name: 'Lily', age: 8})

## save
- db.xx.save({name: 'Lily', age: 8})
- 和insert的区别 如果不指定 _id 字段 save() 方法类似于 insert() 方法。如果指定 _id 字段，则会更新该 _id 的数据
