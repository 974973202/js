/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: xull xull@chinacscs.com
 * @LastEditTime: 2023-10-23 13:16:25
 * @FilePath: \frontend\packages\dynamic-page\src\dynamic-page-group\components\common.tsx
 * @Description: 动态页面通用处理逻辑组件、方法
 *
 */
import React, { Fragment } from 'react';
import { Alert, Table } from 'antd';
import moment from 'moment';
import {
  customValueType,
  customRenderFormItem,
  digitData,
  moneyData,
  percentData,
  getFieldUrl,
  handleDataUrl,
} from '@cscs-fe/base-components';
import { DyTableColumnsType } from '../../dynamic-page-manage/types';
import { meanBy, minBy, maxBy, sumBy, cloneDeep } from 'lodash-es';
import DynamicTable from '../../dynamic-table';
import { FieldType, SelectMode } from '../../dynamic-table/enum';
export interface _rowMapType {
  dataIndex: string;
  fieldRow?: 'merge' | 'default' | null;
  fieldAggregation?: string | null;
  fieldStrategy?: string | null;
}

enum Strategy {
  /** 平均值 */ AVG = 'avg',
  /** 最大值 */ MAX = 'max',
  /** 最小值 */ MIN = 'min',
  /** 合计值 */ SUM = 'sum',
}

export interface FinalColumnsType {
  finalColumns: DyTableColumnsType[];
  optionRender: boolean;
  searchIndex: boolean;
  AnalysisKey: Array<string>;
  _rowMap: _rowMapType[];
  isMergeRow: boolean;
  absoluteParams: Record<string, unknown>;
}

interface _dynamicClickParamsType {
  /** 弹框自定义组件 */ ComponentCollection?: { name: string; element: React.FC; width?: number }[];
  /** 状态设为modal 弹框超链接跳转不触发 */ status?: 'modal';
}

/**
 * 动态页面点击跳转额外传参
 * @param ComponentCollection 弹框自定义组件
 * @param status 状态设为modal 弹框超链接跳转不触发
 * @returns {_dynamicClickParamsType}
 */
const _dynamicClickParams =
  ({ ComponentCollection, status }: _dynamicClickParamsType) =>
  () => ({
    ComponentCollection,
    status,
    DynamicOnlineTable: DynamicTable,
  });

function parseJsonConfig(config: string | null) {
  return config && typeof JSON.parse(config) === 'object' ? JSON.parse(config) : {};
}

/**
 * 处理表格渲染逻辑
 * @param column 表格列数据
 * @param onCancel 回调函数
 */
export function addRender(
  column: any,
  tableColMaxLength?: number,
  onCancel?: () => void,
  ComponentCollection?: { name: string; element: React.FC; width?: number }[],
  status?: 'modal',
) {
  // 处理时间范围
  if (column.valueType === 'dateRange' || column.valueType === 'dateTimeRange') {
    // 传递组件默认props
    column.fieldProps = {
      ...column.fieldProps,
      // 支持左或右单选日期
      allowEmpty: [true, true],
    };

    // 数据处理格式
    const fieldUnit = column?.fieldUnit ? column?.fieldUnit : null;
    column.render = (_: React.ReactNode, row: Record<string, any>) => {
      // 是否为超链接判断
      const finalUrl = getFieldUrl(column, row);
      // 最终处理的日期格式
      const momentTime = moment(row[column.dataIndex]).format(
        fieldUnit || column.valueType === 'dateRange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
      );
      // 超链接逻辑处理
      const dataNode = handleDataUrl(
        finalUrl,
        momentTime,
        column,
        row,
        onCancel,
        _dynamicClickParams({ ComponentCollection, status }),
      );
      return dataNode ? dataNode : _;
    };
  }

  // 处理搜索项逻辑
  customRenderFormItem(column);

  // 处理表格渲染逻辑
  customValueType(column, tableColMaxLength, onCancel, _dynamicClickParams({ ComponentCollection, status }));
}

/**
 * 处理url上回显到搜索项的数据
 * @param urlParams url参数
 * @param element 表格表头数据
 * @returns string, array
 */
export const urlParamsTransform = (urlParams: Record<string, string>, element: DyTableColumnsType) => {
  const { dataIndex, selectMode, initialValue } = element ?? {};
  const paramValue = urlParams?.[dataIndex];
  if (!paramValue) {
    return initialValue;
  }

  // 多值默认值转换为数组
  if (['includeInput', 'selectRange', 'selectCheckout', 'treeSelectCheckout'].includes(selectMode)) {
    return (
      paramValue
        .split('|')
        .map((e: string) => (e === '' ? null : e))
        // 如果是数字类型，转换为数字
        .map((i) => {
          let value: any = i;
          if (element.valueType === FieldType.Digit) {
            value = Number(i);
            if (Number.isNaN(value)) {
              value = i;
            }
          }
          return value;
        })
    );
  }

  if (
    [SelectMode.SelectRadio, SelectMode.TreeSelect].includes(selectMode as SelectMode) &&
    element.valueType === FieldType.Digit
  ) {
    // 如果是数字类型，转换为数字
    const value = Number(paramValue);
    if (Number.isNaN(value)) {
      return paramValue;
    }
    return value;
  }

  return paramValue;
};

// eslint-disable-next-line complexity
const _dealColumn = (
  _row: DyTableColumnsType,
  _rowMap: Array<_rowMapType>,
  AnalysisKey: Array<string>,
  urlParams?: Record<string, string>,
  isTree?: boolean,
  columnScriptonChange?: (_row: DyTableColumnsType) => void,
) => {
  // 搜集包含查询、范围查询、下拉多选、树形多选的dataIndex，用于后续逻辑处理
  if (['includeInput', 'selectRange', 'selectCheckout', 'treeSelectCheckout'].includes(_row.selectMode)) {
    AnalysisKey.push(_row.dataIndex);
  }

  // 取url上默认值覆盖后端返回的默认值 回显
  _row.initialValue = urlParamsTransform(urlParams || {}, _row);

  // 分组下的列表是否隐藏  false=no  true=yes
  _row.hideInTable = _row.hideInTable ? false : true;
  _row.sorter = _row.fieldSort ? true : false;

  if (_row.sorter && isTree) {
    // _row.sortDirections = ['ascend'];
    _row.showSorterTooltip = false;
  }

  // 用于高级表格内部排序字段
  _row.dbField = _row.fieldSortName || _row.dataIndex;
  // js脚本 onChange 事件
  columnScriptonChange?.(_row);
  // 处理额外的属性配置
  const _columnConfig =
    _row?.columnConfig && typeof JSON.parse(_row.columnConfig) === 'object' ? JSON.parse(_row.columnConfig) : {};
  for (const [key, value] of Object.entries(_columnConfig)) {
    // 自定义透传属性 fieldProps
    if (key === 'fieldProps' && typeof value === 'object' && value !== null) {
      // 和接口返回的fieldProps合并
      // 配置事例 {"form":{"ignoreRules":false}}
      // {"formItemProps":{"rules":[{"required":true,"message":"此项为必填项"}]}}
      const fieldProps = _row.fieldProps || {};
      _row.fieldProps = {
        ...fieldProps,
        ...value,
      };
    } else if (key === 'formItemProps' && typeof value === 'object' && value !== null) {
      const formItemProps = _row.formItemProps ?? {};
      _row.formItemProps = { ...formItemProps, ...value };
    } else {
      _row[key] = value;
    }
  }

  _rowMap.push({
    dataIndex: _row.dataIndex,
    fieldRow: _row.fieldRow,
    fieldAggregation: _row.fieldAggregation,
    fieldStrategy: _row.fieldStrategy,
  });

  // 设置了行分组 无聚合依据
  if (_row.fieldRow === 'merge' || _row.fieldAggregation) {
    _row.onCell = (record: DyTableColumnsType) => ({ rowSpan: record?.row_span_map?.[_row?.dataIndex] ?? 1 });
  }
};

/**
 * 表格表头数据处理
 * @param response 表格表头数据
 * @param onCancel
 * @param urlParams 浏览器链接上的参数，默认做搜索项的回显
 * @param status 在弹框内展示不跳转路由
 * @returns FinalColumnsType
 */
// eslint-disable-next-line complexity
export function handleColumnsData(params: {
  response: DyTableColumnsType[];
  onCancel?: () => void;
  urlParams?: Record<string, string>;
  tableColMaxLength?: number;
  fieldResizable?: boolean;
  ComponentCollection?: { name: string; element: React.FC; width?: number }[];
  status?: 'modal';
  customTableConfig?: Record<string, any>;
  columnScriptonChange?: (_row: DyTableColumnsType) => void;
  isPreview?: boolean;
}): FinalColumnsType {
  const {
    response = [],
    onCancel,
    urlParams,
    tableColMaxLength,
    fieldResizable,
    ComponentCollection,
    status,
    customTableConfig,
    columnScriptonChange,
    isPreview,
  } = params;
  const finalColumns: any[] = []; // 用于搜索项和表格顺序对应  -- 分组标题下设置hideInSearch不生效，必须放到同一层级
  const isTree = customTableConfig?.showTableStyle === 'isTree';
  /** 需要解析传参带竖线的dataIndex 包含查询、范围查询、下拉多选、树形多选、级联多选 */
  const AnalysisKey: Array<string> = [];
  /** 处理聚合的信息 */ const _rowMap: Array<_rowMapType> = [];
  /** 判断是否有聚合属性 */ let isMergeRow = false;
  // 处理表格对应值的转换
  for (const element of response) {
    const columnConfig = parseJsonConfig(element.columnConfig);

    getAlign(element);

    if (isPreview) {
      element.linkConfig = {
        path: {
          disabled: true,
          disabledMessage: '路由类型的字段超链接此处不支持预览，请保存后通过预览按钮查看',
        },
      };
    }

    if (!element.children) {
      element.hideInSearch = element.hideInSearch ? false : true;

      if (columnConfig?.showInLeftBar) {
        element.hideInSearch = true;
        element.showInLeftBar = columnConfig?.showInLeftBar;
      }

      // 是否合计
      element.sum = element.sum === 1;
      if (element.fieldRow) {
        isMergeRow = true;
      }
      _dealColumn(element, _rowMap, AnalysisKey, urlParams, isTree, columnScriptonChange);
      // 表格数据渲染处理逻辑
      addRender(element, fieldResizable ? 0 : tableColMaxLength, onCancel, ComponentCollection, status);

      if (['selectRadio', 'selectCheckout', 'treeSelect', 'treeSelectCheckout'].includes(element.selectMode)) {
        filterTreeSelectNotExistedInitValue(element);
      }

      finalColumns.push(element);
    } else {
      if (['includeInput', 'selectRange', 'selectCheckout', 'treeSelectCheckout'].includes(element.selectMode))
        AnalysisKey.push(element.dataIndex);
      finalColumns.push(element);
      // 不搜索分组标题 搜索条件隐藏
      element.hideInSearch = true;
      // 分组下的标题都隐藏则分组标题也隐藏
      element.hideInTable = element?.children.every((data) => data.hideInTable === 0);
      for (const ele of element?.children) {
        if (ele.fieldRow) {
          isMergeRow = true;
        }
        _dealColumn(ele, _rowMap, AnalysisKey, urlParams, isTree, columnScriptonChange);
        addRender(ele, fieldResizable ? 0 : tableColMaxLength, onCancel, ComponentCollection, status);

        getAlign(ele);

        // 用于处理分组显示条件下的是否显示查询判断
        // 放到第一层级，不显示在表格中 hideInTable: true
        const obj = {
          ...ele,
          hideInTable: true, // 表格内隐藏
          // sum: !!ele.sum,
          hideInSearch: ele.hideInSearch ? false : true,
        };

        finalColumns.push(obj);
      }
    }
  }

  // 当无查询条件时，隐藏重置，查询按钮
  let optionRender = false;

  // 当有一个查询条件时，在表格小于560px的情况下。隐藏展开/收起
  let searchIndex = 0;
  /**
   * 在url上不在搜索项中的值
   */
  const absoluteParams: Record<string, unknown> = {};
  for (const item of finalColumns) {
    if (!item.hideInSearch) {
      optionRender = true;
      searchIndex = searchIndex + 1;
    } else {
      // 不在搜索项中显示
      // 在url上传值
      if (urlParams?.[item?.dataIndex]) {
        absoluteParams[item?.dataIndex] = urlParams?.[item?.dataIndex];
      }
    }
  }

  return {
    finalColumns,
    optionRender: optionRender,
    searchIndex: searchIndex === 1,
    AnalysisKey,
    isMergeRow,
    absoluteParams,
    _rowMap,
  };
}

// 字段显示样式：数字、金额、百分比，右对齐
function getAlign(e: any) {
  if (['digit', 'money', 'percent'].includes(e.valueType)) {
    e.align = 'right';
  }
}

function getValue(e: any, text: any) {
  if (text === null || text === undefined) {
    return '-';
  }
  switch (e.valueType) {
    case 'digit':
      return digitData(text, e?.fieldUnit ?? 2);
    case 'money':
      return moneyData(e?.fieldUnit || '￥', text);
    case 'percent':
      return percentData(text, e?.fieldUnit ?? 2);
    default:
      return text;
  }
}

/**
 * 表格合计
 * @param props
 * @returns
 */
export function SummaryComponent(props: { sumData: Record<string, number | null>; e: DyTableColumnsType; i: number }) {
  const { sumData, e, i } = props;
  const text = sumData[e.dataIndex];

  return (
    <Table.Summary.Cell key={i} index={i}>
      {getValue(e, text)}
    </Table.Summary.Cell>
  );
}

/**
 * @description: 表格合计 table summary总结栏
 * @return ReactNode
 */
export function TableSummaryRow({
  columns,
  sum,
  tableIndexType,
  showTableStyle,
}: {
  sum: Record<string, number | null>;
  columns?: DyTableColumnsType[];
  tableIndexType?: 'turnPageSeriesIndex' | 'turnPageAgainIndex';
  showTableStyle?: 'isTree' | 'isExpand' | null;
}) {
  return (
    <Table.Summary.Row>
      {/* 有序号的情况  合计表头需要填充一列 */}
      {tableIndexType && <Table.Summary.Cell index={1024} />}
      {/* 可展开表格  合计表头需要填充一列 */}
      {showTableStyle === 'isExpand' && <Table.Summary.Cell index={2048} />}

      {columns?.flatMap((ele: DyTableColumnsType, index: number) => {
        if (ele.hideInTable) {
          return [];
        }
        const children = ele.children || [ele];
        return children.map((e: DyTableColumnsType, i: number) => (
          <SummaryComponent key={`${index}-${i}`} sumData={sum} e={e} i={i} />
        ));
      })}
    </Table.Summary.Row>
  );
}

/**
 * 合计上方展示
 * @param summarySumUp 合计展示参数
 * @returns ReactNode
 */
export function TableSummaryRowUp<T extends Record<string, any>>(summarySumUp: T) {
  if (Object.keys(summarySumUp).length <= 0) return null;
  return (
    <Alert
      type="info"
      message={Object.keys(summarySumUp).map((ele) => {
        const sum = summarySumUp?.[ele] === null ? '-' : (summarySumUp?.[ele] || 0).toString();
        const hasDecimal = sum % 1 !== 0;
        return (
          <Fragment key={ele}>
            {ele}: {hasDecimal ? sum?.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : Number(sum).toLocaleString()}&emsp;
          </Fragment>
        );
      })}
    />
  );
}

/**
 * 处理后端导出返回对象问题
 * @param response
 * @returns Promise
 */
export function judgeErrorByResponseType(response: any) {
  const { data } = response;
  return new Promise((resolve) => {
    if (data) {
      // 此处拿到的data才是blob
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const { result } = reader;
        const errorInfos = JSON.parse(result as string);
        resolve(errorInfos);
      });
      reader.addEventListener('error', (err) => {
        resolve(err);
      });
      reader.readAsText(data);
    }
  });
}

/**
 * @description: 处理可拖拽表格加宽
 * @param {number} index
 * @return {*}
 */
export function ResizableColumns(index: number) {
  // 计算自适应表头列宽索引
  let cWidthIndex = index;
  /**
   * 数据第一行列宽组合进表头
   * @param columns DyTableColumnsType[]
   * @param cWidth 获取表格第一行dom下列宽
   */
  const setupColumnsWidth = (columns: DyTableColumnsType[], cWidth: number[]) => {
    for (const item of columns) {
      if (!item.hideInTable && item?.children?.length) {
        // 递归
        setupColumnsWidth(item.children, cWidth);
      } else if (!item.hideInTable) {
        item.width = item.width ? item.width : cWidth[cWidthIndex];
        item.ellipsis = true;
        if (item.fieldUrl) {
          // 表格自带ellipsis会走表格内render，设置超链接时颜色属性失效。
          // 自定义加个className用于样式修改
          item.className = 'kj_dyTableColStyle';
        }
        cWidthIndex += 1;
      } else {
        // hideInTable = true，默认给个宽度值，主要是表头拖拽需要不能为空
        item.width = 1;
      }
    }
  };
  return setupColumnsWidth;
}

/**
 * @description: 递归插入树形数据
 * @param {Array} list
 * @param {number} key
 * @param {Array} children
 * @return {*}
 */
export const updateDictionaryData = (list: Array<any>, key: number | undefined, children: Array<any>): Array<any> => {
  return list.map((node) => {
    if (node.id === key) {
      if (children && children.length > 0) {
        return {
          ...node,
          children,
        };
      }
      return {
        ...node,
        children: undefined,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateDictionaryData(node.children, key, children),
      };
    }
    return node;
  });
};

/**
 * @description: 返回聚合结果
 * @param {T[]} data
 * @param {_rowMapType} _rowMap
 * @return {T[]} data
 */
// eslint-disable-next-line complexity
export function convertDataToRowSpan(
  data: any[],
  _rowMap: _rowMapType[] = [],
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number,
) {
  const dataClone = cloneDeep(data);
  const dataLength = dataClone?.length;
  for (const { dataIndex } of _rowMap) {
    let i = 0;
    // 处理相同值合并结果，最终结果不一定在页面呈现
    while (i < dataLength) {
      let count = 1;
      const r = i;
      if (!dataClone[r].row_span_map) {
        dataClone[r].row_span_map = {};
      }
      for (let j = i + 1; j < dataLength; j++) {
        // 值不相同结束循环
        if (dataClone[i][dataIndex] !== dataClone[j][dataIndex]) {
          break;
        }
        count++;
        i = j;
        if (!dataClone[j].row_span_map) {
          dataClone[j].row_span_map = {};
        }
        dataClone[j].row_span_map[dataIndex] = 0;
      }
      dataClone[r].row_span_map[dataIndex] = count;
      // 添加每条数据的索引 为后续切割找值，赋值做准备
      dataClone[i]._indexSort = i;
      i++;
    }
  }
  // const dataClone = cloneDeep(data);
  // const dataLength = dataClone?.length;
  // for (const value of _rowMap) {
  //   const { dataIndex } = value;
  //   // 处理相同值合并结果，最终结果不一定在页面呈现
  //   for (let i = 0; i < dataLength; i++) {
  //     let count = 1;
  //     const r = i;
  //     for (let j = i + 1; j < dataLength; j++) {
  //       if (!dataClone[j].row_span_map) {
  //         dataClone[j].row_span_map = {};
  //       }

  //       // 值不相同结束循环
  //       if (dataClone[i][dataIndex] !== dataClone[j][dataIndex]) {
  //         break;
  //       }
  //       count++;
  //       i = j; // r
  //       dataClone[j].row_span_map[dataIndex] = 0;
  //     }
  //     if (!dataClone[r].row_span_map) {
  //       dataClone[r].row_span_map = {};
  //     }
  //     dataClone[r].row_span_map[dataIndex] = count;
  //     // 添加每条数据的索引 为后续切割找值，赋值做准备
  //     dataClone[i]._indexSort = i;
  //   }
  // }

  for (const { dataIndex, fieldAggregation, fieldStrategy } of _rowMap) {
    // 存在聚合依据和聚合策略的处理结果
    // 沿用聚合对象的合并结果  "industry_level1_name" -> "industry_level2_code"
    if (fieldAggregation) {
      for (const ele of dataClone) {
        ele.row_span_map[dataIndex] = ele.row_span_map[fieldAggregation];
      }

      for (const ele of dataClone) {
        // 切割分组
        const scopeData = dataClone.slice(ele._indexSort, ele._indexSort + ele.row_span_map[dataIndex]);
        if (scopeData.length > 0) {
          let targetValue: number | string = '-';
          switch (fieldStrategy) {
            case Strategy.MAX:
              // 找到数组对象中的最大值
              targetValue = maxBy(scopeData, dataIndex)?.[dataIndex] ?? '-';
              break;
            case Strategy.MIN:
              targetValue = minBy(scopeData, dataIndex)?.[dataIndex] ?? '-';
              break;
            case Strategy.AVG:
              targetValue = meanBy(scopeData, dataIndex) ?? '-';
              break;
            case Strategy.SUM:
              targetValue = sumBy(scopeData, dataIndex) ?? '-';
              break;
            default:
              targetValue = expandStrategy?.(scopeData, dataIndex, fieldStrategy) || '-';
              break;
          }

          // 遍历赋值
          for (const e of scopeData) {
            e[dataIndex] = targetValue;
          }
        }
      }
    }
  }

  return dataClone;
}

/**
 * 获取组合页面的tabs默认activeKey
 * @param tabsName tabs名称集合
 * @param data url 上指定名称集合
 * @returns string
 */
export function getGroupActiveKey(tabsName?: string[], data: string[] = []): string {
  for (const name of tabsName || []) {
    if (data?.includes(name)) {
      return name;
    }
  }
  return '';
}

/**
 * 去除 Select TreeSelect 在选项中不存在的 initialValue
 */
export function filterTreeSelectNotExistedInitValue(column: DyTableColumnsType) {
  const { initialValue, fieldProps } = column;
  const isArray = Array.isArray(initialValue);
  const initValueArray = isArray ? initialValue : [initialValue];
  const newInitValue = [];
  const options = (fieldProps as any)?.options || [];
  /**
   * 递归查询 options 中是否存在value
   */

  if (!Array.isArray(options)) return;

  const stack = [...options];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node?.value && initValueArray.includes(node.value)) {
      newInitValue.push(node.value);
    }
    if (node?.children && node.children.length > 0) {
      stack.push(...node.children);
    }
  }
  // 重新排序，保证和 initialValue 顺序一致
  newInitValue.sort((a, b) => initValueArray.indexOf(a) - initValueArray.indexOf(b));
  column.initialValue = isArray ? newInitValue : newInitValue[0];
}
