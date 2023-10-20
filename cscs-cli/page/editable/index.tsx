import React, { useState } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Card } from 'antd';
import { KeepAliveLayout } from '@cscs-fe/react-base-core';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  板块?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: number;
  update_at?: number;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    板块: '线性插值比例',
    readonly: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
  {
    id: 624691229,
    板块: '板块',
    readonly: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
    update_at: 1590481162000,
  },
];

function <%= data.name _%>() {
   const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config.tabNavPosition;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '板块',
      dataIndex: '板块',
      readonly: true,
    },
    {
      title: '基准-最大跌幅',
      dataIndex: '基准-最大跌幅',
      readonly: true,
    },
    {
      title: '轻度-最大跌幅',
      dataIndex: '轻度-最大跌幅',
    },
    {
      title: '中度-最大跌幅',
      dataIndex: '中度-最大跌幅',
    },
    {
      title: '重度-最大跌幅',
      dataIndex: '重度-最大跌幅',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 80,
      render: (text, record, index, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];

  return (
    <div className="px-lg py-md">
      <Card
        bodyStyle={{
          padding: '1px 0 0 0',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 132px)',
        }}
        title="test"
        bordered={false}
      >
        <EditableProTable<DataSourceType>
          rowKey="id"
          maxLength={5}
          scroll={{
            x: 'max-content',
          }}
          cardProps={{
            bodyStyle: {
              padding: 0,
            },
          }}
          recordCreatorProps={{
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          }}
          loading={false}
          columns={columns}
          request={async () => ({
            data: defaultData,
            total: 3,
            success: true,
          })}
          value={dataSource}
          onChange={setDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
              await waitTime(2000);
            },
            actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
            onChange: setEditableRowKeys,
          }}
        />
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