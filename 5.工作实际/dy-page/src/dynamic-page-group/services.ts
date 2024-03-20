/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-11-23 16:11:20
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 09:29:31
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-group\services.ts
 * @Description: 动态页面组合 api 接口
 *
 */
import request from 'umi-request';
import { StandardResponseDataType } from '@cscs-fe/components/es/shared';

/* 动态页面组合 */
/**
 * 查询列表接口
 * @param params
 * @returns
 */
export async function getDynamicGroup(params: any) {
  const { current, pageSize, ...rest } = params;
  const result = await request('/page/system/dynamic/page/group/list', {
    method: 'POST',
    params: {
      page: current - 1,
      size: pageSize,
    },
    data: {
      ...rest,
    },
  });
  return {
    success: true,
    data: result.data,
    total: result.page.totalCount,
  };
}

/**
 * 删除 & 批量删除
 * @param id id格式  1  或  1,2,3
 * @returns
 */
export function delDynamicGroup(id: number | string) {
  return request<StandardResponseDataType<any>>(`/page/system/dynamic/page/group/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 查看详情接口
 * @param id
 * @returns
 */
export function getDynamicGroupDetail(id: number) {
  return request(`/page/system/dynamic/page/group/detail/${id}`, {
    method: 'GET',
  });
}

/**
 * 新增POST & 修改PUT
 * @param params
 * @param method
 * @returns
 */
export function optionsDynamicGroup(params: any, method: string) {
  return request('/page/system/dynamic/page/group', {
    method: method,
    data: {
      ...params,
    },
  });
}

/**
 * @description: 动态组合菜单路由
 * @return {*}
 */
export function getDynamicGroupMenuUrl() {
  return request('/user/authority/menu/list/menuUrl', {
    method: 'POST',
  });
}
