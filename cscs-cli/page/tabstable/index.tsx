import React, { useState } from 'react';
import { Card } from 'antd';
import { useModel } from 'umi';

import { KeepAliveLayout } from '@cscs-fe/react-base-core';
import ATable from './components/ATable';
import ETable from './components/ETable';
import AllEtable from './components/AllEtable';

enum TABLIST {
  ATABLE = 'ATable',
  ETABLE = 'ETable',
  ALLETABLE = 'AllEtable',
}

function <%= data.name _%>() {
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config?.tabNavPosition;
  const [activeKey, setActiveKey] = useState<string>('ATable'); // tab页签

  const StylesBlock = (key: TABLIST) => ({
    display: activeKey === key ? 'block' : 'none',
  });

  return (
    <div className="px-lg py-md">
      <Card
        bodyStyle={{
          padding: '1px 0 0 0',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 132px)',
        }}
        tabList={[
          {
            key: TABLIST.ATABLE,
            tab: '高级表格',
          },
          {
            key: TABLIST.ETABLE,
            tab: '可编辑表格',
          },
          {
            key: TABLIST.ALLETABLE,
            tab: '全可编辑表格',
          },
        ]}
        bordered={false}
        activeTabKey={activeKey}
        onTabChange={(key: string) => setActiveKey(key)}
      >
        <div style={StylesBlock(TABLIST.ATABLE)}>
          <ATable />
        </div>
        <div style={StylesBlock(TABLIST.ETABLE)}>
          <ETable />
        </div>
        <div style={StylesBlock(TABLIST.ALLETABLE)}>
          <AllEtable />
        </div>
      </Card>
    </div>
  );
}

export default () => {
  return (
    <KeepAliveLayout>
      <<%= data.name %> />
    </KeepAliveLayout>
  );
};
