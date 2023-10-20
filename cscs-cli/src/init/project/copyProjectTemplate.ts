import path from 'node:path';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists';
import ora from 'ora';
// import ejs from 'ejs';
// import glob from 'glob';
import { log } from '../../utils/index.js';
import { infoTemplateType, optType, projectTemplateType } from '../type.js';

/**
 * fse.ensureDirSync 方法是用于确保指定路径的文件夹存在。
 * 如果指定路径的文件夹不存在，则会创建该文件夹。
 * 如果文件夹已经存在，则不会做任何操作。
 * 该方法是同步执行的，即在调用ensureDirSync方法后，会阻塞代码的执行，直到文件夹创建完成或已存在。
 */

function getCacheFilePath(targetPath: string, template: projectTemplateType) {
  return path.resolve(targetPath, template.tags, template.projectName);
}

// function getPluginFilePath(targetPath, template) {
//   return path.resolve(targetPath, 'node_modules', template.npmName, 'plugins', 'index.js');
// }

/**
 * 
 * @param {string} targetPath 下载的缓存目录
 * @param {object} template 模板信息
 * @param {string} installDir 创建的文件目录
 */
function copyFile(targetPath: string, template: projectTemplateType, installDir: string) {
  const originFile = getCacheFilePath(targetPath, template);
  const fileList = fse.readdirSync(originFile);
  const spinner = ora('正在拷贝模板文件...').start();
  fileList.map(file => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`);
  });
  spinner.stop();
  log.success('模板拷贝成功');
}

// async function ejsRender(targetPath, installDir, template, name) {
//   log.verbose('ejsRender', installDir, template);
//   const { ignore } = template;
//   // 执行插件
//   let data = {};
//   const pluginPath = getPluginFilePath(targetPath, template);
//   if (pathExistsSync(pluginPath)) {
//     const pluginFn = (await import(pluginPath)).default;
//     const api = {
//       makeList,
//       makeInput,
//     }
//     data = await pluginFn(api);
//   }
//   const ejsData = {
//     data: {
//       name, // 项目名称
//       ...data,
//     }
//   }
//   glob('**', {
//     cwd: installDir,
//     nodir: true,
//     ignore: [
//       ...ignore,
//       '**/node_modules/**',
//     ],
//   }, (err, files) => {
//     files.forEach(file => {
//       const filePath = path.join(installDir, file);
//       log.verbose('filePath', filePath);
//       ejs.renderFile(filePath, ejsData, (err, result) => {
//         if (!err) {
//           fse.writeFileSync(filePath, result);
//         } else {
//           log.error(err);
//         }
//       });
//     });
//   });
// }

export default async function copyProjectTemplate(selectedTemplate: infoTemplateType<projectTemplateType>, opts: optType) {
  const { force = false } = opts;
  const { targetPath = '.', name, template } = selectedTemplate;
  const rootDir = process.cwd();
  // 用于确保指定的目录存在。如果目录不存在，则会创建该目录。如果目录已经存在，则不会进行任何操作
  fse.ensureDirSync(targetPath);
  const installDir = path.resolve(`${rootDir}/${name}`);
  if (pathExistsSync(installDir)) { // 同步检查路径是否存在
    if (!force) {
      log.error('ERR', `当前目录下已存在 ${installDir} 文件夹`);
      return;
    } else {
      fse.removeSync(installDir);
      fse.ensureDirSync(installDir);
    }
  } else {
    fse.ensureDirSync(installDir);
  }
  copyFile(targetPath, template, installDir);
  // await ejsRender(targetPath, installDir, template, name);
}
