import fse from "fs-extra";
import path from "node:path";
import { log, makeList, printErrorLog } from "../utils/index.js";

export async function getSelectProjectModule(
  filePath: string,
  projectName: string
) {
  try {
    const fileConfig = fse.readFileSync(
      path.resolve(
        filePath,
        "frontend/packages",
        projectName,
        "cli-config.json"
      ),
      "utf-8"
    );
    const cliConfig: any = JSON.parse(fileConfig) ?? {};
    const configChoices = cliConfig.file?.map(
      (item: { name: any; comPath: any }) => ({
        name: item.name,
        value: item.comPath,
      })
    );
    const selectModule = await makeList({
      choices: configChoices,
      message: "请选择拷贝模块",
      defaultValue: "",
    });
    return {
      selectModule,
      cliConfig
    };
  } catch (error) {
    printErrorLog(error, "err");
  }
}
