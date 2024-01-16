import { StandardResponseDataType } from '@cscs-fe/components/es/shared';
import request from 'umi-request';
import { DataSourceResponseType } from './types';

export const queryMenuList = (params: any) => {
  return request('/user/authority/menu/list/menu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
};

// 字典获取
export function queryDictByType(type: string) {
  return request(`/system/dict/basic/list/type/${type}`);
}

// 查询关联查询
export function queryRelatedQueryConfig() {
  return request('/config/dynamic/sql/drop/select');
}

// 查询关联查询
export function queryRelatedQueryConfigByType(type = 'select') {
  return request(`/config/dynamic/sql/relation/${type}`);
}

// 查询动态查询配置
export function queryDynamicQueryConfig(params: { current: number; pageSize: number }) {
  return request('/config/dynamic/sql/list', {
    method: 'POST',
    params: {
      page: params.current - 1,
      size: params.pageSize,
    },
    data: {},
  });
}

export function createDynamicConfig(params: { dynamicName: string }) {
  return request('/config/dynamic/sql', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export function updateDynamicConfigName(id: string, name: string) {
  return request('/config/dynamic/sql/update/name', {
    method: 'PUT',
    data: {
      id,
      dynamicName: name,
    },
  });
}

export function delDynamicConfig(id: number) {
  return request(`/config/dynamic/sql/${id}`, {
    method: 'DELETE',
  });
}

export function queryDynamicTables(params: any) {
  const { current, pageSize, ...rest } = params;
  return request('/config/dynamic/table/list', {
    method: 'POST',
    params: {
      page: current - 1,
      size: pageSize,
    },
    data: {
      ...rest,
    },
  });
}

export function queryDynamicMenuList(used = true) {
  const menuUrl = '/dynamic_table';
  return request('/user/authority/menu/drop/self/', {
    params: {
      menuUrl,
      used,
    },
  });
}

export function deleteDynamicPageConfig(id: number) {
  return request(`/config/dynamic/table/${id}`, {
    method: 'DELETE',
  });
}

// 表格页面配置列表
export function queryPageConfigList(params: any) {
  const { current, pageSize, ...rest } = params;
  return request('/config/page/show/list', {
    method: 'POST',
    params: {
      page: current - 1,
      size: pageSize,
    },
    data: {
      ...rest,
    },
  });
}

// 表格页面操作配置列表
export function queryPageFormConfigList(params: any) {
  const { current, pageSize, ...rest } = params;
  return request('/config/page/operation/list', {
    method: 'POST',
    params: {
      page: current - 1,
      size: pageSize,
    },
    data: {
      ...rest,
    },
  });
}

export async function queryDataRuleList(authorityDataTyped: string) {
  return request<{
    data: {
      frontColumnTypeName: string;
      frontColumnTyped: 'tree' | 'list' | 'text' | 'checkbox' | 'select_tree' | null;
      columnDisplayName: string;
      id: number;
      data: any;
      isSwitch: boolean;
    }[];
  }>(`/config/authority/data/list/${authorityDataTyped}`);
}

export async function addAuthorityData(params: any) {
  return request('/config/authority/data', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateAuthorityData(params: any) {
  return request('/config/authority/data', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function deleteAuthorityData(id: number) {
  return request(`/config/authority/data/${id}`, {
    method: 'DELETE',
  });
}

export async function queryAuthorityData(params: any) {
  const msg = await request(`/config/authority/data/list?page=${params.current - 1}&size=${params.pageSize}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });

  return {
    ...msg,
    total: msg.page.totalCount,
  };
}

export async function searchAuthorityData(keyword: string) {
  return request(`/config/authority/data/search/${keyword}`, {
    method: 'GET',
  });
}

export async function getAuthorityDataDetail(id: number) {
  return request(`/config/authority/data/detail/${id}`, {
    method: 'GET',
  });
}

export async function getDynamicDictList(way: string) {
  return request('/config/dynamic/dict/list?page=0&pageSize=100', {
    method: 'POST',
    data: {
      dynamicWay: way,
    },
  });
}

/**
 * 解析SQL输入列
 */

export async function parseInputColumns(dataResource: string, sql: string) {
  return request('/config/dynamic/sql/parse', {
    method: 'POST',
    data: {
      dataResource,
      dynamicContent: sql,
    },
  });
}

/**
 * 获取输出列
 */
export async function parseOutputColumns(dataResource: string, sql: string, params: Record<string, any>) {
  return request('/config/dynamic/sql/execute', {
    method: 'POST',
    data: {
      dataResource,
      dynamicContent: sql,
      params,
      dynamicWay: 'dynamic_sql',
    },
  });
}

/**
 * @description: 获取数据源
 * @return {*}
 */
export async function queryDataSource() {
  return request<StandardResponseDataType<DataSourceResponseType>>('/page/system/dynamic/page/manage/allDatasource');
}

/**
 * @description: 动态新增数据
 * @param {number} id
 * @param {any} data
 */
export async function insertDataToTable(id: number, data: any) {
  return request<StandardResponseDataType<any>>(`/page/system/dynamic/page/manage/insert/${id}`, {
    method: 'POST',
    data,
  });
}

/**
 * @description: 动态修改数据
 * @param {number} id
 * @param {any} data
 */
export async function updateDataToTable(id: number, data: any) {
  return request<StandardResponseDataType<any>>(`/page/system/dynamic/page/manage/update/${id}`, {
    method: 'POST',
    data,
  });
}

/**
 * @description: 动态删除数据
 * @param {number} id
 * @param {any} data
 */
export async function deleteDataFromTable(id: number, data: any) {
  return request<StandardResponseDataType<any>>(`/page/system/dynamic/page/manage/delete/${id}`, {
    method: 'POST',
    data,
  });
}
