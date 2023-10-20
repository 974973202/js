import type { Command } from "commander";
import Cmd from "../command/index.js";
import { log } from "../utils/index.js";
import { dirname } from "dirname-filename-esm";
import { optType } from "./type.js";
import { getSelectProjectInfo } from "./select-project-info.js";
import { getSelectProjectName } from "./select-project-name.js";
import { getSelectProjectModule } from "./select-project-module.js";
import { getWritePath } from "./get-write-path.js";
import { getEntryPath } from "./get-entry-path.js";
import { analysisModuleFile } from "./analysis-module-file.js";

const __dirname = dirname(import.meta);

/**
 * cscs import
 */
class ImportCommand extends Cmd {
  get command() {
    return "import [projectName]";
  }

  get description() {
    return "cscs import 导入项目模块";
  }

  get options() {
    return [
      ['-f, --force', '是否强制拉取代码', false],
      ["-m, --moduleName <moduleName>", "模块名称"],
      ["-b, --branch <moduleName>", "模块名称"],
    ];
  }

  async action([name, opts]: [string, optType]) {
    log.verbose("init", name, opts);

    // 1. 获取项目 (默认develop分支， 可选tag号) 下载项目到本地缓存 生成选择项目 目录
    const config = await getSelectProjectInfo(opts);
    log.verbose("config", config as any);

    // 2. 选择项目
    const projectName = await getSelectProjectName(config.filePath, name);
    log.verbose("projectName", projectName);

    // 3. 获取项目下的配置文件，选择需要copy到本地的模块
    const _module = await getSelectProjectModule(config.filePath, projectName);
    const {
      selectModule,
      cliConfig
    } = _module ?? {}
    log.verbose("module", _module as any);

    // 4. 获取当前执行命令的路径  process.cwd()
    //  - 判断路径是否包含 src 目录
    //    - 是 舍弃  src 后的路径  拼接上 pages/项目  判断路径目录是否存在，存在跳过不存在生成目录
    //    - 否 拼接上 src/pages/项目 判断路径目录是否存在，存在跳过不存在生成目录
    const writeDirPath = await getWritePath(projectName)
    log.verbose("writeDirPath", writeDirPath);

     // 获取模块和文件入口
     const {
      /** 文件入口 */
      fileEntry,
      /** 写出文件入口 */
      writePath,
      /** 文件目录 */
      moduleEntry
    } = await getEntryPath(config.filePath, projectName, selectModule, writeDirPath)
    log.verbose("fileEntry", fileEntry);
    log.verbose("writePath", writePath);
    log.verbose("moduleEntry", moduleEntry);

    // 5. 解析缓存模块，拷贝到本地项目， 从index文件开始解析
    //   - 获取 预设 判断相对路径引入的组件是否是 包里面导出的组件
    //   - 递归解析 文件 正则匹配读取import from 后的'' ""字符串
    //   - 舍弃非路径（./  ../）的字符串
    // 6. 获取当前解析文件的目录
    // 7. 获取当前解析文件的目录的引入模块的路径
    //    - 问题：各项目导出的工具方法 多项目之间会混乱。  解决方案：1. 统一工具方法包. 2. 使用预设配置
    //    - 重复 5. 步骤  递归
    analysisModuleFile(fileEntry, moduleEntry, cliConfig, writePath);
    // 8. 结束
  }
}

function Import(instance: Command) {
  return new ImportCommand(instance);
}

export default Import;
