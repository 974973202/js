export interface optType {
  force?: boolean;
  moduleName?: string;
}

export interface cliFileType {
  /** 路由地址 */
  installPath: string;
  /** 实际匹配地址 */
  comPath: string;
  /** 指定模块根文件 */
  rootFile: string;
  /** 模块名称 */
  name: string;
}

export interface formPackageType {
  package: string;
  modules: string[]
}

export interface cliConfigType {
  file: cliFileType[];
  form: formPackageType[];
}
