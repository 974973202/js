/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-11-23 16:11:20
 * @LastEditors: xull xull@chinacscs.com
 * @LastEditTime: 2023-10-17 15:39:04
 * @FilePath: \frontend\packages\dynamic-page\src\dynamic-page-manage\services.ts
 * @Description: 动态页面管理 api 接口
 *
 */
import request from 'umi-request';
import cuid from 'cuid';
import { StandardResponseDataType } from '@cscs-fe/components/es/shared';
import {
  DyQueryDatabaseResponse,
  DyTableColumnsType,
  ListResponse,
  PreviewSaveRequestData,
  saveDataType,
  SqlParseResponse,
  TemplateListType,
} from './types';

/**
 * 获取字典表数据
 * @param dictType 字典类型
 */
export const queryDict = (dictType: string) => {
  return request<
    StandardResponseDataType<
      Array<{
        value: string;
        label: string;
        description: string | null;
      }>
    >
  >(`/system/dict/basic/list/type/${dictType}`);
};

/**
 * 获取数据源
 * @param params
 * @returns
 */
export async function dyQueryDatabase<T extends { current: number; pageSize: number }>(params: T) {
  return request<StandardResponseDataType<Array<DyQueryDatabaseResponse>>>(
    `/system/database/basic/list?page=${params.current - 1}&size=${params.pageSize}`,
    {
      method: 'POST',
      data: {
        ...params,
      },
    },
  );
}

/**
 * 新版排序处理
 * @param params 排序的参数
 * @param isTree 是否树形数据
 * @returns 返回排序后处理的值
 */
export function genSortQueryParams(params: Record<string, any>, isTree?: boolean) {
  const keys = params ? Object.keys(params) : [];
  return keys.length > 0 ? (isTree ? keys[0] : `${keys[0]} ${params[keys[0]]}`) : '';
}

/**
 * 动态页面管理查询列表
 * @param params
 * @returns
 */
export async function getDynamicManage(params: {
  pageSize?: number;
  current?: number;
  dynamicName?: string;
  dataResource?: string;
}) {
  const { current = 1, pageSize, ...rest } = params;
  const result = await request<StandardResponseDataType<Array<ListResponse>>>('/page/system/dynamic/page/manage/list', {
    method: 'POST',
    params: {
      page: 0,
      size: 1000,
    },
    data: {
      ...rest,
    },
  });
  return {
    success: true,
    data: result.data,
    total: result.page?.totalCount,
  };
}

/**
 * 删除 & 批量删除
 * @param id id格式  1  或  1,2,3
 * @returns
 */
export function delDynamicManage(id: string | number) {
  return request<
    StandardResponseDataType<{
      isDelete: boolean;
      comment?: string;
      noDelete?: Array<string | number>;
    }>
  >(`/page/system/dynamic/page/manage/delete/${id}`, {
    method: 'DELETE',
  });
}
export function batchDelDynamicManage(id: string | number) {
  return request<
    StandardResponseDataType<{
      isDelete: boolean;
      comment?: string;
      noDelete?: Array<string | number>;
    }>
  >(`/page/system/dynamic/page/manage/batchDelete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 动态页面管理导出
 * @param id 列表id
 * @returns
 */
// export function dynamicDownload(id: number) {
//   return request<Record<any, any>>(`/page/system/dynamic/page/manage/download/${id}`, {
//     method: 'GET',
//   });
// }

/**
 * 动态页面管理导出和批量导出
 * @param id 列表id
 * @param exportType 1:单个导出 2：批量导出 3：全部导出
 * @returns
 */
export function dynamicBatchDownload(ids: number[], exportType: number) {
  return request<{
    dynamicPageManageEntities: any[];
    isSingle: boolean;
  }>('/page/system/dynamic/page/manage/batchDownload', {
    method: 'POST',
    data: {
      ids,
      exportType,
    },
  });
}

/**
 * 动态页面管理批量导入保存接口
 * @param data
 */
export function dynamicBatchImportSave(data: any[]) {
  return request('/page/system/dynamic/page/manage/import', {
    method: 'POST',
    data,
  });
}

/**
 * 查看详情接口
 * @param id
 * @returns
 */
export function getDynamicManageDetail(id: number | string) {
  return request<StandardResponseDataType<ListResponse>>(`/page/system/dynamic/page/manage/detail/${id}`, {
    method: 'GET',
  });
}

/**
 * 预览查看详情接口
 * @param id
 * @returns
 */
export function getDynamicManageDetailPreview(id: number | string) {
  return request<StandardResponseDataType<ListResponse>>(`/page/system/dynamic/page/manage/preview/detail/${id}`, {
    method: 'GET',
  });
}

/**
 * 获取全部角色信息
 * @returns
 */
export function getUserRoleBasic() {
  return request<StandardResponseDataType<Array<{ label: string; value: string }>>>('/user/role/basic/drop/list/all', {
    method: 'GET',
  });
}

/**
 * SQL解析接口
 * @param params
 * @returns
 */
export function parseSqlDynamicManage(params: any) {
  return request<StandardResponseDataType<SqlParseResponse>>('/page/system/dynamic/page/manage/parseSql', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 新增POST & 修改PUT
 * @param params
 * @param method
 * @returns
 */
export function optionsDynamicManage(params: saveDataType, method: string) {
  return request<StandardResponseDataType<boolean>>('/page/system/dynamic/page/manage', {
    method: method,
    data: {
      ...params,
    },
  });
}

/**
 * 获取表头
 * @param id
 * @returns
 */
export function functionalForTitle(id: string | number, customFunctionalForTitle?: string) {
  return request<StandardResponseDataType<Array<DyTableColumnsType>>>(
    customFunctionalForTitle ? customFunctionalForTitle : `/page/system/dynamic/page/manage/functionalForTitle/${id}`,
    {
      method: 'GET',
    },
  );
}

/**
 * 预览获取表头
 * @param id
 * @returns
 */
export function functionalForTitlePreview(id: string | number) {
  return request<StandardResponseDataType<Array<DyTableColumnsType>>>(
    `/page/system/dynamic/page/manage/preview/functionalForTitle/${id}`,
    {
      method: 'GET',
    },
  );
}

/**
 * 获取数据
 * @param params
 * @returns
 */
export async function functionalForData(
  params: any,
  sortParams: any,
  setDyTableDataDid?: (data: 'padding' | 'fulfil' | 'lyingCorpses') => void,
) {
  const { private_id, current, activeKey, pageSize, ...rest } = params;
  // const _sortParams = genSortQueryParams(sortParams);
  const result = await request<StandardResponseDataType<Array<any>>>(
    `/page/system/dynamic/page/manage/functionalForData/${private_id}`,
    {
      method: 'POST',
      params: {
        page: current,
        size: pageSize,
        sort: sortParams,
      },
      data: {
        ...rest,
      },
    },
  );
  setDyTableDataDid?.('fulfil');

  // 判断返回数据是否有id
  // 通过取第一个数据判断，省去遍历
  // 若无id，造一个假的。若有，则不管。
  if (Array.isArray(result?.data) && result?.data.length && !result?.data?.[0]?.id) {
    for (const ele of result?.data) {
      ele.id = cuid();
    }
  }

  return {
    success: true,
    data: result?.data || [],
    total: result.page?.totalCount,
  };
}

/**
 * 预览获取数据
 * @param params
 * @returns
 */
export async function functionalForDataPreview(
  params: any,
  sortParams: any,
  setDyTableDataDid?: (data: 'padding' | 'fulfil' | 'lyingCorpses') => void,
) {
  const { private_id, current, activeKey, pageSize, ...rest } = params;
  // const _sortParams = genSortQueryParams(sortParams);
  const result = await request<StandardResponseDataType<Array<any>>>(
    `/page/system/dynamic/page/manage/preview/functionalForData/${private_id}`,

    {
      method: 'POST',
      params: {
        page: current,
        size: pageSize,
        sort: sortParams,
      },
      data: {
        ...rest,
      },
    },
  );
  setDyTableDataDid?.('fulfil');

  // 判断返回数据是否有id
  // 通过取第一个数据判断，省去遍历
  // 若无id，造一个假的。若有，则不管。
  if (Array.isArray(result?.data) && result?.data.length && !result?.data?.[0]?.id) {
    for (const ele of result?.data) {
      ele.id = cuid();
    }
  }

  return {
    success: true,
    data: result?.data || [],
    total: result.page?.totalCount,
  };
}

/**
 * @description: 树形异步数据请求接口
 * @param {number} id
 * @param {any} params
 * @param {any} sortParams
 * @return {*}
 */
export async function functionalForTreeData(
  id: number,
  params: any,
  sortParams?: any,
  customDealdataSource?: (data: any[]) => any[], // 用于出码，自定义data数据操作
  customFunctionalForDataUrl?: string,
) {
  // 树形异步。点展开去掉查询条件的 parent_id
  const { private_id, activeKey, current, pageSize, parent_id, ...rest } = params;
  // const _sortParams = genSortQueryParams(sortParams);
  const result = await request<StandardResponseDataType<Array<any>>>(
    customFunctionalForDataUrl
      ? customFunctionalForDataUrl
      : `/page/system/dynamic/page/manage/functionalForTreeData/${private_id}`,
    {
      method: 'POST',
      params: {
        page: 1,
        size: 1000,
        parent_id: id,
        sort: sortParams,
      },
      data: {
        ...rest,
      },
    },
  );
  if (Array.isArray(result?.data) && result?.data.length && !result?.data?.[0]?.id) {
    for (const ele of result?.data) {
      ele.id = cuid();
    }
  }
  return {
    success: true,
    data: customDealdataSource ? customDealdataSource(result.data) : result.data || [],
    total: result.page?.totalCount,
  };
}

/**
 * @description: 树形异步数据请求接口
 * @param {number} id
 * @param {any} params
 * @param {any} sortParams
 * @return {*}
 */
export async function functionalForTreeDataPreview(id: number, params: any, sortParams?: any) {
  // 树形异步。点展开去掉查询条件的 parent_id
  const { private_id, activeKey, current, pageSize, parent_id, ...rest } = params;
  // const _sortParams = genSortQueryParams(sortParams);
  const result = await request<StandardResponseDataType<Array<any>>>(
    `/page/system/dynamic/page/manage/preview/functionalForTreeData/${private_id}`,
    {
      method: 'POST',
      params: {
        page: 1,
        size: 1000,
        parent_id: id,
        sort: sortParams,
      },
      data: {
        ...rest,
      },
    },
  );
  if (Array.isArray(result?.data) && result?.data.length && !result?.data?.[0]?.id) {
    for (const ele of result?.data) {
      ele.id = cuid();
    }
  }
  return {
    success: true,
    data: result.data || [],
    total: result.page?.totalCount,
  };
}

export async function enhanceFunctionalForData(
  params: any,
  sortParams: any,
  setDyTableDataDid?: (data: 'padding' | 'fulfil' | 'lyingCorpses') => void,
  customDealdataSource?: (data: any[]) => any[], // 用于出码，自定义data数据操作
  customFunctionalForDataUrl?: string, // 自定义请求data接口
) {
  const { private_id, current, activeKey, pageSize, ...rest } = params;
  // const _sortParams = genSortQueryParams(sortParams);
  const result = await request<StandardResponseDataType<Array<any>>>(
    customFunctionalForDataUrl
      ? customFunctionalForDataUrl
      : `/page/system/dynamic/page/manage/functionalForData/${private_id}`,
    {
      method: 'POST',
      params: {
        page: current,
        size: pageSize,
        sort: sortParams,
      },
      data: {
        ...rest,
      },
    },
  );
  setDyTableDataDid?.('fulfil');
  if (Array.isArray(result?.data) && result?.data.length && !result?.data?.[0]?.id) {
    for (const ele of result?.data) {
      ele.id = cuid();
    }
  }
  return {
    success: true,
    data: customDealdataSource ? customDealdataSource(result.data) : result.data,
    total: result.page?.totalCount,
  };
}

/**
 * 数据预览
 * @param params
 * @returns
 */
export function dynamicManagePreview(params: any) {
  return request<
    StandardResponseDataType<{
      column: any[];
      data: any[];
      sum: any;
      sql: string;
    }>
  >('/page/system/dynamic/page/manage/preview', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 合计
 * @param params
 * @returns
 */
export function sumDynamicManage(params: any) {
  const { private_id, pageSize, activeKey, current, ...rest } = params;
  return request<StandardResponseDataType<Record<string, number | null>>>(
    `/page/system/dynamic/page/manage/sum/${private_id}`,
    {
      method: 'POST',
      data: {
        ...rest,
      },
    },
  );
}

/**
 * 合计
 * @param params
 * @returns
 */
export function sumDynamicManagePreview(params: any) {
  const { private_id, pageSize, activeKey, current, ...rest } = params;
  return request<StandardResponseDataType<Record<string, number | null>>>(
    `/page/system/dynamic/page/manage/preview/sum/${private_id}`,
    {
      method: 'POST',
      data: {
        ...rest,
      },
    },
  );
}

/**
 * 导出
 * @param id
 * @returns
 */
export function functionalForExport(id: any, params: any, exportSort?: any) {
  const { dynamicName, groupName, activeKey, current, pageSize, private_id, ...rest } = params || {};
  return request(`/page/system/dynamic/page/manage/download/data/${id}`, {
    method: 'POST',
    responseType: 'blob',
    getResponse: true,
    params: {
      sort: exportSort,
    },
    data: {
      ...rest,
    },
  });
}

/**
 * 预览导出
 * @param id
 * @returns
 */
export function functionalForExportPreview(id: any, params: any, exportSort?: any) {
  const { dynamicName, groupName, activeKey, current, pageSize, private_id, ...rest } = params || {};
  return request(`/page/system/dynamic/page/manage/preview/download/data/${id}`, {
    method: 'POST',
    responseType: 'blob',
    getResponse: true,
    params: {
      sort: exportSort,
    },
    data: {
      ...rest,
    },
  });
}

/**
 * 后端处理跳转超链接url
 * @param url 跳转超链接的url
 * @returns
 */
export function getUrlLink(url: string) {
  return request<StandardResponseDataType<string>>('/page/system/dynamic/page/manage/convertVariable', {
    method: 'POST',
    params: {
      source: url,
    },
  });
}

/**
 * 预览暂存
 */
export function dynamicManagePreviewSave(data: PreviewSaveRequestData) {
  return request<StandardResponseDataType<string>>('/page/system/dynamic/page/manage/temporaryStorage', {
    method: 'POST',
    data,
  });
}

/**
 * 预览查询SQL
 */
export function previewQuerySql(id: string, params: Record<string, any>) {
  return request(`/page/system/dynamic/page/manage/previewSql/${id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * @description: 获取“配置模板”下拉框数据
 * @return {*}
 */
export function getDynamicTemplateList() {
  return request<StandardResponseDataType<TemplateListType[]>>('/page/dynamic/template/allData');
}
