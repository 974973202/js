/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-12-07 17:11:46
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-25 15:38:15
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-group\components\custom-hooks.tsx
 * @Description: 自定义hooks
 *
 */
import { handleColumnsData } from './common';
import request from 'umi-request';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { ColumnType } from '../types';
import { getDynamicManageDetail, getDynamicManageDetailPreview } from '../../dynamic-page-manage/services';
import { getDynamicGroupDetail } from '../services';

interface Props {
  params: any;
  tableColMaxLength: number;
  column: Array<ColumnType>;
  LinkComponent?: { name: string; element: React.FC; width?: number }[];
}

/**
 * 请求组合表头
 * @param param
 * @returns
 */
export function useReqTableTitle({ params, tableColMaxLength, column, LinkComponent }: Props) {
  const { run, fetches } = useRequest(
    (id) => {
      return request(`/page/system/dynamic/page/manage/functionalForTitle/${id}`);
    },
    {
      formatResult: (response: any) => {
        const newData = Array.isArray(response?.data)
          ? handleColumnsData({
              response: response?.data,
              urlParams: params,
              tableColMaxLength,
              fieldResizable: false,
              ComponentCollection: LinkComponent,
            })
          : [];
        return newData;
      },
      fetchKey: (id) => id,
      manual: true,
    },
  );

  useEffect(() => {
    if (column.length > 0) {
      for (const { dynamicId } of column) {
        // dynamicId 为 -1不是动态页面故不需要请求表头
        if (!fetches?.[dynamicId] && dynamicId !== -1) {
          run(dynamicId);
        }
      }
    }
  }, [column]);
  return fetches;
}

/**
 * 获取组合详情
 * @param id
 * @returns
 */
export function useGroupInitData(id: any) {
  const {
    data: initialData,
    run: getInitialData,
    loading,
  } = useRequest(
    (id) => {
      return getDynamicGroupDetail(id);
    },
    {
      formatResult: (response: any) => {
        return response?.data;
      },
      manual: true,
    },
  );
  useEffect(() => {
    if (id) {
      getInitialData(id);
    }
  }, [id]);
  return {
    initialData,
    loading,
  };
}

interface CustomTableConfigType {
  /** 导入权限 */ tableImport: boolean;
  /** 配置的模板id */ templateId: number | null;
  /** 导出权限 */ fieldExport: boolean;
  /** 表头拖拽 */ fieldResizable: boolean;
  /** 翻页序号 */ tableIndexType: 'turnPageSeriesIndex' | 'turnPageAgainIndex' | undefined;
  /** 合计位置 */ tableSumPosition?: 'up' | 'down';
  /** 表格显示样式 */ showTableStyle?: 'isTree' | 'isExpand';
  /** isExpand name */ isExpandName?: string;
  /** 树形数据同步展示还是异步 */ isAsync?: boolean;
  /** 树形数据根节点id */ parent_id?: string;
  /** 新建权限 */ tableInsert?: boolean;
  /** 编辑权限 */ tableUpdate?: boolean;
  /** 删除权限 */ tableDelete?: boolean;
}

/**
 * @description: 获取表格自定义配置信息
 * @return {*}
 */
export function useGetCustomTableConfig(
  id: number,
  roles: any[],
  isPreview = false,
): {
  isNotFound: boolean;
  configLoading: boolean;
  customTableConfig: CustomTableConfigType;
  tableApiConfig: Record<string, any>;
  jsScript: string;
  primaryKey: string;
} {
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const [customTableConfig, setCustomTableConfig] = useState<CustomTableConfigType>({
    /** 导入权限 */ tableImport: false,
    /** 配置的模板id */ templateId: null,
    /** 导出权限 */ fieldExport: false,
    /** 表头拖拽 */ fieldResizable: false,
    /** 翻页序号 */ tableIndexType: undefined,
  });
  const [tableApiConfig, setTableApiConfig] = useState<Record<string, any>>({});
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [jsScript, setJsScript] = useState<string>('');
  const [primaryKey, setPrimaryKey] = useState<string>('');

  // 权限赋值方法
  const checkAuthority = (authority: any): boolean => {
    let isAuthority = false;
    if (!authority || authority?.length === 0) {
      isAuthority = true;
    } else {
      for (const item of roles) {
        if ((authority || []).includes(item.toString())) {
          isAuthority = true;
          break;
        }
      }
    }
    return isAuthority;
  };

  /**
   * @description: 获取表格配置
   */
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setConfigLoading(true);
          const requestFunction = isPreview ? getDynamicManageDetailPreview : getDynamicManageDetail;

          const { data } = (await requestFunction(id)) || {};

          // 预览时id为空
          if (!data?.id && !isPreview) {
            setIsNotFound(true);
            return;
          }
          const { tableImport, templateId, importAuthority } = data;
          const {
            fieldExport,
            fieldExportAuthority,
            fieldResizableTitle,
            tableIndexConfig,
            tableSumPosition,
            tableInsert,
            tableUpdate,
            tableDelete,
            insertAuthority,
            updateAuthority,
            deleteAuthority,
            ...rest
          } = JSON.parse(data?.customTableConfig || '{}');
          const config: CustomTableConfigType = { ...customTableConfig, ...rest };

          // 允许导入权限处理
          if (tableImport === 1) {
            const value = checkAuthority(importAuthority) && !!templateId;
            config.tableImport = value;
            config.templateId = templateId || null;
          }

          // 允许导出权限处理
          if (fieldExport) {
            config.fieldExport = checkAuthority(fieldExportAuthority);
          }

          // 运行新建
          if (tableInsert) {
            config.tableInsert = checkAuthority(insertAuthority);
          }

          // 允许编辑
          if (tableUpdate) {
            config.tableUpdate = checkAuthority(updateAuthority);
          }

          // 允许删除
          if (tableDelete) {
            config.tableDelete = checkAuthority(deleteAuthority);
          }

          // 表头拖拽调整列宽
          if (fieldResizableTitle) {
            config.fieldResizable = true;
          }
          // 展示首列序号
          if (tableIndexConfig) {
            config.tableIndexType = tableIndexConfig === 1 ? 'turnPageAgainIndex' : 'turnPageSeriesIndex';
          }
          config.tableSumPosition = tableSumPosition;
          setCustomTableConfig(config);

          // 表格属性配置
          if (data?.tableApiConfig) {
            setTableApiConfig(JSON.parse(data.tableApiConfig));
          }

          // js脚本
          if (data?.jsScript) {
            setJsScript(data?.jsScript);
          }

          // 主键
          if (data?.primaryKey) {
            setPrimaryKey(data?.primaryKey);
          }
          setConfigLoading(false);
        } catch (error: any) {
          setIsNotFound(true);
          throw new Error(error);
        }
      })();
    } else {
      setIsNotFound(true);
    }
  }, [id]);

  return {
    isNotFound,
    configLoading,
    customTableConfig,
    tableApiConfig,
    jsScript,
    primaryKey,
  };
}
