import path from 'node:path';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists';
import ejs from 'ejs';
import { log, makeInput } from '../../utils/index';
import { dirname } from 'dirname-filename-esm';
import ora from 'ora';
import { fileTemplateType, infoTemplateType, optType } from '../type';

const __dirname = dirname(import.meta);

/**
 * 首字母转成大写
 * @param name 
 * @returns {string}
 */
function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getCopyFile(dirPath: string) {
  return makeInput({
    message: `请输入拷贝目标路径：${dirPath}`,
    defaultValue: '',
  });
}

async function ejsRender(installFile: string, name: string) {
  log.verbose('ejsRender', installFile);
  // 执行插件
  const ejsData = {
    data: {
      name: capitalizeFirstLetter(name), // 项目名称
    }
  }
  ejs.renderFile(installFile, ejsData, (err, result) => {
    if (!err) {
      fse.writeFileSync(installFile, result);
    } else {
      log.error('ERR', err as any);
    }
  });
}

export default async function copyFileTemplate(selectedTemplate: infoTemplateType<fileTemplateType>, opts: optType) {
  const { force = false } = opts;
  const { name, template } = selectedTemplate;
  const rootDir = process.cwd();
  /** 拷贝根路径 */
  const inputDirPath = await getCopyFile(`${rootDir}`);
  
  /** 模板文件 */
  const targetPath = path.resolve(__dirname, '../file', `${template.pageName}.tsx`)

  
  const installFile = path.resolve(`${rootDir}/${inputDirPath}`, `${name}.tsx`);

  log.info('拷贝路径', installFile)
  if (pathExistsSync(installFile)) { // 同步检查路径目录下是否存在同名文件
    if (!force) {
      log.error('ERR',`当前目录下已存在 ${installFile} 文件`);
      return;
    } else {
      fse.removeSync(installFile);
    }
  }
  const spinner = ora('正在拷贝文件...').start();
  fse.copySync(targetPath, installFile)
  spinner.stop();
  log.success('文件拷贝成功');
  await ejsRender(installFile, name);
}
