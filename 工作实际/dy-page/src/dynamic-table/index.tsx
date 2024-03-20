/* eslint-disable complexity */
/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-30 18:28:34
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-table\index.tsx
 * @Description: 动态页面预览页
 *
 */
import {
  ActionType,
  AdvancedTable,
  downloadBlob,
  ProColumns,
  Result,
  useConfigContext,
  visitTree,
} from '@cscs-fe/base-components';
import { TemplateImport } from '@cscs-fe/components';
import { ExcelOutlined } from '@cscs-fe/icons';
import { useRequest } from 'ahooks';
import { Button, message, Popconfirm, Space, Spin, Tooltip, Typography } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { history, useModel, useParams } from 'umi';
import request from 'umi-request';

import {
  convertDataToRowSpan,
  handleColumnsData,
  ResizableColumns,
  TableSummaryRow,
  TableSummaryRowUp,
  updateDictionaryData,
} from '../dynamic-page-group/components/common';
import { useGetCustomTableConfig } from '../dynamic-page-group/components/custom-hooks';
import {
  functionalForData,
  functionalForDataPreview,
  functionalForExport,
  functionalForExportPreview,
  functionalForTitle,
  functionalForTitlePreview,
  functionalForTreeData,
  functionalForTreeDataPreview,
  genSortQueryParams,
  sumDynamicManage,
  sumDynamicManagePreview,
} from '../dynamic-page-manage/services';
import { DyTableColumnsType, utilsRef } from '../dynamic-page-manage/types';
import DynamicTableSkeleton from './skeleton';
import CreateEditModal from './create-edit-modal';
import { deleteDataFromTable } from '../services';

const { Text } = Typography;
interface Props<RecordType> {
  /**
   * @description: 请求表头，数据，合计等接口所需id
   */
  id?: string;
  /**
   * @description: 获取动态页面名称回调，用于设置标签名
   */
  setTabName?: (name: string) => void;
  /**
   * @description: 点击表格数据跳转弹框 组件集合
   */
  LinkComponent?: { name: string; element: React.FC; width?: number }[];
  /**
   * @description: antd expandable
   */
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<RecordType> & {
      ExpandableComponent: React.FC;
    };
  }>;
  /**
   * @description: 聚合策略的扩展方法
   */
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
  wrapped?: boolean; // 是否包裹在卡片中
  /**
   * 内置卡片弹框 搜索传参
   */
  modalParams?: Record<string, unknown>;
  isPreview?: boolean; // 是否是编辑时预览状态
  onSearch?: (params: Record<string, any>) => void;
}

type Params = Record<string, string>;
function filterParams(params: Params): Params {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => !value?.includes('~')));
}

export const ExampleComponent = (props: any) => {
  return <span>{`\n：数据信息${`${JSON.stringify(props._record)}`}`}</span>;
};

const DynamicCreateContext = React.createContext([
  {
    name: 'TEST',
    element: ExampleComponent,
    width: 900,
  },
]);

export { DynamicCreateContext };

interface ConfigContext<T> {
  LinkComponent?: { name: string; element: React.FC; width?: number }[];
  /**
   * @description: antd expandable
   */
  expandableConfig: Array<{
    name: string;
    expandableParams: any; // fix: 类型推导错误
  }>;
  /**
   * @description: 聚合策略的扩展方法
   */
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
}

const OnlineTableConfigContext = React.createContext<ConfigContext<Record<string, unknown>> | null>(null);

function OnlineTable<RecordType extends Record<string, unknown>>(props: Props<RecordType>) {
  const {
    setTabName,
    LinkComponent: LinkComponent$,
    expandableConfig: expandableConfig$,
    expandStrategy: expandStrategy$,
    wrapped = true,
    modalParams = {},
    isPreview,
    onSearch,
  } = props;

  // 从url去的id，项目上自定义可改为传入 id
  const paramId = useParams()?.id;
  const id = props?.id || paramId;
  const {
    initialState: {
      // 获取菜单列表 用于取到当前名称
      menus,
      //  用于导出权限判断
      currentUser: { roles, email },
      // 参数配置 获取配置的最大字符数
      config: { tableColMaxLength = 50 } = {},
    },
  } = useModel('@@initialState');

  const params = { ...(history?.location?.query ?? {}), ...modalParams };
  const pathname = history?.location?.pathname;

  const configContext = useContext(OnlineTableConfigContext);
  const LinkComponent = LinkComponent$ || configContext?.LinkComponent;
  const expandableConfig = expandableConfig$ || configContext?.expandableConfig || [];
  const expandStrategy = expandStrategy$ || configContext?.expandStrategy;

  const [_store, set_Store] = useState<Record<string, unknown>>({}); // 占位变量，用于js脚本的特殊情况

  const actionRef = useRef<ActionType>();
  const [urlParams, setUrlParams] = useState<Record<string, unknown>>({}); // 保存 url 上的参数
  const [leftBarFilterParams, setLeftBarFilterParams] = useState<Record<string, any>>({});

  const [summaryComponent, setSummaryComponent] = useState<JSX.Element | null>(); // 下合计列的dom
  const [summarySumUp, setSummarySumUp] = useState<JSX.Element | null | undefined>(); // 上合计列的data
  const [cardTitle, setCardTitle] = useState<string>(''); // 卡片title
  const [dataSource, setDataSource] = useState<Array<Record<string, unknown>>>([]); // 表格数据存储
  const [finalColumns, setFinalColumns] = useState<Array<DyTableColumnsType>>([]); // 表格表头存储
  const [spinning, setSpinning] = useState(false); // loading
  const [columnsParams, setColumnsParams] = useState<Record<string, unknown>>({}); // 用于查询后的导出结果
  const [exportSort, serExportSort] = useState({}); // 用于排序后的导出结果
  const [submit, setSubmit] = useState(false); // 点击查询的判断, 用于后端判断不走默认值，走查询的值
  const [calcResizeWidthFinish, setCalcResizeWidthFinish] = useState<boolean>(false); // 用于判断 表格宽度是否计算完成
  const [dyTableDataDid, setDyTableDataDid] = useState<'padding' | 'fulfil' | 'lyingCorpses'>('padding'); // nothing
  const config = useConfigContext();
  const dynamicCreateContextValue = useContext(DynamicCreateContext);
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑
  const [currentData, setCurrentData] = useState<Record<string, any> | null>(null); // 当前编辑的数据
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // 是否显示新建弹框
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // 是否显示新建弹框

  const ComponentCollection = LinkComponent || dynamicCreateContextValue;
  const { configLoading, customTableConfig, tableApiConfig, isNotFound, jsScript, primaryKey } =
    useGetCustomTableConfig(id, roles, isPreview);
  /** js脚本定义的函数方法 */ const scriptRef = useRef<{
    [key: string]: (...args: any[]) => void;
  }>();
  const [jsScriptTableApi, setJsScriptTableApi] = useState({}); // js脚本额外添加的table api
  /** 把useState的变量变成响应式 */ const utils = useRef<utilsRef>({
    urlParams,
    _store,
    set_Store,
    finalColumns,
    setFinalColumns,
    dataSource,
    setDataSource,
    request,
  });

  const {
    tableImport,
    templateId,
    fieldExport,
    fieldResizable,
    tableIndexType,
    tableSumPosition,
    showTableStyle,
    isAsync,
    isExpandName,
    tableInsert,
    tableUpdate,
    tableDelete,
  } = customTableConfig || {};

  const [isAsyncExpandedRowKeys, setIsAsyncExpandedRowKeys] = useState<readonly React.Key[]>([]); // 异步树形数据的key

  // 可展开表格配置
  const { expandableParams, ...expandable } = expandableConfig?.find((ele) => ele.name === isExpandName) || {};

  /**
   * @description: 解析url上参数，动态设置card title
   */
  useEffect(() => {
    if (!params) return;

    if (params.dynamicName) {
      if (!(window as any).__POWERED_BY_QIANKUN__) {
        setTabName?.(params.dynamicName);
        setCardTitle(params.dynamicName);
      }
    } else {
      visitTree(menus, ({ link, menuName }) => {
        if (link?.startsWith(pathname)) {
          setTabName?.(menuName);
          setCardTitle(menuName);
        }
      });
    }
  }, [params]);

  // 把useState的变量变成响应式
  useEffect(() => {
    utils.current.urlParams = urlParams;
    utils.current.finalColumns = finalColumns;
    utils.current.dataSource = dataSource;
    utils.current._store = _store;
    utils.current.original = Object.freeze(Columns);
  }, [finalColumns, dataSource, _store]);

  useEffect(() => {
    if (customTableConfig && !isNotFound) {
      getColumns();
    }
  }, [customTableConfig]);

  /**
   * @description: 请求表头和处理
   */
  const {
    run: getColumns,
    data: Columns,
    loading: columnLoading,
  } = useRequest(
    () => {
      return isPreview ? functionalForTitlePreview(id) : functionalForTitle(id);
    },
    {
      refreshDeps: [id + history?.location?.search],
      formatResult: (res) => {
        if (!Array.isArray(res?.data)) return;
        // 这里使用生成了自定义render的columns，用于后续的处理，核心处理逻辑依然
        // 使用的高级表格的 customValueType 方法
        const rest = handleColumnsData({
          response: res?.data || [],
          urlParams: params,
          tableColMaxLength, // 传递配置的列字数
          fieldResizable, // 用于判断是表格自带的...处理还是框架的...处理
          ComponentCollection,
          customTableConfig,
          columnScriptonChange,
          isPreview,
        });

        setFinalColumns(rest?.finalColumns);
        setUrlParams(rest?.absoluteParams || {});
        return {
          errorCode: res.errorCode,
          ...rest,
        };
      },
      manual: true,
    },
  );

  /**
   * @description: 合计的处理
   * @return {*}
   */
  const handleSumDynamicManage = async (
    params: Record<string, unknown>,
    finalColumns: DyTableColumnsType[] | undefined,
  ) => {
    try {
      const requestFunction = isPreview ? sumDynamicManagePreview : sumDynamicManage;

      const { success, data } = await requestFunction(params);
      const sumColumns = finalColumns
        ?.filter((i) => i.sum)
        .map((i) => {
          return {
            dataIndex: i.dataIndex,
            title: i.title,
          };
        });

      if (success && data && sumColumns && sumColumns?.length > 0) {
        let _data = data;
        if (Object.keys(data).length === 0) {
          _data = sumColumns.reduce((sum: Record<string, number | null>, item) => {
            sum[item.dataIndex] = null;
            return sum;
          }, {});
        }
        const summaryProps = { sum: _data, columns: finalColumns || [], tableIndexType, showTableStyle };
        if (tableSumPosition === 'up') {
          const summarySumUp = sumColumns?.reduce((sum: Record<string, number | null>, item) => {
            if (data[item.dataIndex]) {
              sum[item.title || '?'] = data[item.dataIndex];
            } else {
              sum[item.title || '?'] = null;
            }
            return sum;
          }, {});
          setSummarySumUp(TableSummaryRowUp<typeof summarySumUp>(summarySumUp));
        } else {
          setSummaryComponent(TableSummaryRow(summaryProps));
        }
      } else {
        setSummarySumUp(null);
        setSummaryComponent(null);
      }
    } catch (error) {
      console.error(error);
      setSummarySumUp(null);
      setSummaryComponent(null);
    }
  };

  // 表头是否可拖拽
  useEffect(() => {
    // 如果配了序号，则跳过第一个
    if (finalColumns?.length > 0 && fieldResizable && dyTableDataDid === 'fulfil') {
      setTimeout(() => {
        // 加定时器确保渲染完成 预防多次render
        const tableMeasureRow: NodeListOf<any> | undefined = document
          .querySelector(`#dyTable${id}`)
          ?.querySelectorAll(`.${config.prefixCls}-table-measure-row`);
        const columnWidth: number[] = [];

        for (const ele of tableMeasureRow?.[0]?.cells) {
          columnWidth.push(ele.offsetWidth > 500 ? 500 : ele.offsetWidth || 150);
        }
        if (columnWidth.length > 0) {
          // 计算index 1. 是否有翻页排序，2. 是否有可展开
          const index = (tableIndexType ? 1 : 0) + (showTableStyle === 'isExpand' ? 1 : 0);
          ResizableColumns(index)(finalColumns, columnWidth);
          // 高级表格 calcResizeWidthFinish 属性
          setCalcResizeWidthFinish(true);
          // lying corpses 这个useEffect里面的方法只执行一次
          setDyTableDataDid('lyingCorpses');
        }
      }, 1000);
    }
  }, [finalColumns, fieldResizable, tableIndexType, dyTableDataDid]);

  /**
   * eval转义js script
   */
  useEffect(() => {
    if (jsScript) {
      // eslint-disable-next-line no-eval
      scriptRef.current = eval(jsScript);
      const isScriptFunction = scriptRef.current?.handleTableApi?.({ ...utils.current });
      if (typeof isScriptFunction === 'object' && isScriptFunction !== null) {
        setJsScriptTableApi(isScriptFunction);
      }
    }
  }, [jsScript]);

  // js脚本 搜索项 onChange 事件
  const columnScriptonChange = (_row: DyTableColumnsType) => {
    const isScriptFunction = scriptRef?.current?.[_row.dataIndex + 'OnChange'];
    if (typeof isScriptFunction === 'function') {
      _row.fieldProps = _row.fieldProps || {};
      _row.fieldProps.onChange = (...arg: any) => isScriptFunction({ ...utils.current }, ...arg);
    }
  };

  if (isNotFound) return <Result status={404} />;
  if (columnLoading || configLoading) {
    return <Spin />;
  }

  const ExpandComponent: React.FC<{
    record: Record<string, any>;
    _record: Record<string, any>;
    index: number;
    indent: number;
    expanded: boolean;
  }> = expandableParams?.ExpandableComponent || ExampleComponent;

  const expandableApi: ExpandableConfig<any> | undefined =
    // eslint-disable-next-line no-nested-ternary
    showTableStyle === 'isExpand'
      ? {
          ...expandable,
          expandedRowRender: (record, index, indent, expanded) => (
            <ExpandComponent _record={record} record={record} index={index} indent={indent} expanded={expanded} />
          ),
        }
      : showTableStyle === 'isTree'
      ? {
          onExpand: isAsync
            ? async (expanded, record) => {
                // 展开 & children 为 [] 的时候发起请求
                if (expanded && record?.children?.length === 0) {
                  try {
                    setSpinning(true);
                    const requestFunction = isPreview ? functionalForTreeDataPreview : functionalForTreeData;
                    const { data: childrenList } = await requestFunction(
                      record.id,
                      columnsParams,
                      genSortQueryParams(exportSort, showTableStyle === 'isTree'),
                    );
                    setDataSource((list) => updateDictionaryData(list, record.id, childrenList));
                  } catch (error: any) {
                    throw new Error(error);
                  } finally {
                    setSpinning(false);
                  }
                }
              }
            : undefined,
          expandedRowKeys: isAsyncExpandedRowKeys,
          onExpandedRowsChange: setIsAsyncExpandedRowKeys,
        }
      : undefined;

  /**
   * @description: 导出
   * @return {ReactNode}
   */
  const ExportControl = (
    <Fragment key="export">
      {fieldExport ? (
        <Text
          className={`${config.prefixCls}-pro-table-export`}
          onClick={async () => {
            try {
              setSpinning(true);
              const requestFunction = isPreview ? functionalForExportPreview : functionalForExport;
              const { response, data } = await requestFunction(
                id,
                columnsParams,
                genSortQueryParams(exportSort, showTableStyle === 'isTree'),
              );
              // console.warn('导出信息：', data);
              // 树形异步导出，通过发邮件形式导出，后端不返回数据
              if (data.size === 0 && isAsync && email) {
                message.success(
                  `由于导出文件需要一定时间，稍后将通过邮件发送至您系统绑定的邮箱（${email}），请注意查收。`,
                );
              }
              if (response && data && !isAsync) {
                const match = response.headers.get('content-disposition')?.match(/filename=(.*);?/);
                if (match) {
                  downloadBlob(match ? match[1] : '未知文件', data);
                } else {
                  // 由于统一做了错误处理，故先注释
                  // 处理后端导出失败，返回非blob格式数据处理
                  // const err: any = await judgeErrorByResponseType({ data });
                  // err && message.error(err?.message);
                }
              }
            } catch (error: any) {
              throw new Error(error);
            } finally {
              setSpinning(false);
            }
          }}
        >
          <Tooltip title="导出">
            <ExcelOutlined style={{ marginRight: 8, width: 16, height: 16, fontSize: 16, color: '#80D552' }} />
            <span style={{ verticalAlign: 'top', display: 'inline-block', paddingTop: 1, cursor: 'pointer' }}>
              导出
            </span>
          </Tooltip>
        </Text>
      ) : null}
    </Fragment>
  );

  // 更新左侧筛选栏参数
  const onLeftBarFilterParamsChange = (params: Params, reload: boolean) => {
    setLeftBarFilterParams(params);
    if (reload) {
      actionRef.current?.reload();
    }
  };

  // 新建弹框取消
  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  // 新建弹框确定
  const handleCreateOk = () => {
    setIsCreateModalVisible(false);
    actionRef.current?.reload();
  };

  // 打开编辑弹窗
  const handleEdit = (record: Record<string, any>) => {
    if (isPreview) return;
    setIsEdit(true);
    setCurrentData(record);
    setIsEditModalVisible(true);
  };

  // 编辑弹窗取消
  const handleEditCancel = () => {
    setIsEdit(false);
    setCurrentData(null);
    setIsEditModalVisible(false);
  };

  // 编辑弹窗确定
  const handleEditOk = () => {
    setIsEdit(false);
    setCurrentData(null);
    setIsEditModalVisible(false);
    actionRef.current?.reload();
  };

  // 删除数据
  const handleDelete = (record: Record<string, any>) => {
    const primaryKeyValue = record[primaryKey];

    if (!primaryKeyValue && primaryKeyValue !== 0) {
      message.error('主键值不存在');
      return;
    }

    deleteDataFromTable(id, { id: primaryKeyValue })
      .then((res) => {
        if (res?.success) {
          message.success('删除成功');
          actionRef.current?.reload();
        } else {
          message.error(res?.errorMessage);
        }
        return res;
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const actions = (_: React.ReactNode, record: any) => {
    return [
      tableUpdate ? (
        <Typography.Link key="edit" onClick={() => handleEdit(record)}>
          编辑
        </Typography.Link>
      ) : null,
      tableDelete ? (
        <Popconfirm key="delete" title="确认删除吗？" disabled={isPreview} onConfirm={() => handleDelete(record)}>
          <Typography.Link key="delete">删除</Typography.Link>
        </Popconfirm>
      ) : null,
    ];
  };

  /**
   * @description: 导入
   * @return {ReactNode}
   */
  const ImportControl = (
    <TemplateImport
      key="addTemplate"
      isMenu={tableImport && tableInsert}
      accessible={tableImport}
      templateId={templateId}
      uploadParams={{ service: 'dynamic_page', dynamic_id: id }}
      onUploadCallback={() => {
        actionRef.current?.reload();
      }}
      onAdd={() => {
        if (isPreview) return;
        setIsEdit(false);
        setCurrentData(null);
        setIsCreateModalVisible(true);
      }}
    />
  );

  // 新建按钮
  const buttonCreate = (
    <Button
      key="create"
      onClick={() => {
        if (isPreview) return;
        setIsEdit(false);
        setCurrentData(null);
        setIsCreateModalVisible(true);
      }}
      type="primary"
    >
      新建
    </Button>
  );

  const toolLeftBarRender = () => {
    if (tableImport && tableInsert) {
      return [ImportControl];
    }
    if (tableImport) {
      return [ImportControl];
    }
    if (tableInsert) {
      return [buttonCreate];
    }
    return [];
  };

  return (
    <OnlineTableConfigContext.Provider
      value={{
        LinkComponent,
        expandableConfig,
        expandStrategy,
      }}
    >
      <DynamicTableSkeleton
        wrapped={wrapped}
        title={cardTitle}
        leftBarTitle={tableApiConfig?.leftBarTitle}
        leftBarWidth={tableApiConfig?.leftBarWidth}
        columns={finalColumns}
        onLeftBarFilterParamsChange={onLeftBarFilterParamsChange}
        leftBarFilterParams={leftBarFilterParams}
      >
        <Spin spinning={spinning}>
          {/* 卡片内权限展示判断 */}
          {Columns?.errorCode === '403' ? (
            <div style={{ height: 520 }} className="flex-center justify-content-center">
              <Result status={Columns?.errorCode} />
            </div>
          ) : (
            <AdvancedTable
              actionRef={actionRef}
              rowKey="id"
              id={`dyTable${id}`}
              tableIndexType={tableIndexType}
              calcResizeWidthFinish={calcResizeWidthFinish}
              style={Columns?.optionRender ? {} : { marginTop: 24 }}
              dataSource={
                Columns?.isMergeRow && dataSource?.length
                  ? convertDataToRowSpan(dataSource, Columns?._rowMap, expandStrategy)
                  : dataSource
              }
              isStartCrossLine={!Columns?.isMergeRow}
              request={async (params: Record<string, any>, sort, filter, cusSort) => {
                // 特定查询模式下前端解析传参带有 | 的值
                for (const ele of Columns?.AnalysisKey || []) {
                  if (params[ele] && !Array.isArray(params[ele])) params[ele] = params[ele]?.split('|');
                }

                // 树形表格排序只支持升序
                const isTree = showTableStyle === 'isTree';
                for (const field of Object.keys(cusSort)) {
                  const column = finalColumns?.find((item) => item.dataIndex === field);
                  if (column?.sorter && isTree && cusSort[field] === 'desc') {
                    cusSort[field] = 'asc';
                  }
                }

                // 用于查询和排序后的导出结果
                serExportSort(cusSort);
                const finalParams = { ...urlParams, ...params, ...leftBarFilterParams };
                setColumnsParams(finalParams);
                if (submit) {
                  // onSubmit为1，用于后端判断不走配置默认值，取搜索项传的参数
                  finalParams.onSubmit = 1;
                }
                // 合计项传参
                handleSumDynamicManage(finalParams, finalColumns);

                const requestFunction = isPreview ? functionalForDataPreview : functionalForData;
                onSearch?.(finalParams);
                const { data, success, total } = await requestFunction(
                  finalParams,
                  genSortQueryParams(cusSort, showTableStyle === 'isTree'),
                  setDyTableDataDid,
                );
                setIsAsyncExpandedRowKeys([]);
                // 通过变量存储出来，主要是为了兼容树形数据 同步和异步加载的情况
                setDataSource(data || []);
                return {
                  success,
                  total,
                };
              }}
              title={summarySumUp ? () => summarySumUp : undefined}
              // 判断是否点击查询按钮，若点击查询按钮onSubmit为1，用于后端判断不走配置默认值，取搜索项传的参数
              onSubmit={(submitParams) => {
                setSubmit(true);
                const isScriptFunction = scriptRef.current?.handleSubmit;
                if (typeof isScriptFunction === 'function') isScriptFunction({ ...utils.current }, submitParams);
              }}
              onReset={() => {
                setSubmit(false);
                const isScriptFunction = scriptRef.current?.handleReset;
                if (typeof isScriptFunction === 'function') isScriptFunction({ ...utils.current });
              }}
              onChange={(pagination, filters, sorter, extra) => {
                const isScriptFunction = scriptRef.current?.handleTableChange;
                if (typeof isScriptFunction === 'function')
                  isScriptFunction({ ...utils.current }, pagination, filters, sorter, extra);
              }}
              columns={(finalColumns as ProColumns<DyTableColumnsType>[]) || []}
              params={{
                // 请求表格数据的id
                private_id: id,
                // 请求表格数据的url上的传参
                // private_urlParams: urlParams,
              }}
              search={Columns?.optionRender ? {} : false}
              toolLeftBarRender={toolLeftBarRender()}
              toolBarRender={() => [ExportControl]}
              bordered
              fixActionColumn={true}
              scroll={{ x: 'max-content' }}
              expandable={expandableApi}
              extraActions={tableUpdate || tableDelete ? actions : undefined}
              actionColumnWidth="120px"
              summary={() => {
                // 表格额外的列，用于展示合计
                if (summaryComponent) {
                  return summaryComponent;
                }
                return null;
              }}
              {...jsScriptTableApi}
              {...tableApiConfig}
            />
          )}
        </Spin>
      </DynamicTableSkeleton>

      {isCreateModalVisible ? (
        <CreateEditModal
          id={id}
          isEdit={false}
          columns={finalColumns}
          onCancel={handleCreateCancel}
          onSuccess={handleCreateOk}
        />
      ) : null}

      {isEditModalVisible ? (
        <CreateEditModal
          id={id}
          isEdit={true}
          columns={finalColumns}
          initialData={currentData}
          onCancel={handleEditCancel}
          onSuccess={handleEditOk}
        />
      ) : null}
    </OnlineTableConfigContext.Provider>
  );
}

export default OnlineTable;
