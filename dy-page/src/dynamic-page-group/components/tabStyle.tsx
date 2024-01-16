/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-03-21 15:27:59
 * @FilePath: \cscs-fe\packages\components\src\sys-config\dynamic-page-group\components\tabStyle.tsx
 * @Description: 动态页面组合预览 - tab布局
 *
 */
import React, { useEffect, useState } from 'react';
import { Tabs, Card } from 'antd';
import { history } from 'umi';
import IframePage from './iframe-page';
import { getGroupActiveKey } from './common';
import EnhanceDyTable from '../../dynamic-page-manage/enhance-dy-table';

const { TabPane } = Tabs;

interface GroupTableProps {
  // tab数据信息
  tabsInfo: string[];
  // tab数据信息数据格式
  childGroupOptions: Record<string, any>;
  // 公共查询条件
  conditionPublic?: Record<string, any>;
  /**
   * 子页面的tab名集合
   */
  manageName?: string[];
}

const GroupTable: React.FC<GroupTableProps> = (props) => {
  const { tabsInfo, childGroupOptions, conditionPublic, manageName } = props;
  const params = history?.location?.query;
  /**
   * url 上传参选中tab的数组值
   */
  const activeKeyArray = params?.activeKey?.split(',') || null;
  /**
   * 匹配选中的tab值
   */
  const AK = activeKeyArray ? getGroupActiveKey(tabsInfo, activeKeyArray) : null;
  const [activeKey, setActiveKey] = useState(AK || tabsInfo?.[0] || '');
  const [column, setCurColumn] = useState<any[]>([]); // 组合的数据
  const [activeChildKey, setActiveChildKey] = useState('');

  useEffect(() => {
    if (childGroupOptions[activeKey]) {
      // 获取columns
      setCurColumn(childGroupOptions[activeKey]);
      const key = getGroupActiveKey(manageName, activeKeyArray);
      setActiveChildKey(key || childGroupOptions[activeKey]?.tabsname);
    }
  }, [activeKey]);

  /**
   * @description: tab切换
   * @param {React} key
   */
  const handleActiveKey = (key: React.SetStateAction<string>) => {
    setActiveKey(key);
  };

  return (
    <>
      <Tabs
        size="large"
        tabBarStyle={{ padding: '0 24px', backgroundColor: '#fff' }}
        activeKey={activeKey}
        onChange={handleActiveKey}
      >
        {tabsInfo?.map((ele) => (
          <TabPane tab={ele} key={ele} />
        ))}
      </Tabs>
      <div style={{ paddingBottom: 16 }}>
        {column[0]?.style === 'tabs' ? (
          <Card
            bodyStyle={{
              padding: '1px 0 0 0',
            }}
            bordered={false}
          >
            <Tabs
              size="large"
              tabBarStyle={{ padding: '0 24px' }}
              activeKey={activeChildKey}
              onChange={setActiveChildKey}
            >
              {column?.map((info) => (
                <TabPane tab={info.tabsname} key={info.tabsname}>
                  {info.dynamicType !== 'dy' ? (
                    <IframePage address={info.dynamicTypeExt} conditionPublic={conditionPublic} />
                  ) : (
                    <EnhanceDyTable
                      id={info.dynamicId}
                      conditionDisplay={info.conditionDisplay}
                      conditionPublic={conditionPublic}
                    />
                  )}
                </TabPane>
              ))}
            </Tabs>
          </Card>
        ) : (
          <div>
            {column?.map((info) => (
              <div style={{ paddingBottom: 16 }} key={info.dynamicId}>
                <Card
                  bodyStyle={{
                    padding: '1px 0 0 0',
                  }}
                  title={info.tabsname}
                  bordered={false}
                >
                  {info.dynamicType !== 'dy' ? (
                    <IframePage address={info.dynamicTypeExt} conditionPublic={conditionPublic} />
                  ) : (
                    <EnhanceDyTable
                      id={info.dynamicId}
                      conditionDisplay={info.conditionDisplay}
                      conditionPublic={conditionPublic}
                    />
                  )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GroupTable;
