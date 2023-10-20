import path from "node:path";
import fse from "fs-extra";

export async function getWritePath(projectName: string) {
  const currentPath = path.normalize(process.cwd());
  let writeDirPath;
  // 判断路径是否包含src目录
  if (currentPath.includes("src")) {
    // 舍弃src后的路径
    const newPath = currentPath.split("src")[0];

    // 拼接上pages/项目
    writeDirPath = path.join(newPath, "src/pages", projectName);

    // 判断路径目录是否存在，存在跳过，不存在生成目录
    if (!fse.existsSync(writeDirPath)) {
      fse.mkdirSync(writeDirPath, { recursive: true });
      console.log(`目录 ${writeDirPath} 生成成功`);
    } else {
      // 目录存在是否覆盖 是 覆盖 否 退出程序
      console.log(`目录 ${writeDirPath} 已存在`);
    }
  } else {
    // 拼接上src/pages/项目
    writeDirPath = path.join(currentPath, "src", "pages", projectName);

    // 判断路径目录是否存在，存在跳过，不存在生成目录
    if (!fse.existsSync(writeDirPath)) {
      fse.mkdirSync(writeDirPath, { recursive: true });
      console.log(`目录 ${writeDirPath} 生成成功`);
    } else {
      // 目录存在是否覆盖 是 覆盖 否 退出程序
      console.log(`目录 ${writeDirPath} 已存在`);
    }
  }

  return writeDirPath;
}
