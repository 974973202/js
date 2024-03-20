### nginx安装 版本：1.16.1
  1. https://www.runoob.com/linux/nginx-install-setup.html 
  2. 使用nginx -t 等命令时 报错：nginx: command not found
  ```js
  这是环境变量未配置
  配置环境变量 vim /etc/profile  --- #   /usr/local/webserver/nginx/sbin 是nginx 安装路径

  /usr/local/webserver/nginx/sbin/nginx # 启动
  /usr/local/webserver/nginx/sbin/nginx -s reload # 重新载入配置文件
  /usr/local/webserver/nginx/sbin/nginx -s reopen # 重启 Nginx
  /usr/local/webserver/nginx/sbin/nginx -s stop # 停止 Nginx
  killall nginx #杀死所有nginx进程
  ```
  ![](/ng1.png)

### git安装
  yum -y install git

### nvm
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
　　　 source ~/.bashrc // 使当前shell读入路径为filepath的shell文件并依次执行文件中的所有语句，通常用于重新执行刚修改的初始化文件，使之立即生效，而不必注销并重新登录

### node安装
  nvm i stable  // 最新稳定版
  ```js
  // 使用nvm安装node，运行node报错 node: command not found
  1. 使用nvm安装node之后，直接运行node命令会报错 node: command not found
  需要使用nvm ls  查询一下当前使用的安装的node版本，然后使用node use 版本号 ，在运行node -v 就可以了

  2. 但是当重新连接服务器后，运行node又会报错 node: command not found
  这时候我们需要手动配置一下
  查询node路径：whereis node（先nvm use 一下，不然会查不到路径）
  ln -s node路径 /usr/local/bin/node

  3 运行npm -v 报错： npm: command not found
  和node步骤一样，查询路径 --> ln -s(创建软链接
  ```


  ```js
    安装 Node.js
    执行以下命令，下载 Node.js。
    wget https://npmmirror.com/mirrors/node/v16.13.2/node-v16.13.2-linux-x64.tar.xz
    执行以下命令，解压 Node.js 的安装包。
    tar -xvf node-v16.13.2-linux-x64.tar.xz
    执行以下命令，移动并重命名 Node.js 安装目录。
    mv node-v16.13.2-linux-x64/ /usr/local/node
    3. 配置 Node.js
    执行以下命令，将 Node.js 的可执行文件目录加入到系统环境变量中。
    echo "export PATH=$PATH:/usr/local/node/bin" >> /etc/profile
    执行以下命令，使刚配置的 Node.js 环境变量立即生效。
    source /etc/profile
    执行以下命令，分别查看 node 和 npm 版本。
    node -v
    npm -v
  ```

### forever 
  npm i forever -g 
　　  forever list 正在守护的项目
　　  forever stop 项目目录  停止守护
　　  forever start (app.js)项目目录 开启守护
 - 可以用pm2代替forever

### 部署web


### 部署node.js
```js
  服务器：
        cd /var/www
        mkdir react_demo_server
    找到之前创建的server  不需要上传 node_modules 太大了
    　　dos ：scp -r C://Users/W10003705/Desktop/react_demo_koa/* root@149.129.104.166:/var/www/react_demo_server  
        或者下载： WinSCP
　　　　 服务器： 
　　　　　　　　1. cd /var/www/react_demo_server  // 切换到server文件夹
　　　　　　　　2. npm i    // 下载依赖
　　　　　　　　3. node server.js // 运行
　　　　我的配置的是4000端口，需要在阿里云控制台添加安全组规则　　

　　在测试页 点击测试 查看控制台看到返回结果则前后端部署完成
　　
　　最后使用forever 来守护node进程（如果我们直接用node去运行，当关闭服务器远程链接时，ndoe服务也会关闭）
　　forever start /var/www/react_demo_server/server.js
```