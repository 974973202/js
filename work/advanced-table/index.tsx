/*
 * @Author: heshi heshi@chinacscs.com
 * @Date: 2022-11-14 17:50:34
 * @LastEditors: heshi heshi@chinacscs.com
 * @LastEditTime: 2022-11-24 11:36:03
 * @FilePath: \react-base-library\src\advanced-table\index.tsx
 * @Description: 高级表格类型导出
 */
import AdvancedTable from './table-provider';
import CreateForm from './create-form';
import { HTML5Backend, DndProvider } from './dnd-drag-column';
import {
  customValueType,
  customRenderFormItem,
  digitData,
  moneyData,
  percentData,
  getFieldUrl,
  handleDataUrl,
} from './custom-value-type';

import type { ProColumns } from '@ant-design/pro-table';
import type { ProCoreActionType as ActionType } from '@ant-design/pro-utils';
import type { CusSortOrder, AdvancedColumns, AdvancedTableProps } from './typing';

export {
  ProColumns,
  ActionType,
  CreateForm,
  HTML5Backend,
  DndProvider,
  customValueType,
  customRenderFormItem,
  digitData,
  moneyData,
  percentData,
  getFieldUrl,
  handleDataUrl,
  CusSortOrder,
  AdvancedColumns,
  AdvancedTableProps,
};
export default AdvancedTable;
