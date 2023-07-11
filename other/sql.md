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
```sql
  SELECT * FROM Websites LIMIT 2;
  SELECT TOP 50 PERCENT * FROM Websites;
```

### LIKE 用于在 WHERE 子句中搜索列中的指定模式
```sql
-- 选取 name 以字母 "G" 开始的所有客户
SELECT * FROM Websites WHERE name LIKE 'G%';
-- 选取 name 以字母 "k" 结尾的所有客户
SELECT * FROM Websites WHERE name LIKE '%k';
-- 选取 name 包含模式 "oo" 的所有客户
SELECT * FROM Websites WHERE name LIKE '%oo%';
```

### SQL 通配符 与 SQL LIKE 操作符一起使用
- % 替代 0 个或多个字符
- _替代一个字符

### IN 操作符允许您在 WHERE 子句中规定多个值
```sql
-- 选取 name 为 "Google" 或 "菜鸟教程
SELECT * FROM Websites WHERE name IN ('Google','菜鸟教程');
```

### BETWEEN 操作符选取介于两个值之间的数据范围内的值
```sql
-- 选取 alexa 介于 1 和 20 之间但 country 不为 USA 和 IND 的所有网站
SELECT * FROM Websites WHERE (alexa BETWEEN 1 AND 20) AND country NOT IN ('USA', 'IND');
-- 选取 name 不介于 'A' 和 'H' 之间字母
SELECT * FROM Websites WHERE name NOT BETWEEN 'A' AND 'H';
```

### SQL 别名 AS

### 连接 JOIN 用于把来自两个或多个表的行结合起来
```sql
-- "Websites" 表中的 "id" 列指向 "access_log" 表中的字段 "site_id" 找两个表中id和site_id相同的数据
SELECT Websites.id, Websites.name, access_log.count, access_log.date
FROM Websites
INNER JOIN access_log
ON Websites.id=access_log.site_id;

-- INNER JOIN 关键字在表中存在至少一个匹配时返回行。交集
-- Websites表的id列等于access_log表的site_id列
SELECT Websites.name, access_log.count, access_log.date
FROM Websites
INNER JOIN access_log
ON Websites.id=access_log.site_id 
ORDER BY access_log.count;

-- LEFT JOIN 关键字从左表（table1）返回所有的行
SELECT Websites.name, access_log.count, access_log.date
FROM Websites
LEFT JOIN access_log
ON Websites.id=access_log.site_id
ORDER BY access_log.count DESC;

-- RIGHT JOIN 关键字从右表（table2）返回所有的行
-- FULL OUTER JOIN 关键字结合了 LEFT JOIN 和 RIGHT JOIN 的结果
```

### UNION 操作符合并两个或多个 SELECT 语句的结果
```sql
-- 从 "Websites" 和 "apps" 表中选取所有不同的country（只有不同的值）;  UNION ALL 所有值
SELECT country FROM Websites
UNION
SELECT country FROM apps
ORDER BY country;
```

### SELECT INFO 从一个表复制信息到另一个新表
```sql
SELECT *
INTO WebsitesBackup2016
FROM Websites
WHERE country='CN';
```

### INSERT INTO SELECT 语句从一个表复制数据，然后把数据插入到一个已存在的表中
```sql
INSERT INTO Websites (name, country)
SELECT app_name, country FROM apps
WHERE id=1;
```

### SQL 约束 通过 CREATE TABLE 语句 或 通过 ALTER TABLE 语句
- NOT NULL - 指示某列不能存储 NULL 值。
- UNIQUE - 保证某列的每行必须有唯一的值。
- PRIMARY KEY - NOT NULL 和 UNIQUE 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
- FOREIGN KEY - 保证一个表中的数据匹配另一个表中的值的参照完整性。
- CHECK - 保证列中的值符合指定的条件。
- DEFAULT - 规定没有给列赋值时的默认值