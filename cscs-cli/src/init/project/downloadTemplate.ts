import { pathExistsSync } from 'path-exists';
import fse from 'fs-extra';
import ora from 'ora';
import { execa } from 'execa';
import { printErrorLog, log } from '../../utils/index.js';
import { infoTemplateType, optType, projectTemplateType } from '../type.js';

async function downloadAddTemplate(targetPath: string, template: projectTemplateType) {
  const { tags, repositoryUrl } = template;
  const cloneCommand = 'git';
  const cloneArgs = ['clone', '--branch', tags, repositoryUrl];
  const cwd = targetPath;
  log.verbose('cloneArgs', cloneArgs as any);
  log.verbose('cwd', cwd);
  await execa(cloneCommand, cloneArgs, { cwd, stdio: 'inherit' });
}

export default async function downloadTemplate(selectedTemplate: infoTemplateType<projectTemplateType>, opts: optType) {
  const { force = false } = opts;
  const { targetPath = '', template } = selectedTemplate;
  const spinner = ora(`正在克隆tag：${template.tags}...`).start();
  try {
    // const filePath = `${targetPath}\\${template.projectName}`;
    const filePath = `${targetPath}\\${template.tags}`;
    
    if (pathExistsSync(filePath)) {
      if (!force) {
        spinner.stop();
        log.error('ERR', `已存在缓存目录：${filePath}`)
      } else {
        fse.removeSync(filePath);
        await downloadAddTemplate(filePath, template);
        spinner.stop();
        log.success(`克隆tag：${template.tags}成功`);
        fse.ensureDirSync(filePath);
      }
    } else {
      fse.ensureDirSync(filePath)
      await downloadAddTemplate(filePath, template);
      spinner.stop();
      log.success(`克隆tag：${template.tags}成功`);
    }
  } catch (e) {
    spinner.stop();
    printErrorLog(e, 'error');
  }
}
