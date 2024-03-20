/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 09:30:02
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\preview-table.tsx
 * @Description: 数据预览
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { history } from 'umi';

import { dynamicManagePreview } from '../services';
import { ExportDataType, SqlFields, SqlParams } from './../types';
import {
  convertDataToRowSpan,
  handleColumnsData,
  TableSummaryRow,
  TableSummaryRowUp,
  _rowMapType,
} from '../../dynamic-page-group/components/common';
import { Result, ActionType, AdvancedTable } from '@cscs-fe/base-components';
import { ExpandableConfig } from 'antd/es/table/interface';
import cuid from 'cuid';

const ExampleComponent = () => <>一只小蜜蜂罢了</>;

interface PreviewOptions {
  columns?: (SqlFields | SqlParams)[];
  dataResource?: string;
  dynamicName?: string;
  dynamicSql?: string;
  params?: any;
  onSubmit?: number; // 点击查询的标识
}

interface Props {
  /**
   * @description: 预览传递给接口的参数
   */
  previreOptions: PreviewOptions | undefined | null;
  /**
   * @description: 取消的回调，用于页面跳组件后关闭弹框
   * @return {*}
   */
  onCancel: () => void;
  /**
   * @description: 数据预览结果SQL
   * @return {*}
   */
  setSqlNode: (data: string) => void;
  exportData?: Partial<ExportDataType>;
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<any> & {
      ExpandableComponent: React.FC;
    };
  }>;
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
}

function createTableApiConfig(config: string | undefined | null) {
  if (!config) return null;
  try {
    const apiConfig = JSON.parse(config);
    return apiConfig;
  } catch (error) {
    console.error('CreateTableApiConfig error', error);
    return null;
  }
}

/**
 * @description: 数据预览
 * @param {*} props
 * @return {*}
 */
const PreviewTable: React.FC<Props> = (props) => {
  const { previreOptions, onCancel, setSqlNode, exportData, expandableConfig, expandStrategy } = props;
  const params = history?.location?.query;

  const actionRef = useRef<ActionType>();
  const [previewData, setPreviewData] = useState<any[]>([]); // 数据预览参数
  const [previewColumn, setPreviewColumn] = useState<any[]>([]); // 数据预览参数
  const [previewSum, setPreviewSum] = useState<JSX.Element>(); // 数据预览合计
  const [summarySumUp, setSummarySumUp] = useState<JSX.Element | null | undefined>(); // 上合计列的data
  const [previewSearchRender, setPreviewSearchRender] = useState<boolean>(); // 数据预览search
  const [previewLoading, setPreviewLoading] = useState<boolean>(); // 数据预览Loading
  const [errCode, setErrCode] = useState<string>(); // 数据预览权限Code
  const [includeKey, setIncludeKey] = useState<string[]>(); // 包含查询的dataIndex
  const [columnsParams, setColumnsParams] = useState({});
  const [isAsyncExpandedRowKeys, setIsAsyncExpandedRowKeys] = useState<readonly React.Key[]>([]); // 异步树形数据的key
  const [mergeRow, setMergeRow] = useState(false);
  const [rowMap, setRowMap] = useState<_rowMapType[]>();

  const { tableSumPosition, showTableStyle, isAsync, isExpandName, tableApiConfig: _tableApiConfig } = exportData || {};
  const { expandableParams, ...expandable } = expandableConfig?.find((ele) => ele.name === isExpandName) || {};
  const tableApiConfig = createTableApiConfig(_tableApiConfig) ?? {};

  useEffect(() => {
    if (previreOptions) {
      fetchPreviewData(previreOptions);
    }
  }, [previreOptions]);

  /**
   * @description: 请求数据及相关数据处理
   * @param {PreviewOptions} options
   * @return {*}
   */
  // eslint-disable-next-line complexity
  const fetchPreviewData = async (options: PreviewOptions | undefined | null) => {
    const previreParams = JSON.parse(JSON.stringify(options));
    // 请求参数处理
    for (const ele of previreParams.columns || []) {
      if (ele.columnType === 1) {
        ele.fieldDataAuthority =
          Array.isArray(ele.fieldDataAuthority) && ele.fieldDataAuthority.length > 0
            ? ele.fieldDataAuthority.toString()
            : null;
      }
    }
    setPreviewLoading(true);
    setIsAsyncExpandedRowKeys([]);
    try {
      const { data, errorCode } = await dynamicManagePreview(previreParams);
      const { finalColumns, optionRender, AnalysisKey, isMergeRow, _rowMap } = handleColumnsData({
        response: data?.column || [],
        onCancel,
        urlParams: params,
        status: 'modal',
      });
      const sumColumns = finalColumns
        ?.filter((i) => i.sum)
        .map((i) => {
          return {
            dataIndex: i.dataIndex,
            title: i.title,
          };
        });
      if (data?.sum && sumColumns && sumColumns?.length > 0) {
        let _data = data?.sum;
        if (Object.keys(data?.sum).length === 0) {
          _data = sumColumns.reduce((sum: any, item) => {
            sum[item.dataIndex] = null;
            return sum;
          }, {});
        }
        const summaryProps = { sum: _data, columns: finalColumns || [], showTableStyle };
        if (tableSumPosition === 'up') {
          const summarySumUp = sumColumns?.reduce((sum: any, item) => {
            if (data?.sum[item.dataIndex]) {
              sum[item.title || '?'] = data?.sum[item.dataIndex];
            } else {
              sum[item.title || '?'] = null;
            }
            return sum;
          }, {});
          setSummarySumUp(TableSummaryRowUp(summarySumUp));
        } else {
          setPreviewSum(TableSummaryRow(summaryProps));
        }
      }
      // 判断返回数据是否有id
      // 通过取第一个数据判断，省去遍历
      // 若无id，造一个假的。若有，则不管。
      if (Array.isArray(data?.data) && data?.data.length && !data?.data?.[0]?.id) {
        for (const ele of data?.data) {
          ele.id = cuid();
        }
      }
      setRowMap(_rowMap);
      setMergeRow(isMergeRow);
      setErrCode(errorCode); // 权限
      setPreviewSearchRender(optionRender); // search 显示隐藏
      setPreviewData(data?.data || []); // data
      setSqlNode(data?.sql || ''); // 数据预览结果SQL
      if (!previreParams.onSubmit) {
        // 暂时去掉 数据预览表头的排序
        for (const element of finalColumns || []) {
          element.sorter = false;
          for (const ele of element?.children || []) {
            ele.sorter = false;
          }
        }
        setPreviewColumn(finalColumns); // 表头
      }
      setIncludeKey(AnalysisKey);
    } catch (error) {
      throw new Error(error as string);
    } finally {
      setPreviewLoading(false);
    }
  };

  // 接口权限判断
  if (errCode === '403') {
    return (
      <div className="flex-center justify-content-center">
        <Result status={errCode} />
      </div>
    );
  }

  const ExpandComponent: React.FC<{
    record: Record<string, any>;
    _record: Record<string, any>;
    index: number;
    indent: number;
    expanded: boolean;
  }> = expandableParams?.ExpandableComponent || ExampleComponent;
  const expandableApi: ExpandableConfig<any> | undefined =
    showTableStyle === 'isExpand'
      ? {
          ...expandable,
          expandedRowRender: (record, index, indent, expanded) => (
            <ExpandComponent _record={record} record={record} index={index} indent={indent} expanded={expanded} />
          ),
        }
      : showTableStyle === 'isTree' && isAsync
      ? {
          // onExpand: async (expanded, record) => {
          //   // 展开 & children 为 [] 的时候发起请求
          //   if (expanded && record?.children?.length === 0) {
          //     try {
          //       const { data: childrenList } = await functionalForTreeData(record.id, columnsParams);
          //       setPreviewData((list) => updateDictionaryData(list, record.id, childrenList));
          //     } catch (error: any) {
          //       throw new Error(error);
          //     }
          //   }
          // },
          // expandedRowKeys: isAsyncExpandedRowKeys,
          // onExpandedRowsChange: setIsAsyncExpandedRowKeys,
        }
      : undefined;

  return (
    <div style={{ minHeight: 500 }}>
      {previreOptions ? (
        <AdvancedTable
          actionRef={actionRef}
          rowKey="id"
          loading={previewLoading}
          onSubmit={(params) => {
            // 特定查询模式下前端解析传参带有 | 的值
            for (const ele of includeKey || []) {
              if (params[ele] && !Array.isArray(params[ele])) params[ele] = params[ele]?.split('|');
            }
            setColumnsParams(params);
            fetchPreviewData({
              ...previreOptions,
              params,
              onSubmit: 1,
            });
          }}
          onReset={() => fetchPreviewData(previreOptions)}
          // dataSource={previewData || []}
          dataSource={
            mergeRow && previewData?.length ? convertDataToRowSpan(previewData, rowMap, expandStrategy) : previewData
          }
          isStartCrossLine={!mergeRow}
          columns={previewColumn || []}
          search={previewSearchRender ? {} : false}
          tableClassName="px-lg py-md"
          bordered
          fixActionColumn={true}
          scroll={{ x: 'max-content' }}
          expandable={expandableApi}
          title={summarySumUp ? () => summarySumUp : undefined}
          summary={() => {
            if (previewSum) {
              return previewSum;
            }
            return null;
          }}
          toolBarRender={false}
          pagination={false}
          {...tableApiConfig}
        />
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default PreviewTable;
