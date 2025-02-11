MongoDB 教程[https://www.yuque.com/books/share/27406466-0fb6-48da-88db-0270fbeecb8b]

● MongoDB 是由 C++ 语言编写的，是一个基于分布式文件存储的开源 NoSQL 数据库系统。
● MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
  ○ 这会让曾经使用过关系型数据库的人比较容易上手
● MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。
● MongoDB 的查询功能非常强大
  ○ 不仅支持大部分关系型数据库中的单表查询，还支持范围查询、排序、聚合、MapReduce 等
  ○ MongoDB 的查询语法类似于面相对象的程序语言

### MongoDB 有哪些特点
● 文档型数据库
● 高性能
● 灵活性
● 可扩展性
● 强大的查询语言
● 优异的性能
● 高性能：支持使用嵌入数据时，减少系统I/O负担，支持子文档查询
● 多种查询类型支持，且支持数据聚合查询、文本检索、地址位置查询
● 高可用、水平扩展：支持副本集与分片
● 多种存储引擎：WiredTiger , In-Memory

### MongoDB 适用于哪些场景
1、需要处理大量的低价值数据，且对数据处理性能有较高要求
比如，对微博数据的处理就不需要太高的事务性，但是对数据的存取性能有很高的要求，这时就非常适合使用 MongoDB。

2、需要借助缓存层来处理数据
因为 MongoDB 能高效的处理数据，所以非常适合作为缓存层来使用。将 MongoDB 作为持久化缓存层，可以避免底层存储的资源过载。

3、需要高度的伸缩性
对关系型数据库而言，当表的大小达到一定数量级后，其性能会急剧下降。这时可以使用多台 MongoDB 服务器搭建一个集群环境，实现最大程度的扩展，且不影响性能。

在 Windows 中安装MongoDB[https://www.yuque.com/books/share/27406466-0fb6-48da-88db-0270fbeecb8b/ikyfb5]


非关系型数据库的优势：
  1. 性能NOSQL是基于键值对的，可以想象成表中的主键和值的对应关系，而且不需要经过SQL层的解析，所以性能非常高。
  2. 可扩展性同样也是因为基于键值对，数据之间没有耦合性，所以非常容易水平扩展。

关系型数据库的优势：
  1. 复杂查询可以用SQL语句方便的在一个表以及多个表之间做非常复杂的数据查询。
  2. 事务支持使得对于安全性能很高的数据访问要求得以实现。对于这两类数据库，对方的优势就是自己的弱势，反之亦然。

MongoDB Server 2.4.x: mongoose ^3.8 or 4.x
MongoDB Server 2.6.x: mongoose ^3.8.8 or 4.x
MongoDB Server 3.0.x: mongoose ^3.8.22, 4.x, or 5.x
MongoDB Server 3.2.x: mongoose ^4.3.0 or 5.x
MongoDB Server 3.4.x: mongoose ^4.7.3 or 5.x
MongoDB Server 3.6.x: mongoose 5.x
MongoDB Server 4.0.x: mongoose ^5.2.0
MongoDB Server 4.2.x: mongoose 7.x