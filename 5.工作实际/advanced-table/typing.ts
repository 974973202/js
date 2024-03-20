import React, { ReactNode } from 'react';
import { ProTableProps, ProColumns, ActionType } from '@ant-design/pro-table';
import { ParamsType } from '@ant-design/pro-provider';

export declare type SortOrder = 'descend' | 'ascend' | null;
export declare type CusSortOrder = 'desc' | 'asc' | null;

declare type RequestData<T> = {
  data: T[] | undefined;
  success?: boolean;
  total?: number;
} & Record<string, any>;

/**
 * AdvancedTable 的类型定义 继承自 antd 的 pro table
 */
export type AdvancedTableProps<T, U extends ParamsType, A = any> = {
  /**
   * 前端自定义列，例如操作列，会追加到后端请求列的后面。
   */
  extraColumns?: ProColumns<T>[];
  /**
   * 是否可以调整列宽
   */
  resizeable?: boolean;
  /**
   * 动态页面配置表格特定属性
   * 自适应计算列宽拖拽，需确保 columns 都有 width属性
   */
  calcResizeWidthFinish?: boolean;
  /**
   * 右边添加额外的Toolbar
   */
  extraToolbar?: React.ReactNode;
  /**
   * 分页组件Pagination 的 size 属性
   */
  paginationSize?: 'default' | 'small';
  /**
   * 权限配置
   */
  accessConfig?: {
    add?: A; // 新增
    update?: A; // 编辑
    delete?: A; // 删除
    export?: A; // 导出
    import?: A; // 导入
  };
  /**
   * 获取表格表头的接口
   */
  pageCode?: string;
  /**
   * 表格增删改查接口
   */
  backCode?: string;
  /**
   * Table action 的引用，便于自定义触发
   */
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  /**
   * 添加额外的表格行操作
   */
  extraActions?: (text: ReactNode, record: any) => ReactNode | ReactNode[];
  /**
   * 添加额外的表格行操作在 默认操作按钮的前还是后
   */
  extraActionsPosition?: 'before' | 'after';
  /**
   * 表格行操作的width
   */
  actionColumnWidth?: string;
  /**
   * 控制是否要权限判断新建，导出，导入按钮，默认为true
   */
  toolBarSwitcher?: {
    add?: boolean;
    export?: boolean;
    import?: boolean;
  };
  actionsSwitcher?: {
    update: boolean;
    delete: boolean;
  };
  formValueMapper?: Record<
    string,
    {
      mapTo: string;
      mapper: (record: any) => any;
    }
  >;
  /**
   * 配置内置操作列是否显示，默认为true
   */
  actionsVisible?: boolean;
  /**
   * 配置内置操作列是否fixed: right 默认为true
   */
  fixActionColumn?: boolean;
  /**
   * 表格自带modal弹框 编辑方法回调
   */
  onUpdated?: () => void;
  /**
   * 表格自带modal弹框 新建方法回调
   */
  onCreated?: () => void;
  /**
   * 表格行 删除方法的回调
   */
  onDelete?: (isLastOne: boolean, record: any) => void;
  /**
   * 自定义导出参数
   */
  exportParams?: Record<string, any>;
  dragSort?: boolean; // react-sortable-hoc拖拽
  dndDragSort?: boolean; // react-dnd拖拽
  /**
   * 表格拖拽排序的回调
   */
  onSortEnd?: (oldData: T, newData: T, oldIndex: number, newIndex: number) => void;
  /**
   * 获取 dataSource 的方法
   */
  request?: (
    params: U & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>,
    cusSort: Record<string, CusSortOrder>,
  ) => Promise<Partial<RequestData<T>>>;
  // 只支持valueType=text
  colMaxLength?: number;
  // 支持自定义高级表格内置Modal layout布局
  formModalLayout?: Record<string, any>;
  toolLeftBarRender?: ReactNode[]; // 将传入的新建等按钮放左边
  customEmpty?: {
    url?: string; // 表格空时展示的默认图片
    name?: string; // 表格空时展示的默认文字
  };
  exportFn?: (...params: any) => void; // 导出方法
  /**
   * 翻页连续编序/翻页重新编序
   */
  tableIndexType?: 'turnPageSeriesIndex' | 'turnPageAgainIndex' | undefined;
  /**
   * 是否过滤查询项的空字符串的值，默认为true
   */
  isFilterEmptyParamsValue?: boolean;
  /**
   * 是否开启斑马线的表格样式
   */
  isStartCrossLine?: boolean;
} & Omit<ProTableProps<T, U>, 'request'>;

export type InnerTableProps<T, U extends ParamsType> = {
  /**
   * 前端自定义列，例如操作列，会追加到后端请求列的后面。
   */
  extraColumns?: ProColumns<T>[];
  /**
   * 动态页面配置表格特定属性
   * 自适应计算列宽拖拽，需确保 columns 都有 width属性
   */
  calcResizeWidthFinish?: boolean;
  /**
   * 是否可以调整列宽
   */
  resizeable?: boolean;
  actionRef?: any;
} & Omit<ProTableProps<T, U>, ''>;

export type AdvancedColumns = ProColumns & {
  dependIndex?: string;
  dependEnum?: Record<string, [Record<string, string>]>;
  sort?: boolean;
  sum?: boolean;
  dbField?: string;
  fieldUrl?: string;
  fieldUnit?: string;
  fieldProps?: any;
  selectMode?: string;
  linkConfig?: {
    path?: {
      disabled?: boolean;
      disabledMessage?: string;
    }; // 路由地址
    url?: {
      disabled?: boolean;
      disabledMessage?: string;
    }; // 外链地址
  };
};
