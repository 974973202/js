/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 16:11:58
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-group\group-table.tsx
 * @Description: 动态页面组合预览
 *
 */
import { BetaSchemaForm } from '@ant-design/pro-form';
import { customRenderFormItem, visitTree } from '@cscs-fe/base-components';
import { Card } from 'antd';
import cuid from 'cuid';
import { debounce, flatten, pickBy } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { history, useModel, useParams } from 'umi';

import { urlParamsTransform } from './components/common';
import { useGroupInitData } from './components/custom-hooks';
import DoubleStyle from './components/doubleStyle';
import SoloStyle from './components/soloStyle';
import TabStyle from './components/tabStyle';
import { childSoloType, ColumnType } from './types';

/**
 * @description: 处理自定义渲染查询条件
 * @param {any} conditionPublicOptions
 * @return {*}
 */
const h = (conditionPublicOptions: any[]) => {
  for (const ele of conditionPublicOptions) {
    ele.colProps = {
      xs: 24,
      sm: 12,
      md: 8,
    };
    customRenderFormItem(ele);
  }
  return conditionPublicOptions;
};

interface Props {
  id?: string;
  setTabName?: any;
}

/**
 * 组合布局
 * @param props { id?: string; setTabName?: any; }
 * @returns ReactNode
 */
const GroupTable: React.FC<Props> = (props) => {
  const { id } = useParams(); // 获取系统初始化数据
  const { initialState } = useModel('@@initialState'); // 获取名称的回调
  const { setTabName } = props; // url名称
  const { groupName, ...urlRest } = history?.location?.query || {};
  const pathname = history?.location?.pathname; // 获取预览的数据
  const { initialData } = useGroupInitData(id);

  const [conditionPublic, setConditionPublic] = useState<any>();

  /**
   * 设置tab标签名称
   */
  useEffect(() => {
    if (groupName) {
      if (!(window as any).__POWERED_BY_QIANKUN__) {
        setTabName(groupName);
      }
    } else {
      visitTree(initialState?.menus, ({ link, menuName }) => {
        if (link?.startsWith(pathname)) {
          setTabName(menuName);
        }
      });
    }
  }, [groupName]);

  // manageName 组合子页面
  const { groupStyle, column = [], manageName } = initialData || {};

  const tabsInfo: string[] = [];

  // Tab风格
  const childGroupOptions: Record<string, childSoloType[]> = {};
  // 单排布局
  const handleNewColumns: Array<ColumnType> = []; // 用于请求
  const childSoloOptions: Record<string, childSoloType[]> = {}; // 用于布局
  const conditionPublicOptions: any[] = []; // 公共查询条件
  const dataIndexUnique: string[] = []; // 用于公共查询条件去重

  let tabsnameArray = [];

  for (const ele of column) {
    if (!ele.isDisplay) {
      continue;
    }
    handleNewColumns.push(ele);
    tabsnameArray.push(ele.dynamicManageName);
    // 获取公共查询条件
    if (ele?.conditionPublic && Array.isArray(ele?.title) && ele?.title?.length) {
      const cp = ele?.conditionPublic?.split(',') || [];
      for (const data of ele?.title) {
        if (cp.includes(data.dataIndex) && !dataIndexUnique.includes(data.dataIndex)) {
          dataIndexUnique.push(data.dataIndex);
          conditionPublicOptions.push(data);
        }
      }
    }

    // 获取风格类型Tab分组
    if (!tabsInfo.includes(ele.groupType)) {
      tabsInfo.push(ele.groupType);
    }
    // tab布局 获取组合结构类型
    const newHandleData = {
      name: ele.groupType,
      data: [ele],
      tabsname: ele.dynamicManageName,
      style: ele.groupDisplayStyle,
      dynamicId: ele.dynamicId,
      conditionDisplay: ele.conditionDisplay,
      dynamicType: ele.dynamicType, // 页面类型
      dynamicTypeExt: ele.dynamicTypeExt, // 页面类型对应的值
      tabsnameArray,
    };
    if (!childGroupOptions[ele.groupType]) {
      childGroupOptions[ele.groupType] = [newHandleData];
    } else {
      childGroupOptions[ele.groupType].push(newHandleData);
    }
    // 单排布局
    // 通过分组名字判断 分组名字为空时保证唯一性
    const _groupName = ele.groupType ? ele.groupType : cuid();
    if (!childSoloOptions[_groupName]) {
      childSoloOptions[_groupName] = [newHandleData];
    } else {
      childSoloOptions[_groupName][0].data.push(ele);
      tabsnameArray = [];
    }
  }

  const dataOptions = flatten(Object.values(childSoloOptions));

  const BSForm = useMemo(() => {
    const columns = h(conditionPublicOptions);
    // 获取初始值  查询
    const initConditionPublic: any = {};
    for (const ele of columns) {
      if (ele.initialValue || urlRest[ele.dataIndex]) {
        const data = urlParamsTransform(urlRest, ele);
        initConditionPublic[ele.dataIndex] = data;
        ele.initialValue = data;
      }
    }
    setConditionPublic(pickBy(initConditionPublic, (value) => value !== ''));

    return (
      <Card title={null} bordered={false} bodyStyle={{ paddingBottom: 0 }}>
        <BetaSchemaForm
          layout="horizontal"
          layoutType="Form"
          shouldUpdate={false}
          grid={true}
          columns={columns} // 转换处理请求的公共查询条件
          submitter={false}
          onValuesChange={debounce((changedValues, values) => {
            const v = pickBy(values, (value) => value !== '');
            v.onSubmit = 1;
            setConditionPublic(v);
          }, 500)}
        />
      </Card>
    );
  }, [JSON.stringify(h(conditionPublicOptions))]);

  return (
    <>
      {conditionPublicOptions.length > 0 && BSForm}
      <div className="px-lg" style={{ paddingTop: 16 }}>
        {/* Tab风格 */}
        {groupStyle === 'tab' ? (
          <TabStyle
            childGroupOptions={childGroupOptions}
            tabsInfo={tabsInfo}
            conditionPublic={{ ...urlRest, ...conditionPublic }} // 支持传参在url 却不在搜索项的情形
            manageName={manageName?.split(',')}
          />
        ) : null}
        {/* 单排布局 */}
        {groupStyle === 'solo' ? (
          <SoloStyle childSoloOptions={dataOptions} conditionPublic={{ ...urlRest, ...conditionPublic }} />
        ) : null}
        {/* 双排布局 */}
        {groupStyle === 'double' ? (
          <DoubleStyle childDoubleOptions={dataOptions} conditionPublic={{ ...urlRest, ...conditionPublic }} />
        ) : null}
      </div>
    </>
  );
};

export default GroupTable;
