### sql 不区分大小写
- SQL 分为两个部分：数据操作语言 (DML) 和 数据定义语言 (DDL)
- SQL (结构化查询语言)是用于执行查询的语法
- SQL 语言也包含用于更新、插入和删除记录的语法

> 查询和更新指令构成了 SQL 的 DML 部分
- select  从数据库表中获取数据
- update  更新数据库表中的数据
- delete  从数据库表中删除数据
- insert info  向数据库表中插入数据

> SQL 的数据定义语言 (DDL) 部分使我们有能力创建或删除表格
- create database - 创建新数据库
- alter DATABASE - 修改数据库
- create TABLE - 创建新表
- alter TABLE - 变更（改变）数据库表
- drop TABLE - 删除表
- create INDEX - 创建索引（搜索键）
- drop INDEX - 删除索引

### distinct 返回唯一不同的值
- 在表中，可能会包含重复值。这并不成问题，不过，有时您也许希望仅仅列出不同（distinct）的值
```sql
    SELECT DISTINCT 列名称 FROM 表名称
```

### where 有条件地从表中选取数据
```sql
    SELECT 列名称 FROM 表名称 WHERE 列 运算符 值
    SELECT * FROM Persons WHERE City='Beijing'  -- 选取居住在城市 "Beijing" 中的人
    SELECT * FROM Persons WHERE Year>1965

    -- SQL 使用单引号来环绕文本值（大部分数据库系统也接受双引号）。如果是数值，请不要使用引号
```

### AND 和 OR
- AND 和 OR 可在 WHERE 子语句中把两个或多个条件结合起来
- 如果第一个条件和第二个条件都成立，则 AND 运算符显示一条记录
- 如果第一个条件和第二个条件中只要有一个成立，则 OR 运算符显示一条记录
```sql
    SELECT * FROM Persons WHERE FirstName='Thomas' AND LastName='Carter'
    SELECT * FROM Persons WHERE firstname='Thomas' OR lastname='Carter'
    SELECT * FROM Persons WHERE (FirstName='Thomas' OR FirstName='William') AND LastName='Carter'
```

### order by 排序
- ORDER BY 语句用于根据指定的列对结果集进行排序。
- ORDER BY 语句**默认按照升**序对记录进行排序。
- 如果您希望按照降序对记录进行排序，可以使用 DESC 关键字。
```sql
    SELECT Company, OrderNumber FROM Orders ORDER BY Company
    SELECT Company, OrderNumber FROM Orders ORDER BY Company, OrderNumber
    SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC
    SELECT Company, OrderNumber FROM Orders ORDER BY Company DESC, OrderNumber ASC -- 先根据Company降序，相同的Company再根据OrderNumber升序
```

### insert info  向数据库表中插入数据
```sql
    INSERT INTO 表名称 VALUES (值1, 值2,....)
    INSERT INTO Persons VALUES ('Gates', 'Bill', 'Xuanwumen 10', 'Beijing')

    INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
    INSERT INTO Persons (LastName, Address) VALUES ('Wilson', 'Champs-Elysees')
```

### update 语句用于修改表中的数据
```sql
    UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
    UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson' 
    UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing' WHERE LastName = 'Wilson'
```

### DELETE 语句用于删除表中的行
```sql
    DELETE FROM 表名称 WHERE 列名称 = 值
    DELETE FROM Person WHERE LastName = 'Wilson'
```

### TOP 子句用于规定要返回的记录的数目
