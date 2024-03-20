/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-11-23 16:11:20
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-08-31 17:06:52
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\enhance-dy-table.tsx
 * @Description: 动态页面预览页的封装，用于出码的组件
 *
 */
import { history, useModel } from 'umi';
import React, { Fragment, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Divider, message, Spin, Tooltip, Typography } from 'antd';
import { useRequest } from 'ahooks';

import {
  downloadBlob,
  visitTree,
  Result,
  useConfigContext,
  ProColumns,
  AdvancedTable,
  ActionType,
  AdvancedTableProps,
} from '@cscs-fe/base-components';
import {
  /**
   * 表头
   */
  functionalForTitle,
  /**
   * 数据
   */
  // functionalForData,
  enhanceFunctionalForData,
  /**
   * 合计
   */
  sumDynamicManage,
  /**
   * 导出
   */
  functionalForExport,
  /**  树形子数据接口 */ functionalForTreeData,
  genSortQueryParams,
} from './services';
import {
  handleColumnsData,
  TableSummaryRow,
  ResizableColumns,
  updateDictionaryData,
  TableSummaryRowUp,
  convertDataToRowSpan,
} from '../dynamic-page-group/components/common';
import { ExportOutlined } from '@cscs-fe/icons';
import { DyTableColumnsType, utilsRef } from './types';
import { DynamicCreateContext, ExampleComponent } from '../dynamic-table';
import { useGetCustomTableConfig } from '../dynamic-page-group/components/custom-hooks';
import { ExpandableConfig } from 'antd/es/table/interface';
import request from 'umi-request';
import DynamicTableSkeleton from '../dynamic-table/skeleton';

const { Link } = Typography;
type Props = Omit<AdvancedTableProps<any, any>, 'id'> & {
  /**
   * @description 获取页面数据的id
   */
  id: number | string;
  /**
   * @description 动态卡片名称
   */
  setTabName?: (name: string) => void;
  /**
   * @description 增强动态页面columns属性的暴露方法
   */
  customDealColumns?: (data: Array<DyTableColumnsType>) => Array<ProColumns & DyTableColumnsType>;
  /**
   * @description 增强动态页面表格数据的暴露方法
   */
  customDealdataSource?: (data: any[]) => any[];
  /**
   * @description 渲染右侧操作栏
   */
  toolBarRender?: ReactNode[];
  /**
   * @description 用于 request 查询的额外参数，一旦变化会触发重新加载
   */
  requestParams?: Record<string, unknown>;
  /**
   * @description 自定义请求表格data接口
   */
  customFunctionalForDataUrl?: string;
  /**
   * @description 自定义请求columns表头接口，返回的数据格式需参考原来接口
   */
  customFunctionalForTitle?: string;
  /**
   * @description: 点击表格数据跳转弹框 组件集合
   */
  LinkComponent?: { name: string; element: React.FC; width: number }[];
  /**
   * @description: antd expandable
   */
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<any> & {
      ExpandableComponent: React.FC;
    };
  }>;
  /**
   * @description: 聚合策略的扩展方法
   */
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
  /**
   * 用于动态页面组合 Table search api 控制
   */
  conditionDisplay?: boolean;
  /**
   * 动态页面组合公共查询条件
   */
  conditionPublic?: Record<string, any>;

  /**
   * @description: 卡片标题
   */
  cardTitle?: ReactNode;
};

const EnhanceDyTableInner: React.FC<Props> = (props) => {
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
  const {
    setTabName,
    id,
    onSubmit,
    onReset,
    toolBarRender = [],
    customDealdataSource,
    customDealColumns,
    requestParams = {},
    customFunctionalForDataUrl,
    customFunctionalForTitle,
    LinkComponent,
    expandableConfig,
    expandStrategy,
    conditionDisplay = true,
    conditionPublic = {},
    cardTitle,
    ...restProTableApi
  } = props;

  const params = history?.location?.query;
  const pathname = history?.location?.pathname;

  const [_store, set_Store] = useState<Record<string, unknown>>({}); // 占位变量，用于js脚本的特殊情况

  const actionRef = useRef<ActionType>();
  // 保存 url 上的参数
  const [urlParams, setUrlParams] = useState<Record<string, unknown>>({});
  // 下合计列的dom
  const [summaryComponent, setSummaryComponent] = useState<JSX.Element | null>();
  // 上合计列的data
  const [summarySumUp, setSummarySumUp] = useState<JSX.Element | null | undefined>();
  // 树形异步数据存储
  const [dataSource, setDataSource] = useState<Array<any>>([]);
  const [finalColumns, setFinalColumns] = useState<Array<DyTableColumnsType>>([]); // 表格表头存储
  // loading
  const [spinning, setSpinning] = useState(false);
  // 用于查询后的导出结果
  const [columnsParams, setColumnsParams] = useState({});
  // 用于排序后的导出结果
  const [exportSort, serExportSort] = useState({});
  // 点击查询的判断
  const [submit, setSubmit] = useState(false);
  // 用于判断 表格宽度是否计算完成
  const [calcResizeWidthFinish, setCalcResizeWidthFinish] = useState<boolean>(false);
  const [dyTableDataDid, setDyTableDataDid] = useState<'padding' | 'fulfil' | 'lyingCorpses'>('padding');
  const config = useConfigContext();
  const dynamicCreateContextValue = useContext(DynamicCreateContext);

  const [leftBarFilterParams, setLeftBarFilterParams] = useState<Record<string, any>>({});

  const ComponentCollection = LinkComponent || dynamicCreateContextValue;
  const { configLoading, customTableConfig, tableApiConfig, isNotFound, jsScript } = useGetCustomTableConfig(
    id as number,
    roles,
  );
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

  const { fieldExport, fieldResizable, tableIndexType, tableSumPosition, showTableStyle, isAsync, isExpandName } =
    customTableConfig || {};

  const [isAsyncExpandedRowKeys, setIsAsyncExpandedRowKeys] = useState<readonly React.Key[]>([]); // 异步树形数据的key

  // 可展开表格配置
  const { expandableParams, ...expandable } = expandableConfig?.find((ele) => ele.name === isExpandName) || {};

  /**
   * @description: 解析url上参数，动态设置card title
   */
  useEffect(() => {
    if (!params) return;
    // 动态设置卡片名称
    if (params?.dynamicName) {
      if (!(window as any).__POWERED_BY_QIANKUN__) {
        setTabName?.(params.dynamicName);
      }
    } else {
      visitTree(menus, ({ link, menuName }) => {
        if (link?.startsWith(pathname)) {
          setTabName?.(menuName);
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
    // 最低优先级故不放 params 中
    if (Object.keys(conditionPublic).length > 0) {
      actionRef.current?.reload();
    }
  }, [conditionPublic]);

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
      return functionalForTitle(id, customFunctionalForTitle);
    },
    {
      refreshDeps: [id + history?.location?.search],
      formatResult: (response) => {
        const rest = handleColumnsData({
          response: customDealColumns ? customDealColumns(response?.data || []) : response?.data,
          urlParams: params,
          tableColMaxLength, // 传递配置的列字数
          fieldResizable, // 用于判断是表格自带的...处理还是框架的...处理
          ComponentCollection,
          customTableConfig,
          columnScriptonChange,
        });
        setFinalColumns(rest?.finalColumns);
        setUrlParams(rest?.absoluteParams || {});
        return {
          errorCode: response.errorCode,
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
      const { success, data } = await sumDynamicManage(params);
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
        const tableMeasureRow: any = document
          .querySelector(`#dyTable${id}`)
          ?.querySelectorAll(`.${config.prefixCls}-table-measure-row`);
        const columnWidth: number[] = [];

        for (const ele of tableMeasureRow?.[0]?.cells) {
          columnWidth.push(ele.offsetWidth > 500 ? 500 : ele.offsetWidth || 100);
        }
        if (finalColumns?.length > 0 && columnWidth.length > 0) {
          // 计算index 1. 是否有翻页排序，2. 是否有可展开
          const index = (tableIndexType ? 1 : 0) + (showTableStyle === 'isExpand' ? 1 : 0);
          ResizableColumns(index)(finalColumns, columnWidth);
          // 高级表格 calcResizeWidthFinish 属性
          setCalcResizeWidthFinish(true);
          // lying corpses 这个useEffect里面的方法只执行一次
          setDyTableDataDid('lyingCorpses');
        }
      }, 500);
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

  // 可展开表格配置
  const ExpandComponent: React.FC<{
    record: any;
    _record: any;
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
      : showTableStyle === 'isTree' && isAsync
      ? {
          onExpand: async (expanded, record) => {
            // 展开 & children 为 [] 的时候发起请求
            if (expanded && record?.children?.length === 0) {
              try {
                setSpinning(true);
                const { data: childrenList } = await functionalForTreeData(
                  record.id,
                  columnsParams,
                  genSortQueryParams(exportSort, true),
                  customDealdataSource,
                  customFunctionalForDataUrl,
                );
                setDataSource((list) => updateDictionaryData(list, record.id, childrenList));
              } catch (error: any) {
                throw new Error(error);
              } finally {
                setSpinning(false);
              }
            }
          },
          expandedRowKeys: isAsyncExpandedRowKeys,
          onExpandedRowsChange: setIsAsyncExpandedRowKeys,
        }
      : undefined;

  /**
   * @description: 导出
   * @return {ReactNode}
   */
  const ExportContral = (
    <Fragment key="export">
      {fieldExport ? (
        <>
          <Link
            className={`${config.prefixCls}-pro-table-export`}
            onClick={async () => {
              try {
                setSpinning(true);
                const { response, data } = await functionalForExport(
                  id,
                  { ...conditionPublic, ...columnsParams },
                  genSortQueryParams(exportSort, showTableStyle === 'isTree'),
                );
                console.warn('导出信息：', data);
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
              <ExportOutlined style={{ marginRight: 8, width: 16, height: 16, fontSize: 16 }} />
              <span style={{ verticalAlign: 'top', display: 'inline-block', paddingTop: 1 }}>导出</span>
            </Tooltip>
          </Link>
          <Divider style={{ margin: 0 }} type="vertical" />
        </>
      ) : null}
    </Fragment>
  );

  // 更新左侧筛选栏参数
  const onLeftBarFilterParamsChange = (params: Record<string, any>, reload: boolean) => {
    setLeftBarFilterParams(params);
    if (reload) {
      actionRef.current?.reload();
    }
  };

  return (
    <DynamicTableSkeleton
      wrapped={false}
      title={cardTitle}
      leftBarTitle={tableApiConfig?.leftBarTitle}
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
              setColumnsParams(params);
              if (submit) {
                // onSubmit为1，用于后端判断不走配置默认值，取搜索项传的参数
                finalParams.onSubmit = 1;
              }
              // 合计项传参
              handleSumDynamicManage({ ...conditionPublic, ...finalParams }, finalColumns);
              const { data, success, total } = await enhanceFunctionalForData(
                { ...conditionPublic, ...finalParams },
                genSortQueryParams(cusSort, showTableStyle === 'isTree'),
                setDyTableDataDid,
                customDealdataSource,
                customFunctionalForDataUrl,
              );
              setIsAsyncExpandedRowKeys([]);
              // 通过变量存储出来，主要是为了兼容树形数据 同步和异步加载的情况
              setDataSource(data);
              return {
                success,
                total,
              };
            }}
            title={summarySumUp ? () => summarySumUp : undefined}
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
              // 外部额外传入的参数
              ...requestParams,
            }}
            search={Columns?.optionRender && conditionDisplay ? {} : false}
            toolBarRender={() => [ExportContral, ...toolBarRender]}
            bordered
            fixActionColumn={true}
            scroll={{ x: 'max-content' }}
            expandable={expandableApi}
            summary={() => {
              // 表格额外的列，用于展示合计
              if (summaryComponent) {
                return summaryComponent;
              }
              return null;
            }}
            {...jsScriptTableApi}
            {...tableApiConfig}
            {...restProTableApi}
            // 判断是否点击查询按钮，若点击查询按钮onSubmit为1，用于后端判断不走配置默认值，取搜索项传的参数
            onSubmit={(submitParams) => {
              onSubmit?.(submitParams);
              setSubmit(true);
              const isScriptFunction = scriptRef.current?.handleSubmit;
              if (typeof isScriptFunction === 'function') isScriptFunction({ ...utils.current }, submitParams);
            }}
            onReset={() => {
              onReset?.();
              setSubmit(false);
              const isScriptFunction = scriptRef.current?.handleReset;
              if (typeof isScriptFunction === 'function') isScriptFunction({ ...utils.current });
            }}
          />
        )}
      </Spin>
    </DynamicTableSkeleton>
  );
};

const EnhanceDyTable: React.FC<Props> = (props) => {
  const { id, ...restProps } = props;
  const [currentId, setCurrentId] = useState<number | string | null>(null);

  useEffect(() => {
    setCurrentId(null);
    if (id) {
      setTimeout(() => {
        setCurrentId(id);
      }, 100);
    }
  }, [id]);

  return currentId ? <EnhanceDyTableInner id={currentId} {...restProps} /> : null;
};

export default EnhanceDyTable;
