/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-06-08 16:06:34
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-26 17:52:52
 * @FilePath: \amt-frontend\packages\base-components\src\advanced-table\service.ts
 * @Description:
 *
 */
import { StandardResponseDataType } from '../shared/types';
import request from 'umi-request';

/**
 * 新建
 * @param params 更新参数
 * @param backCode 接口
 * @returns Promise
 */
export function add(params: any, backCode: string) {
  return request(backCode, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 编辑
 * @param params 更新参数
 * @param backCode 接口
 * @returns Promise
 */
export function update(params: any, backCode: string) {
  return request(backCode, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 删除
 * @param id 删除数据的id
 * @param backCode 接口
 * @returns Promise
 */
export function del(id: string, backCode: string) {
  return request(`${backCode}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 导入
 * @param formData 参数
 * @param backCode 接口
 * @returns Promise
 */
export function importData(formData: FormData, backCode: string) {
  return request(`${backCode}/import`, {
    method: 'POST',
    data: formData,
  });
}

/**
 * 导出
 * @param backCode 接口
 * @param params 参数
 * @returns Promise
 */
export function exportData(backCode: string, params: any) {
  let exportParams = '';
  if (params && Object.keys(params).length > 0) {
    exportParams += '?';
    for (const key of Object.keys(params)) {
      exportParams += `${key}=${params[key]}&`;
    }
  }
  return request(`${backCode}/export${exportParams}`, {
    method: 'GET',
    responseType: 'blob',
    getResponse: true,
  });
}

/**
 * 根据key获取级联数据
 * @param type 级联类型
 * @returns 级联数据
 */
export function queryCascadeData(type: string, column: string) {
  return request(`/flow/basic/cascade?key=${column}&option=${type}`);
}

/**
 * 下载模板
 * @param fileName
 * @returns Promise
 */
export function downloadTemplate(fileName: string) {
  return request(`/file/download/template/${fileName}`, {
    responseType: 'blob',
    getResponse: true,
  });
}

/**
 * 后端处理跳转超链接url
 * @param url 跳转超链接的url
 * @returns
 */
export function getUrlLink(url: string) {
  return request<StandardResponseDataType<string>>('/config/system/dynamic/page/manage/convertVariable?_ignore_error', {
    method: 'POST',
    params: {
      source: url,
    },
  });
}
