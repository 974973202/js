/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-25 00:13:42
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\types.ts
 * @Description: 动态页面管理 类型文件
 *
 */
import { ProColumns } from '@ant-design/pro-table';
import { RequestMethod } from 'umi-request';

export interface FormChangeProps {
  dynamicName: string;
  dataResource: string;
  dynamicSql: string;
}

export interface sqlModalSubmitProps extends FormChangeProps {
  id?: number;
  columns: SqlFields[];
}

/**
 * 动态页面管理
 */

export interface ListResponse {
  id: number;
  /**
   * sql
   */
  dynamicSql: string;
  /**
   * 名称
   */
  dynamicName: string;
  /**
   * 数据源
   */
  dataResource: string;
  syntacticType: string | null;
  /**
   * 明细配置数据
   */
  columnField: any[];
  /** 是否导入 0不导入,1导入 */
  tableImport?: number | null;
  /** 导入权限 */
  importAuthority: string;
  /** 配置的模板id */
  templateId?: number | null;
  /**
   * 已弃用 - 导出权限判读
   */
  fieldExport: number | null;
  /**
   * 已弃用 - 有导出权限的角色id
   */
  fieldExportAuthority?: string;
  /**
   * 参数配置生成的拼接url参数
   */
  dynamicUrl?: string;
  createTime: string;
  /**
   * 参数配置数据
   */
  columnParam?: any[];
  /**
   * 编序方式
   */
  tableIndexConfig: number | null;
  /**
   * 允许拖拽调整列宽
   */
  fieldResizableTitle: number | null;
  /**
   * 表格属性配置
   */
  tableApiConfig: string | null;
  /**
   * 自定义表格属性配置
   */
  customTableConfig: string | null;
  _status?: string; // 用于区分批量导入数据还是其他
  jsScript: string; // 代码增强

  maintainData: number | null; // 允许数据维护
  tableName: string; // 表名
  primaryKey: string; // 主键
  primaryKeyStrategy: string; // 主键策略
  sequenceName: string; // 序列名称

  tableUpdate: number | null; // 允许更新
  tableInsert: number | null; // 允许新建
  tableDelete: number | null; // 允许删除
  deleteAuthority: string; // 删除权限
  updateAuthority: string; // 更新权限
  insertAuthority: string; // 新增权限
}

export interface SqlFields {
  columnType: number;
  createBy: null;
  createTime: null;
  defaultValue: null;
  deleteFlag: null;
  dynamicId: null;
  fieldCode: null;
  fieldContent: string;
  fieldDataAuthority: string | null | Array<any>; // 数据权限
  fieldDisplay: string | number | null;
  fieldHref: string | null;
  fieldName: string;
  fieldSelect: string | number | null;
  fieldSort: string | number | null;
  fieldSortName: string | null;
  fieldSum: string | number | null;
  fieldTitle: string | null;
  fieldType: string;
  fieldUnit: string | null;
  fieldRow: string | null;
  fieldAggregation: string | null;
  fieldStrategy: string | null;
  id?: string | null;
  selectMode: string | null;
  sort?: number;
  updateBy: null;
  updateTime: null;
  version: null;

  fieldOperate: Record<string, any> | null; // 字段操作配置
  operateStyle: string | null; // 表单组件类型
}

export interface SqlParams {
  columnType: number;
  createBy: null;
  createTime: null;
  defaultValue: null;
  deleteFlag: null;
  dynamicId: null;
  fieldCode: null;
  fieldContent: string;
  fieldDataAuthority: string | null | Array<any>;
  fieldDisplay: string | number | null;
  fieldHref: string | null;
  fieldName: string;
  fieldSelect: string | number | null;
  fieldSort: string | number | null;
  fieldSortName: string | null;
  fieldSum: string | number | null;
  fieldTitle: string | null;
  fieldType: string;
  fieldUnit: string | null;
  fieldRow: string | null;
  fieldAggregation: string | null;
  fieldStrategy: string | null;
  id?: string | null;
  selectMode: string | null;
  sort: null;
  updateBy: null;
  updateTime: null;
  version: null;

  fieldOperate: Record<string, any> | null; // 字段操作配置
  operateStyle: string | null; // 表单组件类型
}

export interface SqlParseResponse {
  fields: SqlFields[];
  params: SqlParams[];
}

export interface SqlImportParseResponse {
  columnField: SqlFields[];
  columnParam: SqlParams[];
}

export type DyTableColumnsType = Omit<ProColumns, 'dataIndex' | 'hideInSearch' | 'hideInTable' | 'valueEnum'> & {
  dataIndex: string;
  fieldCode: string | null;
  fieldSort: number | null;
  fieldSortName: string | null;
  fieldTitle: string | null;
  fieldUnit: string | null;
  fieldUrl: string | null;
  fieldRow: 'merge' | 'default' | null;
  fieldAggregation: string | null;
  fieldStrategy: string | null;
  hideInSearch: number | boolean;
  hideInTable: number | boolean;
  initialValue: any;
  selectMode: string;
  sort: number | null;
  sum: number | boolean | null;
  title: string | null;
  valueEnum: Record<string, any> | null;
  valueType: string | null;
  children?: DyTableColumnsType[];
  sorter?: boolean;
  dbField?: string;
  render?: any;
  width?: number;
  ellipsis?: boolean;
  className?: string;
  columnConfig: string | null;
  fieldProps?: Record<string, any>;
  showInLeftBar?: Record<string, any>;
  [key: string]: any;
};

export interface ExportDataType {
  /** 是否导入 0不导入,1导入 */
  tableImport: number | null;
  /** 导入权限 */
  importAuthority: any;
  /** 配置的模板id */
  templateId: number | null;
  // 是否允许导出
  fieldExport: number | null;
  // 导出权限
  fieldExportAuthority: any;
  // 允许新建
  fieldCreate: boolean | null;
  // 新建权限
  fieldCreateAuthority: any;
  // 允许编辑
  fieldEdit: boolean | null;
  // 编辑权限
  fieldEditAuthority: any;
  // 允许删除
  fieldDelete: boolean | null;
  // 删除权限
  fieldDeleteAuthority: any;
  // 表格序号配置
  tableIndexConfig: number | null;
  // 是否可拖拽表头
  fieldResizableTitle: boolean | null;
  // 表格额外 api 配置
  tableApiConfig: string | null;
  isAsync: boolean | null;
  tableSumPosition: string | null;
  showTableStyle: 'isTree' | 'isExpand' | null;
  isExpandName: string | null;
  parent_id: string | null;
  jsScript: string | null;

  tableInsert: number | null; // 允许新建 0: 不允许, 1: 允许
  insertAuthority: any; // 新增权限
  tableUpdate: number | null; // 允许更新 0: 不允许, 1: 允许
  updateAuthority: any; // 更新权限
  tableDelete: number | null; // 允许删除 0: 不允许, 1: 允许
  deleteAuthority: any; // 删除权限
}

export interface DyFormType {
  dynamicName: string;
  dataResource?: string;
  syntacticType?: 'source_type' | 'mybatis_type';
  dynamicSql: string;
}

export interface saveDataType extends DyFormType {
  id?: number | null;
  columns: (SqlFields | SqlParams)[];
  tableApiConfig: string | null | undefined;
  customTableConfig: string;
  fieldExport: number;
  fieldExportAuthority?: any;
  fieldResizableTitle?: number;
  tableIndexConfig?: number | null;
  columnField?: SqlFields[];
  columnParam?: SqlParams[];
}

export interface utilsRef {
  urlParams: Record<string, unknown>;
  finalColumns: Array<DyTableColumnsType>;
  setFinalColumns: (data: Array<DyTableColumnsType>) => void;
  dataSource: Record<string, unknown>[];
  setDataSource: (data: Array<Record<string, unknown>>) => void;
  request: RequestMethod<false>;
  original?: Record<string, unknown>;
  _store: Record<string, unknown>;
  set_Store: (data: Record<string, unknown>) => void;
}

export interface DyQueryDatabaseResponse {
  databaseName: string;
  databaseClass: string;
  connectAccount: string;
  jdbcUrl: string;
  id: number;
}

export interface ParseUploadFileResponse {
  hasExistData: number[];
  importData: ListResponse[];
  sign: 0 | 1;
}

export interface PreviewSaveRequestData {
  columns: Column[];
  customTableConfig: string;
  dataResource: string;
  dynamicName: string;
  dynamicSql: string;
  dynamicUrl: string;
  fieldExport: number;
  fieldExportAuthority: string;
  fieldResizableTitle: number;
  id: number;
  isReuse: number;
  jsScript: string;
  onSubmit: number;
  params: Record<string, any>;
  syntacticType: string;
  tableApiConfig: string;
  tableIndexConfig: number;
}

export interface Column {
  columnConfig: string;
  columnType: number;
  defaultValue: string;
  dynamicId: number;
  fieldAggregation: string;
  fieldCode: string;
  fieldContent: string;
  fieldDataAuthority: string;
  fieldDisplay: number;
  fieldHref: string;
  fieldName: string;
  fieldRow: string;
  fieldSelect: number;
  fieldSort: number;
  fieldSortName: string;
  fieldStrategy: string;
  fieldSum: number;
  fieldTitle: string;
  fieldType: string;
  fieldUnit: string;
  id: number;
  selectMode: string;
  sort: number;
}

// “配置模板”下拉框数据
export interface TemplateListType {
  id: number;
  templateName: string;
}

export interface ExportData {
  /** 是否导入 */ tableImport?: any;
  /** 导入权限 */ importAuthority?: any;
  /** 配置的模板id */ templateId?: number | null;
  /** 允许导出 */ fieldExport?: boolean | null;
  /** 导出权限 */ fieldExportAuthority?: any;
  /** 编序方式 */ tableIndexConfig?: number | null;
  /** 允许拖拽调整列宽 */ fieldResizableTitle?: boolean | null;
  /** 表格属性配置 */ tableApiConfig?: string | null;
  /** 合计显示位置 */ tableSumPosition?: string | null;
  /** 表格显示样式 */ showTableStyle?: 'isTree' | 'isExpand' | null;
  /** 可展开组件名 */ isExpandName?: string | null;
  /** 同步还是异步 */ isAsync?: boolean | null;
  /** parent_id */ parent_id?: string | null;
  tableInsert: number | null; // 允许新建 0: 不允许, 1: 允许
  insertAuthority: any; // 新增权限
  tableUpdate: number | null; // 允许更新 0: 不允许, 1: 允许
  updateAuthority: any; // 更新权限
  tableDelete: number | null; // 允许删除 0: 不允许, 1: 允许
  deleteAuthority: any; // 删除权限
}
