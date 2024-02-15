[最常见的Git问题和操作清单汇总]https://juejin.im/post/5d5d61e96fb9a06ace5254bd

- 本地分支改名： git branch -m old_branch new_branch
- 删除本地分支： git branch -d <BranchName>

- 删除远程分支： git push origin --delete <BranchName>

- 查看包版本信息 npm view xxx versions

### 场景：
1. 当前分支开发到了一半需要紧急切换其他分支，如果不提交，可能不允许切换分支或者出现把当前的修改带到了新的分支的情况，所有先提交一个临时的，回头再次开发；
2. 当前分支开功能开发完了，提交一版本，一会发现有问题，可能只是一行代码，在提交一次。来来回回提交了好几次代码；
- 针对这两种情况：
1. 可以使用 **git stash**，去暂时保存，但不提交代码，等切换回分支的时候，再读取出来开发 **git stash apply**；
- 保存当前未commit的代码  git stash
- 保存当前未commit的代码并添加备注  git stash save "备注的内容"
- 列出stash的所有记录  git stash list
- 删除stash的所有记录  git stash clear
- 应用最近一次的stash  git stash apply
- 应用最近一次的stash，随后删除该记录  git stash pop
- 删除最近的一次stash  git stash drop

2. 撤销 commit
> 这时候可以用 **git reset --soft HEAD^**，撤销上一次提交到暂存区，并重新提交内容；
> 注意：该方法一定要在未提交到远程的commit进行操作，千万不要提交到远程之后在执行此命令。
> HEAD^的意思是上一个版本，也可以写成HEAD~1
> 如果你进行了2次commit，想都撤回，可以使用HEAD~2

3. git commit --amend
> 顺便说一下，如果commit注释写错了，只是想改一下注释，只需要：
> git commit --amend #对最近一次的提交的信息进行修改,此操作会修改 commit 的 hash 值
> 此时会进入默认vim编辑器，修改注释完毕后保存就好了。
- 也相当于 git commit --amend --only -m 'xxxxxxx'  用一条命令一次完成次

4. 撤销 push 
> git push -f origin HEAD^:xxx (分支名)

### git commit
feat：新增功能
fix：bug 修复
docs：文档更新
style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
refactor：重构代码(既没有新增功能，也没有修复 bug)
perf：性能, 体验优化
test：新增测试用例或是更新现有测试
build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
chore：不属于以上类型的其他类，比如构建流程, 依赖管理
revert：回滚某个更早之前的提交

git commit -am  #等同于 git add . && git commit -m

### 从tabs切换个分支
git checkout -b 2.12.10 2.12.9-release
git checkout -b 新分支 原tag分支名

### Git 合并两个分支内容
1. 将开发分支代码合入到master中
```
git checkout dev           #切换到dev开发分支
git pull
git checkout master
git merge dev              #合并dev分支到master上
git push origin master     #将代码推到master上
```

2. 将master的代码同步更新到开发分支中
   merge方法：保证主干提交线干净(可以安全回溯)
```
git checkout master
git pull
git checkout dev
git merge master
git pull origin dev
```

git status
查看文件状态， 是否被跟踪 ，暂存区 ，
git rm --cached <file>
用来撤销进入暂存区操作
git log
查看提交信息

### git命令绑定远程链接
1. git remote add origin xxx
2. git remove -v

### 合并分支中rebase和merge的区别
- merge会保留分支记录，rebase则不会
- git merge 会让2个分支的提交按照提交时间进行排序，并且会把最新的2个commit合并成一个commit。最后的分支树呈现非线性的结构
- git reabse 将dev的当前提交复制到master的最新提交之后，会形成一个线性的分支树

### 添加子模块
git submodule add https://github.com/chaconinc/DbConnector

### 查看包的信息
- 查看包的版本号 npm view xxx versions
- 查看包版本的发布时间 npm view xxx time

### fork 
git remote -v 
git remote add upstream git@github.com:xxx/xxx.git
git fetch upstream
git merge upstream/master
git push

### --
代码 fork 一份到自己的仓库
git clone https://github.com/xxx.git
cd xxx
// 添加主代码库
git remote add upstream https://github.com/xxx.git

// 拉去主仓库的代码
git fetch upstream
// 同步对应分支的代码
git rebase upstream/master
git rebase upstream/feature

// 先从 master 切换至 feature
git checkout feature
// 然后从 feature 上切一个新的分支出来
git checkout -b feature-xxx

本地提交之前要先运行好 npm run test 和 npm run lint 以确保所有的代码检验都通过。

// 提交 pr
自己的修改提交到自己 fork 过来的仓库相对应的分支上面去
git add 修改文件
git commit -m "xxx"
git push origin feature-xxx


// 修改 pr 因为很大部分的 pr 其实都会被指出意见
git add 修改文件
git commit -m "fix: xxxx"
git fetch upstream
// 这里注意分支
git rebase upstream/feature
// 然后将修改提交到之前到分支，这时候github会自动帮你把提交同步过去的
git push origin feature-xxx

### 配置禁止提交到develop分支
1. 进入Git仓库所在的目录，找到.git/hooks文件夹。
2. 在该文件夹中创建一个名为pre-receive的文件，没有扩展名。
3. 给该文件添加执行权限，命令为：chmod +x pre-receive。
4. 编辑pre-receive文件，添加需要执行的脚本代码。

- 编辑pre-receive钩子文件
```sh
#!/bin/bash
while read oldrev newrev refname
do
  if [[ "$refname" == "refs/heads/develop" ]]; then
    echo "Error: Pushing to develop branch is not allowed. Please use merge instead."
    exit 1
  fi
done
exit 0
```

<!-- pre-commit -->
```sh
#!/bin/sh

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$current_branch" = "develop" ]; then
    echo "You are not allowed to commit to the develop branch!"
    exit 1
fi

exit 0
```