import { Button, Card, Popconfirm, Typography, message } from 'antd';
import React, { ReactNode, useRef, useState } from 'react';
import { useModel } from 'umi';
import { ExpandOutlined } from '@cscs-fe/icons';
import { AdvancedTable, ActionType, ProColumns } from '@cscs-fe/base-components';
import { KeepAliveLayout } from '@cscs-fe/react-base-core';
import { CreditRiskTableExport, to } from '@credit-risk/components';
import { useRequest } from 'ahooks';

const { Link } = Typography;

function <%= data.name _%> () {
  const actionRef = useRef<ActionType | any>();
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config.tabNavPosition;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<any>[] = [
    { dataIndex: 'test', title: 'test' },
    { dataIndex: '业务小类', title: '业务小类' },
    { dataIndex: '基准-LGD', title: '基准-LGD' },
    { dataIndex: '轻度-LGD', title: '轻度-LGD' },
    { dataIndex: '中度-LGD', title: '中度-LGD' },
    { dataIndex: '重度-LGD', title: '重度-LGD' },
  ];

  const handleDel = async (id: number) => {
    const [, { success }] = await to(del(id));
    if (success) {
      message.success('删除成功')
      actionRef.current?.reloadAndRest();
    }
  };

  const exportDataList = async () => {

  };

  /**
   * @description: 表格行操作
   * @param {ReactNode} _
   * @param {any} record
   * @return {ReactNodeArray}
   */
  const actions = (_: ReactNode, record: any) => {
    return [
      <Link key="edit" onClick={() => null}>
        编辑
      </Link>,
      <Link key="export" onClick={() => handleDel(record.id)}>
        删除
      </Link>,
    ];
  };

  const exportMainBodyReq = useRequest(exportDataList, { manual: true });

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
        <AdvancedTable
          actionRef={actionRef}
          columns={columns}
          // 序号翻页重置"turnPageAgainIndex"   序号连续自增"turnPageSeriesIndex"
          tableIndexType="turnPageAgainIndex"
          rowKey="id"
          dataSource={[
            {
              test: 'test',
            },
          ]}
          actionColumnWidth="96px"
          scroll={{ x: 'max-content' }}
          fixActionColumn={true}
          extraActions={actions}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
          toolBarRender={() => [
            <CreditRiskTableExport
              key="export"
              onClick={() => exportMainBodyReq.run()}
              loading={exportMainBodyReq.loading}
            />,
          ]}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
            return (
              <div>
                <Link key="select" style={{ marginRight: 16 }} onClick={onCleanSelected}>
                  取消选择
                </Link>

                <Popconfirm
                  key="selectDel"
                  title="确定要删除吗?"
                  onConfirm={async () => null}
                  okText="确定"
                  cancelText="取消"
                >
                  <Link type="danger" key="delete">
                    批量删除
                  </Link>
                </Popconfirm>
              </div>
            );
          }}
          toolLeftBarRender={[
            <Button key="add" type="primary">
              新建 <ExpandOutlined />
            </Button>,
          ]}
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