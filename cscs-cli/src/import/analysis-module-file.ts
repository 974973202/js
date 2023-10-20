import { log } from "../utils/index.js";
import path from "node:path";
import fse from "fs-extra";
import AstAnalysis from "./ast-analysis.js";
import { cliConfigType, formPackageType } from "./type.js";

/**
 * 判断文件是否有后缀
 * @param filePath 文件路径
 * @returns
 */
function isTSXFile(filePath: string) {
  const ext = path.extname(filePath);
  return {
    /** 是否有后缀 */
    bool: !!ext,
    /** 后缀， 例: .tsx */
    ext,
  };
}

/**
 * 处理less css
 * @param entry 解析文件入口
 * @param rootPath 解析所在目录
 * @param writePath 写入文件的路径
 */
function analysisLessFiles(entry: string, rootPath: string, writePath: string) {
  fse.copySync(entry, writePath);
  log.success(`${entry} => ${writePath}`)

  const code = fse.readFileSync(entry, "utf-8");
  const regex =
    /@import\s+url\(['"]([^'"]+)['"]\);|@import\s+['"]([^'"]+)['"];/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const lessFile = path.resolve(rootPath, match[1] || match[2]);
    const writeLessPath = path.resolve(writePath, match[1] || match[2]);
    analysisLessFiles(lessFile, path.dirname(lessFile), writeLessPath);
  }
}

/**
 * 组件匹配项目包
 * @param pattern 
 * @param input 
 * @returns 
 */
function matchPackage(
  pattern: Array<formPackageType>,
  input: string
) {
  for (const p of pattern) {
    if (p.modules.some((m) => input.includes(m))) {
      return p.package;
    }
  }
  return "";
}

const regex = /import\s+[\w{},\s]+from\s+['"](.+?)['"]/g;

/**
 * analysisModuleFile
 * @param entry 解析文件入口
 * @param rootPath 解析所在目录
 * @param cliConfig 项目配置文件
 * @param writePath 写入文件的路径
 */
export function analysisModuleFile(
  entry: string,
  rootPath: string,
  cliConfig: cliConfigType,
  writePath: string
) {
  fse.ensureFileSync(writePath);
  const targetCode = fse.statSync(writePath);
  // 本地文件有数据则跳过写入，避免重复读取，写入数据。同时避免死循环
  if (targetCode.size <= 0) {
    const code = fse.readFileSync(entry, "utf-8");

    const packageItems: Array<formPackageType> =
      cliConfig.form ?? [];

    // 匹配到约定的路径停止匹配
    // - 优先处理相对路径的替换减少检索递归次数
    // 1. 判断是否是相对路径引入
    // 2. 判断导出的组件是否指定
    const newCode = code.replace(regex, (match, importStatement) => {
      const relativePath = match.includes("./") || match.includes("../");
      const packageName = matchPackage(packageItems, match);
      if (packageName && relativePath) {
        const m = match.replace(importStatement, packageName);
        return m;
      }
      return match;
    });

    const matches = newCode.matchAll(regex);
    for (const match of matches) {
      const importedModule = match[1];
      if (importedModule.startsWith("./") || importedModule.startsWith("../")) {
        // importedModule 相对路径
        const recurFile = path.resolve(rootPath, importedModule);
        const writeFilePath = path.resolve(
          path.dirname(writePath),
          importedModule
        );
        const { bool, ext } = isTSXFile(recurFile);
        if (bool) {
          if (ext === ".less") {
            analysisLessFiles(
              path.resolve(recurFile),
              path.dirname(recurFile),
              writeFilePath
            );
          }
          if (ext === ".tsx" || ext === ".ts") {
            analysisModuleFile(
              path.resolve(recurFile),
              path.dirname(recurFile),
              cliConfig,
              writeFilePath + ext
            );
          }
        } else {
          // 判断路径是否存在且无后缀的情况
          if (fse.existsSync(recurFile)) {
            // 判断子路径是否存在
            const subPath = recurFile + "/index.tsx";
            if (fse.existsSync(subPath)) {
              analysisModuleFile(
                path.resolve(subPath),
                recurFile,
                cliConfig,
                writeFilePath + "/index.tsx"
              );
              // log.success(subPath);
            } else {
              // 存在目录，没有 index.tsx 则拷贝整个目录
              log.error("err", subPath);
            }
          } else {
            // 依次查找其他路径
            const paths = [
              recurFile + ".tsx",
              recurFile + ".ts",
              recurFile + ".d.ts",
            ];
            let found = false;
            for (let i = 0; i < paths.length; i++) {
              const p = paths[i];
              try {
                // 判断路径是否存在
                fse.accessSync(p);
                found = true;
                // console.log('路径不存在，但是找到了子路径', p);
                // log.success(p);

                analysisModuleFile(
                  p,
                  path.dirname(p),
                  cliConfig,
                  writeFilePath + path.extname(p)
                );
                break;
              } catch (err) {
                // 路径不存在
                log.error("路径不存在", p);
                // console.log('路径不存在', p);
              }
            }
            if (!found) {
              console.log("路径不存在，子路径也不存在");
            }
          }
        }
      }
    }

    fse.outputFileSync(writePath, AstAnalysis(newCode));
    // fse.outputFileSync(writePath, newCode);
    log.success(`${entry} => ${writePath}`)
  } else {
    log.error('write', `${writePath}已存在数据`)
  }
}
