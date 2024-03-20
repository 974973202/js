const fs = require('fs');
const path = require('path');
const cpy = require('cpy');

/**
 * 安装包时cwd是node_modules包所在目录，INIT_CWD是项目所在目录
 */
function install() {
  const projectPath = process.env.INIT_CWD || process.cwd();
  if (process.env.INIT_CWD !== process.cwd()) {
    // const projectPath = process.env.INIT_CWD || process.cwd();
    // const packageJSON = require(path.join(projectPath, 'package.json'));
    // if (packageJSON.name === 'credit-risk') {
    //   return;
    // }
    const targetDir = path.join(projectPath, 'src/.components'); // 包里面的 方法本项目的 src/.components

    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir);
      } catch (error) {
        console.warn(error);
      }
    }

    const files = [
      { source: 'routes/*', target: targetDir }, //路由
      { source: 'pages/*/**', target: targetDir },
      { source: 'credit-risk-components.shared.ts', target: targetDir }, //导出的组件名单
      // { source: 'access/master-components.access.ts', target: targetDir },//权限
    ];

    for (const file of files) {
      // 匹配模式  输出目录  
      cpy(file.source, file.target, { cwd: __dirname, parents: true });
    }
  }
}

install();
