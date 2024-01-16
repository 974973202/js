/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-08-10 18:31:22
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\index.tsx
 * @Description: 动态页面管理
 *
 */
import {
  Button,
  Card,
  message,
  Popconfirm,
  Typography,
  Modal,
  Upload,
  Menu,
  Dropdown,
  Input,
  Drawer,
  Tag,
  Select,
} from 'antd';
import type { UploadProps } from 'antd';
import React, { ReactNode, useRef, useState } from 'react';
import { orderBy, omit, cloneDeep } from 'lodash-es';
import { Access, useAccess, useModel } from 'umi';
import cuid from 'cuid';
import moment from 'moment';
import { ExpandOutlined } from '@cscs-fe/icons';
import { copy, downloadBlob, AdvancedTable, ActionType, useGlobalState } from '@cscs-fe/base-components';
import { ControlledEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { ExpandableConfig } from 'antd/es/table/interface';
import { useRequest } from 'ahooks';

import { getRequestAPIPrefix } from '@cscs-fe/components';
import DyManageModal from './components/dy-manage-modal';
import { codeTemplate } from './components/code-template';
import { DynamicPageAccessType } from '../access';
import { getToken } from '../utils';
import styles from './index.less';

import {
  /** 查询列表 */ getDynamicManage,
  /** 删除 */ delDynamicManage,
  /** 批量删除 */ batchDelDynamicManage,
  /** 导出 */ dynamicBatchDownload,
  /** 批量导入保存接口 */ dynamicBatchImportSave,
  /** 获取数据源 */ dyQueryDatabase,
} from './services';
import { ListResponse, ParseUploadFileResponse, SqlFields } from './types';
import { StandardResponseDataType } from '@cscs-fe/components/es/shared';

const { Link } = Typography;
const { TextArea } = Input;
const isChrome = window.navigator.userAgent.includes('Chrome');

enum DeleteType {
  SINGLE = 'single',
  SELECTDEL = 'selectDel',
}

interface DynamicPageProps<RecordType> {
  pageCode: string;
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<RecordType> & {
      ExpandableComponent: React.FC;
    };
  }>;
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
}

/**
 * @description: 导出配置
 * @param {number} ids
 * @param {string} name
 * @return {*}
 */
async function handleExport(ids: number[], name: string, exportType: number) {
  try {
    const data = await dynamicBatchDownload(ids, exportType);
    if (typeof data === 'object') {
      const dataString = JSON.stringify(data);
      const blob = new Blob([dataString], { type: 'text/json' });
      downloadBlob(`${name}${moment(Date.now()).format('YYYYMMDDHHmmss')}.json`, blob);
    }
  } catch (error) {
    throw new Error(error as string);
  }
}

function DynamicPageManage<RecordType extends Record<string, unknown>>(props: DynamicPageProps<RecordType>) {
  const { pageCode, expandableConfig, expandStrategy } = props;
  const tokenData = getToken();
  const token = `${tokenData.token_type} ${tokenData.token}`;
  const { updateGlobalState } = useGlobalState();
  const access: DynamicPageAccessType = useAccess();
  const actionRef = useRef<ActionType | any>();

  const [selectId, setSelectId] = useState<React.Key[] | undefined>([]); // 选中的列表id
  const [editId, setEditId] = useState<number | null>(null); // 编辑 id 用于数据修改

  const [dyManageVisible, setDyManageVisible] = useState<boolean>(false); // 动态页面弹框 visible
  const [importData, setImportData] = useState<ListResponse | null>(null); // 导入配置的数据

  const [routerModalVisible, setRouterModalVisible] = useState<boolean>(false); // 路由配置弹框 visible
  const [routerUrl, setRouterUrl] = useState<string>(''); // 路由配置弹框地址

  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false); // 出码 visible
  const [code, setCode] = useState<string>(''); // 模板代码
  const { initialState } = useModel('@@initialState'); // 全局数据

  const [importDrawerOpen, setImportDrawerOpen] = useState<boolean>(false); // 批量导入数据的抽屉 visible
  const [importStatus, setImportStatus] = useState<'编辑' | '预览' | ''>('');
  const [importSelectedKeys, setImportSelectedKeys] = useState<React.Key[] | undefined>([]); // 批量导入数据选中的key
  const [importDrawerData, setImportDrawerData] = useState<
    Array<{
      id: string;
      /** 导入的数据 */ import: any;
      /** 已存在的数据id */ exist: {
        id: number | null;
        name?: string;
      };
      // /** 数据源 */ dataResource: string | null;
      /** 处理方式 */ handl: string;
    }>
  >([]); // 批量导入数据

  const tabNavPosition = initialState?.config?.tabNavPosition;

  // 获取数据源
  const { data: dataSourceList } = useRequest(
    () =>
      dyQueryDatabase<{ current: number; pageSize: number }>({
        current: 1,
        pageSize: 100,
      }),
    {
      formatResult: (response) => response?.data,
    },
  );

  /**
   * @description: 编辑/新建 弹框确认的回调
   */
  const handleOk = () => {
    setDyManageVisible(false);
    actionRef?.current?.reloadAndRest();
  };

  /**
   * @description: 新建弹框触发函数
   */
  // const handleModalOpen = () => {
  //   setEditId(null);
  //   setDyManageVisible(true);
  // };

  /**
   * @description: 新建 / 编辑弹框触发函数
   * @param {ListResponse} record
   */
  const handleModalOpen = (record?: ListResponse) => {
    setEditId(record ? record?.id : null);
    setDyManageVisible(true);
  };

  /**
   * @description: 关闭弹框触发函数
   */
  const handleCancel = () => {
    // 清空 editId 预防缓存问题
    setEditId(null);
    // 弹框关闭
    setDyManageVisible(false);
    // 清空 importData 预防缓存问题
    setImportData(null);
    setImportStatus('');
  };

  /**
   * @description: 动态页面删除列表
   * @param {number} id
   * @param {string} flag 判断是单个删除还是多个删除
   */
  const handleDel = async (id: number | string, flag: string) => {
    try {
      const { data } = await (flag === DeleteType.SINGLE ? delDynamicManage(id) : batchDelDynamicManage(id));
      if (data.isDelete) {
        message.success('删除成功');
        setSelectId([]);
      } else {
        message.error(data?.comment);
        if (data?.noDelete?.length) {
          setSelectId(data?.noDelete);
        }
      }
      actionRef?.current?.reloadAndRest();
      updateGlobalState({
        menuUpdated: true,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  };

  /**
   * @description: 动态页面出码
   * @param {ListResponse} record
   */
  const handleCode = (record: ListResponse) => {
    setCode(codeTemplate(record.id, record.dynamicName));
    setCodeModalVisible(true);
  };

  /**
   * @description: 动态页面菜单路由
   * @param {ListResponse} record
   */
  const handleModal = (record: ListResponse) => {
    let address = `/config/dynamic_page/index/${record.id}`;
    if (record.dynamicUrl) {
      address = address + record.dynamicUrl;
    }
    setRouterUrl(address);
    setRouterModalVisible(true);
  };

  /**
   * @description: 动态页面导入配置的配置参数
   */
  const uploadProps: UploadProps<StandardResponseDataType<ParseUploadFileResponse>> = {
    name: 'file',
    action: getRequestAPIPrefix() + '/page/system/dynamic/page/manage/parseUploadFile',
    showUploadList: false,
    headers: {
      Authorization: token,
    },
    maxCount: 1,
    accept: '.json',
    onChange(info) {
      if (info.file.status === 'done') {
        const { response } = info.file;
        if (response?.success) {
          message.success('导入配置成功');
          // 判断是单个导入还是多个
          if (response.data.sign === 0) {
            const data = omit(response.data?.importData?.[0] || [], ['id']);
            data.columnField = data?.columnField?.map((i: SqlFields) => omit(i, ['dynamicId']));
            for (const ele of data?.columnField || []) {
              ele.id = cuid();
            }
            for (const ele of data?.columnParam || []) {
              ele.id = cuid();
            }
            setImportData(data as ListResponse);
            setDyManageVisible(true);
          } else {
            console.log(response.data, 'response.data');
            const importData = [];
            for (const [key, value] of Object.entries(response?.data?.importData || []) as any) {
              const hasExistDataId = response?.data?.hasExistData?.[key];
              importData.push({
                id: cuid(),
                import: value,
                exist: {
                  id: hasExistDataId,
                  name: hasExistDataId ? value?.dynamicName : null,
                },
                // dataResource: value?.dataResource,
                handl: hasExistDataId ? '覆盖' : '新增',
              });
            }
            setImportDrawerData(importData);
            setImportSelectedKeys([]);
            setImportDrawerOpen(true);
          }
        } else {
          message.error(response?.errorMessage);
        }
      } else if (info.file.status === 'error') {
        message.error('导入配置失败');
      }
    },
  };

  /**
   * @description: 表格行操作
   * @param {ReactNode} _
   * @param {any} record
   * @return {ReactNodeArray}
   */
  const actions = (_: ReactNode, record: any) => {
    return [
      <Link
        key="func"
        onClick={() => {
          (window as any).csRouter(`/config/dynamic_page/detail/${record.id}?dynamicName=${record.dynamicName}`);
        }}
      >
        预览
      </Link>,
      <Link key="edit" onClick={() => handleModalOpen(record)}>
        编辑
      </Link>,
      <Link key="export" onClick={() => handleExport([record.id], record.dynamicName, 1)}>
        导出配置
      </Link>,
      <Dropdown
        key="all"
        overlay={
          <Menu className={styles.tableOptions}>
            <Button type="link" onClick={() => handleCode(record)} style={{ textAlign: 'left' }}>
              出码
            </Button>
            <Button type="link" onClick={() => handleModal(record)}>
              菜单路由
            </Button>
            <Popconfirm
              key="del"
              placement="top"
              title="确定要删除吗?"
              onConfirm={() => {
                handleDel(record.id, DeleteType.SINGLE);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ textAlign: 'left' }} danger type="text">
                删除
              </Button>
            </Popconfirm>
          </Menu>
        }
      >
        <Link>
          更多 <ExpandOutlined />
        </Link>
      </Dropdown>,
    ];
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleModalOpen()}>
        新建
      </Menu.Item>
      <Menu.Item key="2">
        <Upload key="import" {...uploadProps}>
          <span className={styles.exportBtn}>导入配置</span>
        </Upload>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="px-lg py-md">
      <Card
        bodyStyle={{
          padding: '1px 0 0 0',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 178px)',
        }}
        title="动态页面管理"
        bordered={false}
      >
        {dyManageVisible && (
          <DyManageModal
            onCancel={handleCancel}
            onOk={handleOk}
            id={editId}
            importData={importData}
            expandableConfig={expandableConfig}
            expandStrategy={expandStrategy}
            dataSourceList={dataSourceList}
            importStatus={importStatus}
            setImportDrawerData={(data) => {
              for (const item of importDrawerData) {
                if (item?.import?.id === data?.id) {
                  item.import = data;
                  item.import.name = data?.dynamicName;
                }
              }
              setImportDrawerData(importDrawerData);
              handleCancel();
            }}
          />
        )}
        <AdvancedTable
          actionRef={actionRef}
          pageCode={pageCode}
          rowKey="id"
          request={getDynamicManage}
          actionColumnWidth={access.canAddDynamicSql ? '235px' : undefined}
          scroll={{ x: 'max-content' }}
          fixActionColumn={true}
          extraActions={access.canAddDynamicSql ? actions : undefined}
          rowSelection={{
            selectedRowKeys: selectId,
            preserveSelectedRowKeys: false,
            onChange: (selectedRowKeys) => {
              if (selectedRowKeys) {
                // 勾选的key
                setSelectId(selectedRowKeys);
              }
            },
          }}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
            return (
              <div>
                <Link key="select" style={{ marginRight: 16 }} onClick={onCleanSelected}>
                  取消选择
                </Link>
                <Access key="options" accessible={access.canAddDynamicSql}>
                  <Link
                    key="select"
                    style={{ marginRight: 16 }}
                    onClick={() => {
                      handleExport(selectedRowKeys as number[], '动态页面导出配置文件', 2);
                    }}
                  >
                    导出配置
                  </Link>

                  <Popconfirm
                    key="selectDel"
                    title="确定要删除吗?"
                    onConfirm={async () => {
                      // 接口参数需要 排序
                      const sortIds = orderBy(selectedRowKeys, [], ['desc']);
                      // 执行删除方法
                      handleDel(sortIds?.toString(), DeleteType.SELECTDEL);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Link type="danger" key="delete">
                      批量删除
                    </Link>
                  </Popconfirm>
                </Access>
              </div>
            );
          }}
          toolLeftBarRender={[
            <Access key="create" accessible={access.canAddDynamicSql}>
              <Dropdown overlay={menu}>
                <Button type="primary">
                  新建 <ExpandOutlined />
                </Button>
              </Dropdown>
            </Access>,
          ]}
        />
        <Modal
          destroyOnClose
          maskClosable={false}
          title="菜单路由"
          open={routerModalVisible}
          onCancel={() => setRouterModalVisible(false)}
          onOk={() => {
            // 复制的 data
            copy(routerUrl);
            // 复制成功提示
            message.success('复制成功');
            // 关闭复制弹框
            setRouterModalVisible(false);
          }}
          cancelText="关闭"
          okText="复制"
        >
          {routerUrl}
        </Modal>
        <Drawer
          zIndex={1061}
          destroyOnClose
          bodyStyle={{
            overflow: 'hidden',
          }}
          width="60%"
          title="出码结果"
          placement="right"
          open={codeModalVisible}
          onClose={() => setCodeModalVisible(false)}
          footer={
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={() => {
                // 复制的 data
                copy(code);
                // 关闭复制出码 弹框
                setCodeModalVisible(false);
                // 复制成功提示
                message.success('复制成功');
              }}
            >
              复制
            </Button>
          }
        >
          {isChrome ? (
            <ControlledEditor
              editorDidMount={(_: () => string, editor: monaco.editor.IStandaloneCodeEditor) => {
                // 设置为只读模式
                editor.updateOptions({ readOnly: true });
              }}
              height="calc(100vh - 100px)"
              language="javascript"
              value={code}
              theme="dark"
            />
          ) : (
            <TextArea rows={4} disabled value={code} />
          )}
        </Drawer>
        <Drawer
          destroyOnClose
          width="80%"
          title="批量导入配置预览"
          placement="right"
          open={importDrawerOpen}
          onClose={() => setImportDrawerOpen(false)}
          footer={
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={async () => {
                const waitImportData = importDrawerData.map((e) => e.import) || [];
                const uploadData = waitImportData.map((item) => {
                  if (!item.columns) {
                    const columns = [...(item?.columnField ?? []), ...(item?.columnParam ?? [])];
                    item.columns =
                      columns?.map((i, index: number) => {
                        if (i.columnType === 1) {
                          i.sort = index; // 用于后端排序
                        }
                        if (i.fieldDataAuthority) {
                          i.fieldDataAuthority = i.fieldDataAuthority.toString() || null;
                        }
                        if (Object.prototype.toString.call(i.id) === '[object String]') {
                          // 新添加的数据删掉 自创建id
                          return omit(i, ['id']);
                        }
                        return i;
                      }) || [];
                  }
                  return omit(item, ['columnField', 'columnParam']);
                });
                try {
                  const { success } = await dynamicBatchImportSave(uploadData);
                  if (success) {
                    setImportDrawerOpen(false);
                    actionRef?.current?.reloadAndRest();
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              保存
            </Button>
          }
        >
          <AdvancedTable
            rowKey="id"
            columns={[
              {
                dataIndex: 'import',
                title: '动态页面名称（导入）',
                render: (dom, entity) => {
                  return (
                    <Link
                      onClick={() => {
                        setEditId(null);
                        setImportStatus('编辑');
                        setImportData(entity?.import);
                        setDyManageVisible(true);
                      }}
                    >
                      {entity?.import?.dynamicName}
                    </Link>
                  );
                },
              },
              {
                dataIndex: 'exist',
                title: '动态页面名称（匹配）',
                render: (dom, entity) => {
                  return (
                    <span>
                      {entity?.exist?.name ? (
                        <Link
                          onClick={() => {
                            setImportStatus('预览');
                            setEditId(entity?.exist?.id);
                            setImportData(null);
                            setDyManageVisible(true);
                          }}
                        >
                          {entity?.exist?.name}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </span>
                  );
                },
              },
              {
                dataIndex: 'dataResource',
                title: '数据源（导入）',
                render: (_, entity, index) => {
                  return (
                    <Select
                      onChange={(val) => {
                        const data = cloneDeep(importDrawerData);
                        data[index].import.dataResource = val;
                        setImportDrawerData(data);
                      }}
                      value={entity.import.dataResource}
                      style={{ width: 180 }}
                      allowClear
                      placeholder="请选择"
                    >
                      {dataSourceList?.map((i, index) => (
                        <Select.Option value={i.databaseName} key={index}>
                          {i.databaseName}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                },
              },
              {
                dataIndex: 'handl',
                title: '处理方式',
                render: (dom) => <Tag className={`custom-noborder-tag-${dom === '覆盖' ? 'red' : 'blue'}`}>{dom}</Tag>,
              },
            ]}
            dataSource={importDrawerData}
            bordered
            scroll={{ x: 'max-content' }}
            rowSelection={{
              selectedRowKeys: importSelectedKeys,
              onChange: (selectedRowKeys) => {
                if (selectedRowKeys) {
                  // 勾选的key
                  setImportSelectedKeys(selectedRowKeys);
                }
              },
            }}
            search={false}
            options={false}
            pagination={false}
            tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
              return (
                <div>
                  <Link key="select" style={{ marginRight: 16 }} onClick={onCleanSelected}>
                    取消选择
                  </Link>

                  <Popconfirm
                    key="selectDel"
                    title="确定要删除吗?"
                    onConfirm={async () => {
                      const data =
                        importDrawerData.filter((ele) => !selectedRowKeys?.includes(ele?.id)) || importDrawerData;
                      setImportDrawerData(data);
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
        </Drawer>
      </Card>
    </div>
  );
}

export default DynamicPageManage;
