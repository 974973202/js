const fs = require('fs');
const path = require('path');
const cpy = require('cpy');

function install() {
  const PATH = process.env.INIT_CWD || process.cwd();
  if (process.env.INIT_CWD !== process.cwd()) {
    // const PATH = process.env.INIT_CWD || process.cwd();
    // const packageJSON = require(path.join(PATH, 'package.json'));
    // if (packageJSON.name === 'credit-risk') {
    //   return;
    // }
    const targetDir = path.join(process.env.projectPath || PATH, 'src/.components');

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
      cpy(file.source, file.target, { cwd: __dirname, parents: true });
    }
  }
}

install();
