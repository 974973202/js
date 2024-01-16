import { ParamsType } from '@ant-design/pro-provider';
import { ProColumns } from '@ant-design/pro-table';
import { ExcelOutlined } from '@cscs-fe/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  ConfigProvider,
  message,
  Popconfirm,
  Select,
  Space,
  TablePaginationConfig,
  Tooltip,
  Typography,
} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { pickBy } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import { useUnactivate } from 'react-activation';

import { queryTableColumns } from '../services/common';
import CusEmpty from '../shared/components/empty/empty';
import LoadingComponent from '../shared/components/loading';
import { useConfigContext } from '../shared/config-provider';
import { downloadBlob } from '../shared/utils';
import { customValueType } from './custom-value-type';
import DndDragColumn from './dnd-drag-column';
import DragColumn from './drag-column';
import FormModal, { FormModalRef } from './form-modal';
import { del, exportData } from './service';
import InnerTable from './table';
import TableSelect from './table-select';
import { AdvancedColumns, AdvancedTableProps, CusSortOrder } from './typing';
import { Uploader } from './uploader';

const defaultPageSize = 10;
const { Text } = Typography;

// 序号连续自增
const turnPageSeriesIndex: AdvancedColumns = {
  title: '序号',
  dataIndex: 'index',
  hideInSearch: true,
  width: 50,
  render: (_, r, index: number, action: any) => {
    const { pageInfo: { current = 1, pageSize = 10 } = {} } = action || {};
    return <span>{(current - 1) * pageSize + index + 1}</span>;
  },
};

// 序号翻页重置
const turnPageAgainIndex: AdvancedColumns = {
  title: '序号',
  hideInSearch: true,
  dataIndex: 'index',
  valueType: 'index',
  width: 50,
};

function createDefaultButtons(props: {
  enableExport: boolean;
  backCode: string | undefined;
  queryParams: Record<string, any>;
  exportParams?: Record<string, any>;
  onUploaded: () => void;
  exportFn?: (...params: any) => void;
  prefixCls?: string;
}) {
  const { backCode, enableExport, queryParams, exportParams, exportFn, prefixCls } = props;

  return [
    enableExport ? (
      <Text
        className={`${prefixCls}-pro-table-export`}
        onClick={async () => {
          const params = exportParams ? { ...exportParams } : {};
          if (exportFn) {
            exportFn(queryParams ? { ...params, ...queryParams } : params);
            return;
          }
          if (backCode) {
            try {
              const { response, data } = await exportData(
                backCode,
                queryParams ? { ...params, ...queryParams } : params,
              );
              if (response && data) {
                const match = response.headers.get('content-disposition')?.match(/filename=(.*);?/);
                downloadBlob(match ? match[1] : '未知文件', data);
              }
            } catch {
              message.error('导出失败');
            }
          }
        }}
      >
        <Tooltip title="导出">
          <ExcelOutlined style={{ marginRight: 8, width: 16, height: 16, fontSize: 16, color: '#80D552' }} />
          <span style={{ verticalAlign: 'top', display: 'inline-block', paddingTop: 1, cursor: 'pointer' }}>导出</span>
        </Tooltip>
      </Text>
    ) : null,
  ];
}

/**
 * 表格Select搜索项
 * @param column AdvancedColumns
 * @param columns AdvancedColumns[]
 */
const setSelected = (column: AdvancedColumns, columns: AdvancedColumns[]) => {
  const dependIndex = column.dependIndex;
  if (dependIndex) {
    column.renderFormItem = (item, { type, ...rest }, form) => {
      if (type === 'form') {
        return null;
      }
      const stateType = form.getFieldValue(dependIndex);
      const dependColumn = columns.find((c) => c.dataIndex === dependIndex);
      const stateTypeName = dependColumn ? (dependColumn.title as string) : '';
      return (
        <TableSelect
          {...rest}
          state={{
            type: stateType,
            column: dependIndex,
            title: stateTypeName,
          }}
        />
      );
    };
  }
};

/**
 * 表格Columns处理
 * @param columns AdvancedColumns[]
 * @param textMaxLength number
 * @returns ReactNode
 */
function createFinalColumns(
  columns: AdvancedColumns[],
  textMaxLength?: number,
  tableIndexType?: 'turnPageSeriesIndex' | 'turnPageAgainIndex' | undefined,
) {
  for (const i of columns) {
    setSelected(i, columns);
    if (i.render) continue;
    customValueType(i, textMaxLength);
  }
  if (tableIndexType) {
    let indexTableData: AdvancedColumns | undefined;
    if (tableIndexType === 'turnPageAgainIndex') {
      indexTableData = turnPageAgainIndex;
    } else if (tableIndexType === 'turnPageSeriesIndex') {
      indexTableData = turnPageSeriesIndex;
    }

    indexTableData && columns.unshift(indexTableData);
  }

  return columns;
}

/**
 * 动态计算表头搜索项名称长度
 * @param columns AdvancedColumns[]
 * @returns number | string
 */
function calcTitleLabelWidth(columns: AdvancedColumns[]) {
  const titleLabelWidth = [];
  for (const { title, hideInSearch, search } of columns || []) {
    const computeSearch = search === false ? false : !hideInSearch;
    if (computeSearch && typeof title === 'string') {
      const titleArr = title.split('') || [];
      let txtLabelWidth = 10;
      for (const txt of titleArr) {
        txtLabelWidth += /[^\u4E00-\u9FA5]/.test(txt) ? 8 : 15; // 中文一个字 15px  非中文 8
      }
      titleLabelWidth.push(txtLabelWidth < 40 ? 40 : txtLabelWidth);
    } else {
      titleLabelWidth.push(10);
    }
  }
  const LabelWidthMax = Math.max.apply(null, titleLabelWidth);
  return LabelWidthMax;
}

function transformDotPropsToObject(params: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const keys = key.split('.');
      const value = params[key];
      if (keys.length > 1) {
        let obj = result;
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (i === keys.length - 1) {
            obj[k] = value;
          } else {
            // eslint-disable-next-line max-depth
            if (!obj[k]) {
              obj[k] = {};
            }
            obj = obj[k];
          }
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * 高级表格 更快 更好 更方便
 * @param props
 * TODO:
 * 参数分组、测试、文档注释、组件拆分、表单扩展性（表单项数据处理）
 *
 */
// eslint-disable-next-line complexity
const AdvancedTable = <T extends Record<string, any>, U extends ParamsType = ParamsType>(
  props: AdvancedTableProps<T, U>,
) => {
  const {
    extraColumns = [],
    extraToolbar,
    accessConfig,
    pageCode,
    backCode,
    toolBarSwitcher = {
      add: true,
      import: true,
      export: true,
    },
    formValueMapper,
    actionsVisible = true,
    fixActionColumn,
    extraActions,
    extraActionsPosition = 'after',
    onUpdated,
    onCreated,
    // 如果用户自己控制页码，需要使用onDelete来判断是否跳转到前一页
    onDelete,
    columns,
    pagination,
    search,
    rowKey = 'id',
    size = 'large',
    paginationSize = 'small',
    toolBarRender,
    headerTitle,
    toolLeftBarRender,
    actionRef,
    onSubmit,
    onReset,
    onLoad,
    onChange,
    options = {
      density: false,
    },
    actionColumnWidth,
    colMaxLength = 50,
    exportParams,
    dragSort,
    dndDragSort,
    onSortEnd,
    postData,
    expandable,
    request,
    formModalLayout,
    customEmpty,
    exportFn,
    tableIndexType,
    isFilterEmptyParamsValue = true,
    rowClassName,
    isStartCrossLine = true,
    ...restProps
  } = props;
  const [isUpdate, setIsUpdate] = useState(false);
  const modalRef = useRef<FormModalRef | null>(null);
  const [queryParams, setQueryParams] = useState<any>();
  const [currentPageTotal, setCurrentPageTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [finalColumns, setFinalColumns] = useState<any[]>(columns || []);
  const config = useConfigContext();

  let finalComponents;

  const finalPagination =
    pagination !== false
      ? {
          defaultPageSize,
          size: paginationSize,
          showSizeChanger: true,
          showQuickJumper: true,
          current: currentPage,
          ...pagination,
        }
      : false;

  const _onSubmit = (params: any) => {
    if (onSubmit) {
      onSubmit(params);
    }
    setQueryParams(params);
  };

  const _onReset = () => {
    if (onReset) {
      onReset();
    }
    setQueryParams({});
  };

  const mapFormValue = (record: any) => {
    const newRecord = {
      ...record,
    };
    if (!formValueMapper) {
      return record;
    }
    const keys = Object.keys(formValueMapper);
    for (const key of keys) {
      const mapTo = formValueMapper[key].mapTo;
      const mapper = formValueMapper[key].mapper;
      newRecord[mapTo] = mapper(newRecord[key]);
      delete newRecord[key];
    }
    return newRecord;
  };

  const maxLabelWidth = calcTitleLabelWidth(finalColumns);

  const finalSearch =
    typeof search === 'boolean'
      ? search
      : {
          labelWidth: maxLabelWidth,
          ...search,
        };

  const handleOnLoad = (dataSource: any) => {
    if (dataSource) {
      setCurrentPageTotal(dataSource.length);
    }
    if (onLoad) {
      onLoad(dataSource);
    }
  };

  const handleOnChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: any,
    extra: any,
    // eslint-disable-next-line max-params
  ) => {
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
    setCurrentPage(pagination.current || 1);
  };

  const defaultToolbarButtons = createDefaultButtons({
    backCode,
    enableExport: toolBarSwitcher.export && accessConfig?.export,
    queryParams,
    exportParams,
    onUploaded: () => {
      actionRef?.current?.reload();
    },
    exportFn,
    prefixCls: config.prefixCls,
  });

  const defaultActions = (__: any, record: any) => [
    accessConfig?.update ? (
      <Typography.Link
        key="table-provider-edit"
        onClick={() => {
          setIsUpdate(true);
          modalRef.current?.setFormValue(mapFormValue(record));
          modalRef.current?.open();
        }}
      >
        编辑
      </Typography.Link>
    ) : undefined,
    accessConfig?.delete ? (
      <Popconfirm
        key="table-provider-delete"
        title="确定要删除吗?"
        onConfirm={() => {
          const id = record[rowKey as string];
          if (id && backCode) {
            del(id, backCode)
              .then((res) => {
                if (res.success) {
                  if (currentPageTotal > 1 || currentPage === 1) {
                    actionRef?.current?.reload();
                  } else {
                    const page = currentPage - 1;
                    if (onDelete) {
                      onDelete(true, record);
                    } else {
                      setCurrentPage(page);
                    }
                  }
                  message.success('删除成功');
                }
                return res;
              })
              .catch(() => {
                message.error('删除失败');
              });
          }
        }}
        okText="确定"
        cancelText="取消"
      >
        <Typography.Link type="danger">删除</Typography.Link>
      </Popconfirm>
    ) : undefined,
  ];

  const actionColumn: ProColumns | null = {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    width: actionColumnWidth,
    fixed: fixActionColumn ? 'right' : undefined,
    render: (__: any, record: any) => {
      if (extraActionsPosition === 'before') {
        return (
          <Space size="middle">
            {extraActions ? extraActions(__, record) : null}
            {defaultActions(__, record).filter((i) => i)}
          </Space>
        );
      }
      if (extraActionsPosition === 'after') {
        return (
          <Space size="middle">
            {defaultActions(__, record).filter((i) => i)}
            {extraActions ? extraActions(__, record) : null}
          </Space>
        );
      }
    },
  };

  const _toolbarRender: typeof toolBarRender = (...args) => [
    toolBarRender ? toolBarRender(...args) : null,
    extraToolbar,
    ...defaultToolbarButtons,
  ];

  const _toolLeftbarRender: React.ReactNode[] = [
    <span key="table-provider-headerTitle" style={{ marginRight: headerTitle ? 8 : 0 }}>
      {headerTitle}
    </span>,
    toolBarSwitcher.add && accessConfig?.add ? (
      <Button
        key="table-provider-create"
        type="primary"
        onClick={() => {
          setIsUpdate(false);
          modalRef.current?.open();
          modalRef.current?.setFormValue({});
        }}
        style={{ marginRight: 8 }}
      >
        新建
      </Button>
    ) : null,
    toolBarSwitcher.import && accessConfig?.import ? (
      <div style={{ marginRight: 8 }}>
        <Uploader actionRef={actionRef} backCode={backCode} />
      </div>
    ) : null,
    toolLeftBarRender,
  ];

  // 如果传入pageCode并且columns为undefined，则表格列通过pageCode请求
  const { data: columnData, run: runQueryTableColumns } = useRequest(
    () => {
      return queryTableColumns(pageCode || '');
    },
    {
      manual: true,
      ready: pageCode !== undefined && pageCode !== '' && !columns,
      formatResult: (response: any) => {
        return response?.data;
      },
      onSuccess: () => {
        if (Array.isArray(columnData) && columnData.length > 0) {
          let tempColumns = [...columnData, ...extraColumns];
          const innerActionColumnVisible = actionsVisible && (extraActions || pageCode);
          if (innerActionColumnVisible) {
            tempColumns = [...tempColumns, actionColumn];
          }
          tempColumns = createFinalColumns(tempColumns, colMaxLength, tableIndexType);
          setFinalColumns(tempColumns);
          actionRef?.current?.reload();
        }
      },
    },
  );

  // 通过接口请求表格Columns
  useEffect(() => {
    if (!columns) {
      runQueryTableColumns();
    }
  }, [pageCode]);

  useEffect(() => {
    if (Array.isArray(columns) && columns.length > 0) {
      let tempColumns = [...columns, ...extraColumns];
      const innerActionColumnVisible = actionsVisible && (extraActions || pageCode);
      if (innerActionColumnVisible) {
        tempColumns = [...tempColumns, actionColumn];
      }
      tempColumns = createFinalColumns(tempColumns, colMaxLength, tableIndexType);
      setFinalColumns(tempColumns);
    }
  }, [columns, currentPage]); // currentPage 用于判断columns外部传入 删除非第一页最后一条数据

  useUnactivate(() => {
    modalRef.current?.close();
  });

  // 两种表格拖拽排序的判断
  if (dragSort || dndDragSort) {
    for (const ele of currentData as any[]) ele.key = ele[rowKey as string];
    const DragColumnProps = {
      data: currentData,
      onSortEnd,
    };
    const { components: dragComponents } = dragSort ? DragColumn(DragColumnProps) : DndDragColumn(DragColumnProps);
    finalComponents = dragComponents;
  }

  // rowClassName
  const _rowClassName = (record: T, index: number, indent: number) => {
    let _className = '';
    if (rowClassName) {
      _className = typeof rowClassName === 'function' ? rowClassName(record, index, indent) : rowClassName;
    }
    if (isStartCrossLine) {
      return index % 2 === 0 ? `even-row-table-provider ${_className}` : `odd-row-table-provider ${_className}`;
    }
    return _className;
  };

  const onTableDataChange = (data: T[]) => {
    setCurrentData(data);
    return data;
  };

  for (const column of finalColumns) {
    if (column.valueEnum && !column.renderFormItem) {
      column.renderFormItem = (_: any, formItemProps: any) => {
        const { type, ...restProps } = formItemProps;
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            placeholder="请选择"
            showSearch
            optionFilterProp="label"
            allowClear
            filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
            {...restProps}
          />
        );
      };
    }
  }

  if (!finalColumns || finalColumns.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <ConfigProvider prefixCls={config.prefixCls} locale={zhCN} renderEmpty={() => CusEmpty(customEmpty)}>
      <InnerTable<T, U>
        {...restProps}
        onSubmit={_onSubmit}
        onReset={_onReset}
        onLoad={handleOnLoad}
        onChange={handleOnChange}
        rowClassName={_rowClassName}
        actionRef={actionRef}
        toolBarRender={toolBarRender === false ? false : _toolbarRender}
        headerTitle={_toolLeftbarRender}
        rowKey={rowKey}
        search={finalSearch}
        columns={finalColumns}
        pagination={finalPagination}
        options={options}
        size={size}
        components={finalComponents}
        request={
          request
            ? (params, sort, filter) => {
                const cusSort: Record<string, CusSortOrder> = {};
                if (sort) {
                  const sortKeys = Object.keys(sort);
                  for (const key of sortKeys) {
                    const dbFieldColumn = finalColumns.find((c: any) => c.dataIndex === key);
                    if (dbFieldColumn?.dbField) {
                      if (sort[key] === 'descend') {
                        cusSort[dbFieldColumn.dbField] = 'desc';
                      } else if (sort[key] === 'ascend') {
                        cusSort[dbFieldColumn.dbField] = 'asc';
                      } else {
                        cusSort[dbFieldColumn.dbField] = null;
                      }
                    }
                  }
                }

                // 过滤掉空值
                let finalParams = isFilterEmptyParamsValue
                  ? (pickBy(params, (value) => value !== '') as U & {
                      pageSize?: number | undefined;
                      current?: number | undefined;
                      keyword?: string | undefined;
                    })
                  : params;

                finalParams = transformDotPropsToObject(finalParams) as U & {
                  pageSize?: number | undefined;
                  current?: number | undefined;
                  keyword?: string | undefined;
                };

                return request(finalParams, sort, filter, cusSort);
              }
            : undefined
        }
        postData={(data) => {
          onTableDataChange?.(data);
          return postData ? postData(data) : data;
        }}
        expandable={{
          ...expandable,
          indentSize: 22,
          // expandIcon: expandable?.expandIcon
          //   ? expandable?.expandIcon
          //   : ({ expanded, onExpand, record, expandable }) =>
          //       expandable ? (
          //         <span className="d-inline-block mr-sm" style={{ width: 14, height: 14 }}>
          //           {expanded ? (
          //             <TreeExpandedOutlined onClick={(e) => onExpand(record, e)} />
          //           ) : (
          //             <TreeCollectedOutlined onClick={(e) => onExpand(record, e)} />
          //           )}
          //         </span>
          //       ) : null,
        }}
      />
      {/* 通过配置生成新建数据的表单窗口 */}
      <FormModal
        modalRef={modalRef}
        isUpdate={isUpdate}
        pageCode={pageCode || ''}
        backCode={backCode || ''}
        onUpdated={() => {
          actionRef?.current?.reload();
          if (onUpdated) {
            onUpdated();
          }
        }}
        onCreated={() => {
          actionRef?.current?.reload();
          if (onCreated) {
            onCreated();
          }
        }}
        formModalLayout={formModalLayout}
      />
    </ConfigProvider>
  );
};

export default AdvancedTable;
