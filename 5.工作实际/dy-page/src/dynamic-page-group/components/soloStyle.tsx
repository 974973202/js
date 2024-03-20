/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-03-21 15:30:51
 * @FilePath: \cscs-fe\packages\components\src\sys-config\dynamic-page-group\components\soloStyle.tsx
 * @Description: 动态页面组合预览 - 单列布局
 *
 */
import React from 'react';
import { Tabs, Card } from 'antd';
import { history } from 'umi';
import { childSoloType } from '../types';
import IframePage from './iframe-page';
import { getGroupActiveKey } from './common';
import EnhanceDyTable from '../../dynamic-page-manage/enhance-dy-table';

const { TabPane } = Tabs;

interface GroupTableProps {
  // 单列布局数据格式
  childSoloOptions: Array<childSoloType>;
  // 公共查询条件
  conditionPublic?: Record<string, any>;
}

/**
 * @description: 动态页面组合预览 - 单列布局
 * @param {*} props
 */
const SoloTable: React.FC<GroupTableProps> = (props) => {
  const { childSoloOptions = [], conditionPublic } = props;
  const params = history?.location?.query;
  /**
   * url 上传参选中tab的数组值
   */
  const activeKeyArray = params?.activeKey?.split(',') || null;

  return (
    <div>
      {childSoloOptions.map((ele) => {
        return ele.style === 'tabs' ? (
          <div style={{ paddingBottom: 16 }}>
            <Card
              bodyStyle={{
                padding: '1px 0 0 0',
              }}
              bordered={false}
            >
              <Tabs
                size="large"
                tabBarStyle={{ padding: '0 24px' }}
                key={ele.style}
                defaultActiveKey={getGroupActiveKey(ele.tabsnameArray, activeKeyArray) || ele.tabsname}
              >
                {ele?.data?.map((info) => (
                  <TabPane key={info.dynamicManageName} tab={info.dynamicManageName}>
                    {info.dynamicType !== 'dy' ? (
                      <IframePage address={info.dynamicTypeExt} conditionPublic={conditionPublic} />
                    ) : (
                      <EnhanceDyTable
                        id={info.dynamicId}
                        conditionDisplay={!!info?.conditionDisplay}
                        conditionPublic={conditionPublic}
                      />
                    )}
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </div>
        ) : (
          ele.data.map((info) => (
            <div style={{ paddingBottom: 16 }} key={info.dynamicId}>
              <Card
                bodyStyle={{
                  padding: '1px 0 0 0',
                }}
                title={info.dynamicManageName}
                key={info.dynamicId}
                bordered={false}
              >
                {info.dynamicType !== 'dy' ? (
                  <IframePage address={info.dynamicTypeExt} conditionPublic={conditionPublic} />
                ) : (
                  <EnhanceDyTable
                    id={info.dynamicId}
                    conditionDisplay={!!info?.conditionDisplay}
                    conditionPublic={conditionPublic}
                  />
                )}
              </Card>
            </div>
          ))
        );
      })}
    </div>
  );
};
export default SoloTable;
