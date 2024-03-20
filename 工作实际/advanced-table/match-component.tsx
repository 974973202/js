/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-17 10:37:37
 * @FilePath: \amt-frontend\packages\base-components\src\advanced-table\match-component.tsx
 * @Description: 动态页面表格跳转组件部分
 *
 */
import React from 'react';
import Result from '../result';

/**
 * @description: 查找是否存在对应组件
 * @param {string} name
 * @return {object}
 */
function checkComponent(name: string, Collect: { name: string; element: React.FC; width?: number }[]) {
  return Collect.find((ele) => ele.name.toLocaleUpperCase() === name.toLocaleUpperCase());
}

/**
 * @description: 获取组件
 * @param {string} name
 * @return {ReactNode}
 */
export function MatchComponent(
  name: string,
  Collect: { name: string; element: React.FC; width?: number }[] = [],
  record: Record<string, any>,
): React.ReactNode {
  const Target = checkComponent(name, Collect);
  const Component: React.FC<any> | undefined = Target?.element;
  return Component ? <Component _record={record} /> : <Result status={404} />;
}

/**
 * @description: 获取组件宽度
 * @param {string} name
 * @return {string | number}
 */
export function MatchComponentWidth(name: string, Collect: { name: string; element: React.FC; width?: number }[] = []) {
  const Target = checkComponent(name, Collect);
  return Target?.width || '80%';
}
