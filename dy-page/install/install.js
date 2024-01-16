/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-07-26 17:17:45
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 15:40:10
 * @FilePath: \amt-frontend\packages\dynamic-page\install\install.js
 * @Description:
 *
 */
const fs = require('fs');
const path = require('path');
const cpy = require('cpy');

/**
 * 安装包时cwd是node_modules包所在目录，INIT_CWD是项目所在目录
 */

function install() {
  const projectPath = process.env.INIT_CWD || process.cwd();
  const packageJSON = require(path.join(projectPath, 'package.json'));
  if (packageJSON.name === 'amt-packages') {
    return;
  }

  if (process.env.INIT_CWD !== process.cwd()) {
    // 复制文件到项目根目录
    const targetDir = path.join(projectPath, 'src/.components');

    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir);
      } catch (error) {
        console.warn(error);
      }
    }

    const files = [
      { source: 'routes/*', target: targetDir },
      { source: 'access/*', target: targetDir },
      { source: 'pages/*/**', target: targetDir },
    ];

    for (const file of files) {
      cpy(file.source, file.target, { cwd: __dirname, parents: true });
    }

    // 复制public 到项目根目录
    // const publicDir = path.join(projectPath, 'public');
    // if (!fs.existsSync(publicDir)) {
    //   try {
    //     fs.mkdirSync(publicDir);
    //   } catch (error) {
    //     console.warn(error);
    //   }
    // }

    // if (!fs.existsSync(fontDir)) {
    //   console.error('缺少必要目录（public，public/fonts）,请手动复制');
    // } else {
    //   cpy('*/**', publicDir, { cwd: path.join(__dirname, 'public'), parents: true });
    // }
  }
}

install();
