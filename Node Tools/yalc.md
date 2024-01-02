yalc比npm link好的几个方面包括：

1. 版本管理：yalc可以更好地管理本地开发中的依赖项版本。当**使用npm link时，开发中的依赖项可能会出现版本冲突或不一致的情况**。而yalc可以确保每个项目使用的依赖项版本是一致的。

2. 快速更新：yalc可以更快速地更新本地开发中的依赖项。当**使用npm link时，每次更改依赖项的源代码后，需要重新运行npm install命令才能生效**。而yalc可以直接将更改后的依赖项发布到本地yalc存储库，并在项目中使用yalc update命令进行更新，节省了重新安装的时间。

3. 跨项目共享：yalc可以方便地在不同项目之间共享本地开发中的依赖项。通过yalc publish命令将依赖项发布到yalc存储库后，其他项目可以通过yalc add命令将其添加为依赖项。这样可以更方便地在多个项目之间共享和重用代码。

总的来说，**yalc相比npm link在版本管理、快速更新和跨项目共享**等方面提供了更好的功能和便利性。


- yalc update用于更新本地yalc包的依赖关系，而yalc push --private用于将本地yalc包发布到yalc注册表中

### yalc
1. npm install -g yalc
2. yalc publish
3. yalc add xxx
4. 组件库更新 yalc push。 项目更新 yalc update。