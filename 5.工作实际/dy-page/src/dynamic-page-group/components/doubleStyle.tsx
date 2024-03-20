/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-17 18:33:20
 * @FilePath: \amt-frontend\packages\components\src\sys-config\dynamic-page-group\components\doubleStyle.tsx
 * @Description: 动态页面组合预览 - 双列布局
 *
 */
import React from 'react';
import { Tabs, Card, Row, Col } from 'antd';
import { history } from 'umi';
import { childSoloType } from '../types';
import IframePage from './iframe-page';
import { getGroupActiveKey } from './common';
import EnhanceDyTable from '../../dynamic-page-manage/enhance-dy-table';

const { TabPane } = Tabs;

interface GroupTableProps {
  // 双列布局数据格式
  childDoubleOptions: Array<childSoloType>;
  // 公共查询条件
  conditionPublic?: Record<string, any>;
}

/**
 * @description: 动态页面组合预览 - 双列布局
 * @param {*} props
 */
const DoubleStyle: React.FC<GroupTableProps> = (props) => {
  const params = history?.location?.query;
  /**
   * url 上传参选中tab的数组值
   */
  const activeKeyArray = params?.activeKey?.split(',') || null;
  const { childDoubleOptions, conditionPublic } = props;

  return (
    <Row gutter={24}>
      {childDoubleOptions.map((ele) => {
        return ele.style === 'tabs' ? (
          <Col style={{ paddingBottom: 16 }} span={12}>
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
                  <TabPane tab={info.dynamicManageName} key={info.dynamicManageName}>
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
          </Col>
        ) : (
          ele.data.map((info) => (
            <Col style={{ paddingBottom: 16 }} key={info.dynamicId} span={12}>
              <Card
                bodyStyle={{
                  padding: '1px 0 0 0',
                }}
                style={{
                  height: '100%',
                }}
                title={info.dynamicManageName}
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
            </Col>
          ))
        );
      })}
    </Row>
  );
};

export default DoubleStyle;
