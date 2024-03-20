- 启动一个node程序 　　pm2 start app.js        //启动app.js应用

- 添加进程监视 (监听模式启动，当文件发生变化，自动重启)
```js
　　pm2 start app.js --name 程序名 --watch（指定程序名的情况下）
　　pm2 start app.js --watch （未指定程序名的情况下）
```

- 列出所有进程     pm2 ls

- 从进程列表中删除进程
```js
　　pm2 delete [appname] | id
　　pm2 delete app  // 指定进程名删除
 　 pm2 delete 0    // 指定进程id删除
```

- 删除进程列表中所有进程   pm2 delete all（关闭并删除应用）

- 查看某个进程具体情况     pm2 describe app

- 查看进程的资源消耗情况   pm2 monit（ 监控各个应用进程cpu和memory使用情况）

- 重启进程
　　pm2 restart app.js    //同时杀死并重启所有进程，短时间内服务不可用,生成环境慎用
　　pm2 restart all     // 重启所有进程
　　pm2 reload app.js    //重新启动所有进程，0秒重启，始终保持至少一个进程在运行　
　　pm2 gracefulReload all  //以群集模式重新加载所有应用程序

- 查看进程日志
　　 pm2 logs [Name]  //根据指定应用名查看应用日志
   　pm2 logs [ID]   //根据指定应用ID查看应用日志
　   pm2 logs all    // 查看所有进程的日志

- 显示应用程序详细信息pm2 show <appName> [options] 显示指定应用详情
　　pm2 show [Name]   //根据name查看
　　pm2 show [ID]    //根据id查看

- 停止指定应用pm2 stop <appName> [options] 停止指定应用
　　pm2 stop all        //停止所有应用
　　pm2 stop [AppName]    //根据应用名停止指定应用
　　pm2 stop [ID]       //根据应用id停止指定应用

- 杀掉pm2管理的所有进程
    pm2 kill 

- 启动静态服务器,将目录dist作为静态服务器根目录，端口为8080
   pm2 serve ./dist 8080

- 集群模式启动
    -i 表示 number-instances 实例数量
    max 表示 PM2将自动检测可用CPU的数量 可以自己指定数量
   pm2 start app.js -i max //启用群集模式（自动负载均衡）