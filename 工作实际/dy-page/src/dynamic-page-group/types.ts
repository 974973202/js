/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2022-12-16 17:50:31
 * @FilePath: \micro-react-library\src\sys-config\dynamic-page-group\types.ts
 * @Description: 动态页面组合 类型文件
 *
 */
export interface ColumnType {
  id: number;
  dynamicId: number;
  groupId: number;
  isDisplay: number;
  dynamicManageName: string;
  groupDisplayStyle: string;
  groupType: string;
  conditionDisplay: number;
  dynamicTypeExt: string;
  dynamicType: string;
}

export interface childSoloType {
  name: string;
  tabsname: string;
  style: string;
  dynamicId: number;
  conditionDisplay: number;
  data: Array<ColumnType>;
  tabsnameArray: string[];
}

export interface groupTableType {
  id: number;
  groupName: string;
  groupStyle: string;
  manageName: string;
  createTime: string;
  column: ColumnType[];
}
