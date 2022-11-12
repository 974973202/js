### 下载mongodb
- curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-4.0.13.tgz

### 解压下载的tgz包
- tar -zxvf  mongodb-linux-x86_64-4.0.13.tgz

### 创建服务器存放mongodb的目录/usr/local/mongodb，并将解压完的mongodb目录移动到/usr/local/mongodb下
- mkdir -p /usr/local/mongodb
- mv mongodb-linux-x86_64-4.0.13/* /usr/local/mongodb/ 

### 创建存放mongodb文件的相关目录
cd  /usr/local/mongodb
mkdir -p data/db        #数据库目录
mkdir -p logs           #日志目录
mkdir -p conf           #配置文件目录
mkdir -p pids           #进程描述文件目录

### 添加mongodb的相关配置文件信息
cd  /usr/local/mongodb/conf
vim mongo.conf #创建mongodb相关配置文件

### mongo.conf配置信息如下：
dbpath=/usr/local/mongodb/data/db  #数据存放位置
logpath=/usr/local/mongodb/logs/mongodb.log #日志存放位置
pidfilepath=/usr/local/mongodb/pids/mongodb.pid #进程描述文件
logappend=true
journal=true
quiet=true
port=27017 #端口号
fork=true #开启子进程,后台运行
bind_ip=0.0.0.0 #允许任何IP进行连接
auth=false #是否授权连接

### 添加系统环境变量配置
vim /etc/profile
- 在编辑文件中加入
export MONGODB_HOME=/usr/local/mongodb
export PATH=$PATH:$MONGODB_HOME/bin
- 编辑完后，使文件生效
source /etc/profile

### 通过配置文件启动mongdb服务
/usr/local/mongodb/bin/mongod -f /usr/local/mongodb/conf/mongo.conf

### 创建mongo登录用户
mongo #运行mongo服务
use admin #切换admin库
- 创建系统级别的user 用户名：root  密码：123456
db.createUser({ user: 'root', pwd: '123456',roles: [ { role: "root", db: "admin" }] })

### 修改mongo.conf 中配置属性auth=true
- 先停止之前运行的mongodb服务
 ps -ef|grep mongo // 找到id
 kill -2 pid  // pid === 找到的mongo id

- 修改conf文件夹下配置
- cd /usr/local/mongodb/conf/mongo.conf
auth=true

- 再次启动mongo服务
/usr/local/mongodb/bin/mongod -f /usr/local/mongodb/conf/mongo.conf

### 阿里云安全组配置开放27017 端口
