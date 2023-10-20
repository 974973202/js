import fse from "fs-extra";
import { log, makeList, printErrorLog } from "../utils/index.js";

/**
 * 获取导出源码的项目
 * @returns
 */
function getExportProject(projects: { name: string; value: string }[]) {
  return makeList({
    choices: projects,
    message: "请选择导出源码的项目",
    defaultValue: "credit-risk",
  });
}

/**
 *
 * @param path 项目路径
 * @param name 模块名称
 */
export async function getSelectProjectName(path: string, name: string): Promise<string> {
  const packagesName = fse.readdirSync(path + "/frontend/packages");
  let projectName;
  if (Array.isArray(packagesName) && packagesName.length > 0) {
    if (name) {
      if (packagesName.includes(name)) {
        projectName = name;
      } else {
        log.error("ERR", "输入项目不存在");
      }
    } else {
      const projects = packagesName.map((item) => ({
        name: item,
        value: item,
      }));
      projectName = await getExportProject(projects);
    }
  } else {
    log.error("ERR", "项目为空");
  }
  return projectName;
}
