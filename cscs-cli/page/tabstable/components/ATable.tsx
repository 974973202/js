import { Button, Card, Form, Input, message, Modal, Popconfirm, Typography } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ExpandOutlined } from '@cscs-fe/icons';
import { AdvancedTable, ActionType, ProColumns } from '@cscs-fe/base-components';
import { CreditRiskTableExport, to } from '@credit-risk/components';
import { useRequest } from 'ahooks';
import { getList, del, _post, add } from '../services';

const { Link } = Typography;

interface Props {
  id?: string;
}

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

function ATable(props: Props) {
  const { id } = props;
  const [form] = Form.useForm();

  const actionRef = useRef<ActionType | any>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<any>();

  const columns: ProColumns<any>[] = [
    { dataIndex: 'id', title: 'id' },
    { dataIndex: 'name', title: '名称' },
    { dataIndex: 'age', title: '年龄' },
    { dataIndex: 'gender', title: '性别' },
    { dataIndex: 'email', title: '邮箱' },
    { dataIndex: 'phone', title: '手机号', hideInSearch: true },
  ];

  const handleDel = async (id: number) => {
    const [, { success }] = await to(del(id));
    if (success) {
      message.success('删除成功');
      actionRef.current?.reloadAndRest();
    }
  };

  const handleSubmit = async (values: any, method: 'PUT' | 'POST') => {
    let result = [];
    if (method === 'PUT') {
      result = await to(_post({ ...values, id: editId }));
    } else {
      result = await to(add(values));
    }

    const [error, { success, errorMessage }] = result;
    if (error) return message.error(error.message);
    if (success) {
      message.success(errorMessage);
      actionRef.current?.reloadAndRest();
      setOpen(false);
    }
  };

  const exportDataList = async () => {
    message.info('exporting...');
    return new Promise((resolve) => {
      setTimeout(() => {
        message.info('export finish!');
        resolve(true);
      }, 3000);
    });
  };
  const exportMainBodyReq = useRequest(exportDataList, { manual: true });

  /**
   * @description: 表格行操作
   * @param {ReactNode} _
   * @param {any} record
   * @return {ReactNodeArray}
   */
  const actions = (_: ReactNode, record: any) => {
    return [
      <Link
        key="edit"
        onClick={() => {
          setEditId(record.id);
          form.setFieldsValue(record);
          setOpen(true);
        }}
      >
        编辑
      </Link>,
      <Popconfirm
        key="selectDel"
        title="确定要删除吗?"
        onConfirm={() => handleDel(record.id)}
        okText="确定"
        cancelText="取消"
      >
        <Link key="delete" type="danger">
          删除
        </Link>
      </Popconfirm>,
    ];
  };

  return (
    <>
      <AdvancedTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={getList}
        params={{
          id,
        }}
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
          <Button key="add" type="primary" onClick={() => setOpen(true)}>
            新建
          </Button>,
        ]}
      />
      <Modal
        open={open}
        title={editId ? '编辑' : '新建'}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        maskClosable={false}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          {...layout}
          onFinish={(formValues) => {
            handleSubmit(formValues, editId ? 'PUT' : 'POST');
          }}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[
              {
                required: true,
                message: '请输入名称',
              },
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[
              {
                required: true,
                message: '请输入年龄',
              },
            ]}
          >
            <Input placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item label="性别" name="gender">
            <Input disabled={!!editId} />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ATable;
