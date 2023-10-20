import { KeepAliveLayout } from '@cscs-fe/react-base-core';
import React, { useEffect, useState } from 'react';
import { FoldColumnsGrid } from '@cscs-fe/base-components';
import { Button, Card, Switch } from 'antd';
import SearchTree from './common/searchTree';
import { useModel } from 'umi';
import { AddOutlined, RefreshOutlined, SaveOutlined } from '@cscs-fe/icons';

<%_ if(data.rightType === 'ATable') { _%>
import ATable from './components/ATable';
<%_ } else if(data.rightType === 'ETable'){ _%>
import ETable from './components/ETable';
<%_ } else { _%>
import AllEtable from './components/AllEtable';
<%_ } _%>

import { <%= data.leftType %> } from './data';

function <%= data.name _%> () {
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config?.tabNavPosition;
  const [selectData, setSelectData] = useState<any>();

  useEffect(() => {
    if (Array.isArray(<%= data.leftType _%>) && <%= data.leftType _%>.length > 0) {
      setSelectData(<%= data.leftType _%>[0]);
    }
  }, [<%= data.leftType _%>]);

  const onSelect = (selectedKeys: React.Key[], { node }: any) => {
    setSelectData(node);
  };

  return (
    <FoldColumnsGrid
      LeftComponent={
        <Card
          title="双列布局"
          style={{
            marginBottom: '0px',
          }}
          bodyStyle={{
            padding: 0,
          }}
          bordered={false}
          extra={
            <>
              <Button title="刷新" icon={<RefreshOutlined />} className="mr-md" />
              <Button title="新建" icon={<AddOutlined />} />
            </>
          }
        >
          <SearchTree
            onSelect={onSelect}
            treeDatas={<%= data.leftType _%>}
            placeholder="请输入关键字检索"
            styleTree={{
              height: tabNavPosition === 'header' ? 'calc(100vh - 194px)' : 'calc(100vh - 240px)',
              overflowY: 'auto',
            }}
          />
        </Card>
      }
      RightComponent={
        <Card
          bodyStyle={{
            height: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 189px)',
            overflowY: 'auto',
            padding: '1px 0 0 0',
          }}
          title="双列布局"
          bordered={false}
          extra={
            <div className="flex-center-between">
              <div>
                <Switch className="mr-xs" checked={selectData?.switch} size="small" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>启用XXX</span>
              </div>
              <Button title="保存" icon={<SaveOutlined />} />
            </div>
          }
        >
          <%_ if(data.rightType === 'ATable'){ _%>
          {selectData?.key ? <ATable id={selectData.key} /> : null}
          <%_ } else if (data.rightType === 'ETable') { _%>
          {selectData?.key ? <ETable id={selectData.key} /> : null}
          <%_ } else { _%>
          {selectData?.key ? <AllEtable id={selectData.key} /> : null}
          <%_ } _%>
        </Card>
      }
    />
  );
}

export default () => {
  return (
    <KeepAliveLayout>
      <<%= data.name %> />
    </KeepAliveLayout>
  );
};
