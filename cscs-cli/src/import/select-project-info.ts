import path from "node:path";
import fse from "fs-extra";
import ora from "ora";

import { homedir } from "node:os";
import { pathExistsSync } from "path-exists";
import { execa } from "execa";

import { log, makeList, printErrorLog } from "../utils/index.js";
import { TEMP_HOME } from "./config.js";
import { optType } from "./type.js";

/**
 * 获取项目分支或tag
 * @returns
 */
function getProjectType() {
  return makeList({
    choices: [
      {
        name: "develop",
        value: "develop",
      },
      { name: "tags", value: "tags" },
    ],
    message: "请选择代码来源",
    defaultValue: "develop",
  });
}

/**
 * amt 项目git地址
 * @param targetPath 
 * @param branch 
 */
async function downloadProject(targetPath: string, branch: string) {
  const cloneCommand = "git";
  const cloneArgs = [
    "clone",
    "-b",
    branch,
    "http://gitlab.chinacsci.com/amt/frontend.git",
  ];
  const cwd = targetPath;
  log.verbose("cloneArgs", cloneArgs as any);
  log.verbose("cwd", cwd);
  await execa(cloneCommand, cloneArgs, { cwd, stdio: "inherit" });
}


/**
 * 下载 amt项目
 * @param targetPath 主目录路径
 * @param branch develop 或 tag
 */
async function downloadTemplate(targetPath: string, branch: string, opts: optType) {
  const { force } = opts;
  const spinner = ora(`正在下载：${branch}...`).start();
  try {
    const filePath = `${targetPath}\\${branch}`;
    if (pathExistsSync(filePath)) {
      // develop 分支直接覆盖
      if (branch === 'develop' || force) {
        fse.removeSync(filePath);
        await downloadProject(filePath, branch);
        spinner.stop();
        log.success(`下载：${branch}成功`);
        fse.ensureDirSync(filePath);
      } else {
        spinner.stop();
        log.error('ERR', `已存在缓存目录：${filePath}`);
      }
    } else {
      fse.ensureDirSync(filePath);
      await downloadProject(filePath, branch);
      spinner.stop();
      log.success(`下载：${branch}成功`);
    }
  } catch (e) {
    spinner.stop();
    printErrorLog(e, "error");
  }
}

/**
 * 项目存放主目录路径
 */
function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`);
}

export async function getSelectProjectInfo(opts: optType): Promise<{
  branch: string;
  filePath: string;
}> {
  // 选择项目分支或tag
  const branch = await getProjectType();
  // 生成缓存目录
  const targetPath = makeTargetPath();
  // await downloadTemplate(targetPath, branch, opts)
  return {
    branch,
    filePath: `${targetPath}\\${branch}`,
  };
}
