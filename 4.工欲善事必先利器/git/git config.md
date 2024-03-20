1. 下载 Git 下载地址 (https://git-scm.com/downloads)
2. ssh-keygen -t rsa -C 'xxx@xxx.com'
3. ~/.ssh/id_rsa.pub
git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"

### .git/hooks中预定义的Git钩子

- Git可以定制一些钩子，这些钩子可以在特定的情况下被执行，分为Client端的钩子和Server端的钩子。
Client 端钩子被operation触发，比如commit，merge等
Server 端钩子被网络动作触发，比如pushed commits。

- ClientSide hooks：
1. pre-commit：在提交代码之前执行，可以用来检查代码是否符合规范、是否有错误等。
2. prepare-commit-msg：在Git为提交准备消息时执行，可以用来自动生成提交信息。
3. commit-msg：在Git提交消息后执行，可以用来检查提交信息是否符合规范。
4. post-commit：在提交代码之后执行，可以用来触发一些后续操作，比如自动化部署、发送通知等。
5. pre-rebase：在执行Git rebase操作之前执行，可以用来检查是否有冲突、是否有未提交的代码等。
6. post-rewrite：在Git重写提交历史时执行，可以用来更新相关的提交信息。
7. post-checkout：在Git checkout操作之后执行，可以用来触发一些额外的操作，比如更新依赖、重新编译代码等。
8. pre-push：在执行Git push操作之前执行，可以用来检查代码是否符合规范、是否有错误等。

- ServerSide hooks:
1. pre-receive, 当收到push动作之前会被执行。
2. update, 也是收到push动作之前被执行，但是有可能被执行多次，每个branch一次。
3. post-receive, 当push动作已经完成的时候会被触发，可以用此hook来 push notification等，比如发邮件，通知持续构建服务器等。



