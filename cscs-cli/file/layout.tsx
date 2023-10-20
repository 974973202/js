import { Card } from 'antd';
import React from 'react';
import { useModel } from 'umi';

function <%= data.name %>() {
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config?.tabNavPosition;

  return (
    <div className="px-lg py-md">
      <Card
        bordered={false}
        title="layout模板"
        bodyStyle={{
          padding: '1px 0 0 0',
          // minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 132px)',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 265px)' : 'calc(100vh - 249px)',
        }}
      >
        layout模板
      </Card>
    </div>
  );
}

export default <%= data.name %>;