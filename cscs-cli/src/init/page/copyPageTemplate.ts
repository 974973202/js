import path from 'node:path';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists';
import ora from 'ora';
import ejs from 'ejs';
import glob from 'glob';
import { log, makeInput, makeList, InquirerListObj } from '../../utils/index';
import { dirname } from 'dirname-filename-esm';
import { infoTemplateType, optType, pageTemplateType } from '../type';

const __dirname = dirname(import.meta);

/**
 * 首字母转成大写
 * @param name 
 * @returns {string}
 */
function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getCopyDir(dirPath: string) {
  return makeInput({
    message: `请输入拷贝目标路径：${dirPath}`,
    defaultValue: '',
  });
}

function getPluginFilePath(targetPath: string) {
  return path.resolve(targetPath, 'plugins', 'index.js');
}

/**
 * 过滤文件 components 下的文件
 * @param sourceDir 
 * @param targetDir 
 * @param {string[]} includeComponentsFiles 
 */
function copyFiles(sourceDir: string, targetDir: string, includeComponentsFiles?: string[], status?: boolean) {
  // 获取源文件夹中的所有文件和子文件夹
  const files = fse.readdirSync(sourceDir);

  // 遍历文件和子文件夹
  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    
    // 选择 components 下的特定文件
    if ((status && !includeComponentsFiles?.includes(file)) || file === 'plugins') {
      continue;
    }

    // 检查文件的类型
    const stats = fse.statSync(filePath);
    // if (stats.isFile()) {
    //   // 如果是文件，则直接拷贝
    //   fse.copyFileSync(filePath, targetPath);
    // } else 

    // 选择 components 下的特定文件
    if (stats.isDirectory() && file === 'components' && includeComponentsFiles) {
      // 如果是文件夹，则递归调用copyFiles()函数
      fse.mkdirSync(targetPath);
      copyFiles(filePath, targetPath, includeComponentsFiles, true);
    } else {
      fse.copySync(filePath, targetPath);
    }
  }
}

/**
 * 
 * @param {string} targetPath 下载的缓存目录
 * @param {string} installDir 创建的文件目录
 */
function copyFile(targetPath: string, installDir: string, includeComponentsFiles: string[]) {
  const spinner = ora('正在拷贝页面模板文件...').start();
  // const fileList = fse.readdirSync(targetPath);
  // fileList.forEach(file => {
  //   if(file !== 'plugins') {
  //     fse.copySync(`${targetPath}/${file}`, `${installDir}/${file}`, {
  //       filter(src, dest) {
  //         console.log(src, dest, 'src, dest')
  //         // your logic here
  //         // it will be copied if return true
  //         return true
  //       }
  //     });
  //   }
  // });
  copyFiles(targetPath, installDir, includeComponentsFiles)

  spinner.stop();
  log.success('页面模板拷贝成功');
}

async function ejsRender(installDir: string, template: any, name: any, customData: any) {
  log.verbose('ejsRender', installDir, template);
  
  const ejsData = {
    data: {
      ...customData,
      name: capitalizeFirstLetter(name), // 项目名称
    }
  }
  glob('**', {
    cwd: installDir,
    nodir: true,
    ignore: [
      '**/node_modules/**',
      '**/plugins/**'
    ],
  }, (_err, files) => {
    files.forEach(file => {
      const filePath = path.join(installDir, file);
      log.verbose('filePath', filePath);
      ejs.renderFile(filePath, ejsData, (err, result) => {
        if (!err) {
          fse.writeFileSync(filePath, result);
        } else {
          log.error('ERR', err as any);
        }
      });
    });
  });
}

export default async function copyPageTemplate(selectedTemplate: infoTemplateType<pageTemplateType>, opts: optType) {
  const { force = false } = opts;
  const { name, template } = selectedTemplate;
  const rootDir = process.cwd();
  /** 拷贝根路径 */
  const inputDirPath = await getCopyDir(`${rootDir}\\${name}`);
  
  /** 页面模板路径 */
  const targetPath = path.resolve(__dirname, '../page', template.pageName)

  const installDir = path.resolve(`${rootDir}/${name}/${inputDirPath}`);
  log.info('拷贝路径', installDir)
  if (pathExistsSync(installDir)) { // 同步检查路径是否存在
    if (!force) {
      log.error('ERR',`当前目录下已存在 ${installDir} 文件夹`);
      return;
    } else {
      fse.removeSync(installDir);
      fse.ensureDirSync(installDir);
    }
  } else {
    fse.ensureDirSync(installDir);
  }

  // 执行插件
  let customData: Record<string, any> = {};
  const pluginPath = getPluginFilePath(targetPath);
  if (pathExistsSync(pluginPath)) {
    const pluginFn = (await import('file:///' + pluginPath)).default;
    const api = {
      makeList,
      makeInput,
      InquirerListObj,
    }
    customData = await pluginFn(api);
  }

  copyFile(targetPath, installDir, customData?.includeComponentsFiles);
  await ejsRender(installDir, template, name, customData);
}
