import path from "node:path";
import fse from "fs-extra";
import { log } from "../utils/index.js";

/**
 * 获取模块和文件入口
 * @param filePath 项目路径
 * @param projectName 项目名称
 * @param selectModule 项目模块
 * @param writeDirPath 写入目录路径
 * @returns 
 */
export async function getEntryPath(
  filePath: string,
  projectName: string,
  selectModule: string,
  writeDirPath: string
) {
  const moduleEntry = path.resolve(
    filePath,
    "frontend/packages/",
    projectName,
    `src/pages${selectModule}`
  );
  const moduleFileList = fse.readdirSync(moduleEntry);
  log.verbose("moduleFileList", moduleFileList as any);
  const fileEntry = moduleFileList.includes("index.tsx")
    ? path.resolve(moduleEntry, "index.tsx")
    : moduleEntry;
  const writePath = path.resolve(writeDirPath + selectModule, "index.tsx");
  return {
    /** 文件入口 */
    fileEntry,
    /** 写出文件入口 */
    writePath,
    /** 文件目录 */
    moduleEntry
  }
}
