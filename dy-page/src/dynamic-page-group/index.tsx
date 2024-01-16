/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 16:16:12
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-group\index.tsx
 * @Description: 动态页面组合
 *
 */
import { Button, Card, message, Popconfirm, Typography, Modal } from 'antd';
import React, { useRef, useState, ReactNode } from 'react';
import { Access, useAccess, useModel } from 'umi';

import { copy, AdvancedTable, ActionType, useGlobalState } from '@cscs-fe/base-components';
import GroupModal from './components/groupModal';
import { DynamicPageAccessType } from '../access';

import {
  getDynamicGroup, // 查询列表
  delDynamicGroup, // 删除
} from './services';
import { groupTableType } from './types';

const { Link } = Typography;

interface DynamicPageProps {
  pageCode: string;
}

/**
 * @description: 动态页面组合
 * @param {DynamicPageProps} props
 * @return {ReactNode}
 */
function DynamicPageGroup(props: DynamicPageProps) {
  const { pageCode } = props;
  // 选中的列表id
  const [selectSqlId, setSelectSqlId] = useState<React.Key[]>([]);
  // 编辑页面获取数据的id
  const [sqlId, setSqlId] = useState<number | null>(null);
  // 更新menu菜单函数
  const { updateGlobalState } = useGlobalState();
  // 权限函数
  const access: DynamicPageAccessType = useAccess();
  // 菜单路由复制弹框
  const [configModal, setConfigModal] = useState<boolean>(false);
  // 菜单路由复制数据
  const [configData, setConfigData] = useState<string>('');
  // 编辑页面 弹框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState'); // 全局数据

  const tabNavPosition = initialState.config.tabNavPosition;

  /**
   * @description: 弹框确认的回调
   */
  const handleOk = () => {
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  /**
   * @description: 新建弹框
   * @return {*}
   */
  const handleCreate = () => {
    setSqlId(null);
    setModalVisible(true);
  };

  /**
   * @description: 编辑弹框
   * @param {groupTableType} record
   * @return {*}
   */
  const handleEdit = (record: groupTableType) => {
    setSqlId(record.id);
    setModalVisible(true);
  };

  /**
   * @description: 菜单路由弹框
   * @param {groupTableType} record
   * @return {*}
   */
  const handleModal = (record: groupTableType) => {
    setConfigData(`/config/dynamic_group/index/${record.id}`);
    setConfigModal(true);
  };

  /**
   * @description: 删除表格行数据
   * @param {number} id
   * @return {*}
   */
  const handleDel = (id: number | string) => {
    delDynamicGroup(id)
      .then((res) => {
        if (res.success) {
          message.success('删除成功');
          actionRef?.current?.reload();
          setSelectSqlId([]);
          updateGlobalState({
            menuUpdated: true,
          });
          return true;
        }
        return false;
      })
      .catch((error) => console.error(error));
  };

  /**
   * @description: 操作栏
   * @return {*}
   */
  const toolBars = [
    <Access key="create" accessible={access.canAddDynamicGroup}>
      <Button onClick={handleCreate} type="primary">
        新建
      </Button>
    </Access>,
  ];

  /**
   * @description: 表格行操作栏
   * @return {*}
   */
  const actions = (_: ReactNode, record: groupTableType) => {
    return [
      <Typography.Link
        key="func"
        onClick={() => {
          (window as any).csRouter(`/config/dynamic_group/detail/${record.id}?groupName=${record.groupName}`);
        }}
      >
        预览
      </Typography.Link>,
      <Typography.Link key="address" onClick={() => handleModal(record)}>
        菜单路由
      </Typography.Link>,
      <Typography.Link key="edit" onClick={() => handleEdit(record)}>
        编辑
      </Typography.Link>,
      <Popconfirm
        key="del"
        placement="top"
        title="确定要删除吗?"
        onConfirm={() => {
          handleDel(record.id);
        }}
        okText="确定"
        cancelText="取消"
      >
        <Typography.Link type="danger" key="delete">
          删除
        </Typography.Link>
      </Popconfirm>,
    ];
  };

  return (
    <div className="px-lg py-md">
      <Card
        bodyStyle={{
          padding: '1px 0 0 0',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 178px)',
        }}
        title="动态页面组合"
        bordered={false}
      >
        {modalVisible && <GroupModal onCancel={() => setModalVisible(false)} onOk={handleOk} id={sqlId} />}
        <AdvancedTable
          actionRef={actionRef}
          pageCode={pageCode}
          rowKey="id"
          request={async (params) => getDynamicGroup(params)}
          actionColumnWidth="214px"
          scroll={{ x: 'max-content' }}
          fixActionColumn={true}
          extraActions={actions}
          rowSelection={{
            selectedRowKeys: selectSqlId,
            preserveSelectedRowKeys: false,
            onChange: (selectedRowKeys) => {
              if (selectedRowKeys) {
                setSelectSqlId(selectedRowKeys);
              }
            },
          }}
          toolLeftBarRender={toolBars}
          tableAlertOptionRender={({ selectedRows, onCleanSelected }) => {
            return (
              <div>
                <Link key="select" style={{ marginRight: 16 }} onClick={onCleanSelected}>
                  取消选择
                </Link>

                <Popconfirm
                  key="selectDel"
                  title="确定要删除吗?"
                  onConfirm={async () => {
                    const ids = selectedRows?.map((row) => row.id) || [];
                    handleDel(ids.toString());
                  }}
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
        />
        <Modal
          destroyOnClose
          maskClosable={false}
          title="菜单路由"
          visible={configModal}
          onCancel={() => setConfigModal(false)}
          onOk={() => {
            copy(configData);
            message.success('复制成功');
            setConfigModal(false);
          }}
          cancelText="关闭"
          okText="复制"
        >
          {configData}
        </Modal>
      </Card>
    </div>
  );
}

export default DynamicPageGroup;
