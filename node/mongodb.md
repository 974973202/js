## 启动mongoDB



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