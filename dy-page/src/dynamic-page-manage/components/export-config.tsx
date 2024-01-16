/* eslint-disable complexity */
/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-11-23 16:11:20
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-30 18:43:01
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\export-config.tsx
 * @Description: 表格配置
 *
 */
import { Checkbox, Col, Form, Radio, Row, Select, Input, message, Drawer } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import type { SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { ExportDataType, SqlFields } from '../types';
import { TableApiConfigTips, ShowTableStyleTips } from './config-tips';
import { InformationOutlined } from '@cscs-fe/icons';

const { TextArea } = Input;

export interface ExportConfigActions {
  validate: () => Promise<boolean>;
}

/**
 * @description: 表格配置
 * @return {*}
 */
function ExportConfig(props: {
  // 用户列表
  UserInfo?: {
    label: string;
    value: string;
  }[];
  templateList?: SelectProps['options']; // “配置模板”下拉框数据
  exportData?: Partial<ExportDataType>;
  // 子组件值变化传递给父组件的回调
  setExportData: (data?: Partial<ExportDataType>) => void;
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<any> & {
      ExpandableComponent: React.FC;
    };
  }>;
  reportData: SqlFields[];
  actionsRef: React.MutableRefObject<ExportConfigActions | null>;
  isMaintainData: boolean;
}) {
  const {
    UserInfo,
    templateList,
    exportData,
    setExportData,
    expandableConfig = [],
    reportData,
    isMaintainData,
  } = props;
  const [form] = Form.useForm();

  const [canImport, setCanImport] = useState<boolean>(false); // 导出勾选框值
  const [cBox, setCBox] = useState<boolean>(false); // 导入勾选框值
  const [indexConfigVisible, setIndexConfigVisible] = useState<boolean>(false);
  const [asyncVisible, setAsyncVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState(false); // 抽屉展示的 数据
  const [node, setNode] = useState<React.ReactNode>(); // 选中ids
  const [tableInsertAuthorityVisible, setTableInsertAuthorityVisible] = useState<boolean>(false);
  const [tableUpdateAuthorityVisible, setTableUpdateAuthorityVisible] = useState<boolean>(false);
  const [tableDeleteAuthorityVisible, setTableDeleteAuthorityVisible] = useState<boolean>(false);

  /**
   * @description: 表格配置回显数据处理
   */
  useEffect(() => {
    if (exportData) {
      form.setFieldsValue(exportData);

      // 允许导出勾选框状态变化
      if (exportData.tableImport) {
        setCanImport(true);
      } else {
        setCanImport(false);
      }

      // 允许导入勾选框状态变化
      if (exportData.fieldExport) {
        setCBox(true);
      } else {
        setCBox(false);
      }

      // 允许新建勾选框状态变化
      if (exportData.tableInsert) {
        setTableInsertAuthorityVisible(true);
      } else {
        setTableInsertAuthorityVisible(false);
      }

      // 允许编辑勾选框状态变化
      if (exportData.tableUpdate) {
        setTableUpdateAuthorityVisible(true);
      } else {
        setTableUpdateAuthorityVisible(false);
      }

      // 允许删除勾选框状态变化
      if (exportData.tableDelete) {
        setTableDeleteAuthorityVisible(true);
      } else {
        setTableDeleteAuthorityVisible(false);
      }

      if (exportData.tableIndexConfig === 1 || exportData.tableIndexConfig === 2) {
        form.setFieldsValue({
          tableIndexCheckbox: true,
          tableIndexConfig: exportData.tableIndexConfig,
        });
        setIndexConfigVisible(true);
      } else {
        setIndexConfigVisible(false);
      }

      if (exportData.showTableStyle) {
        setAsyncVisible(true);
      } else {
        setAsyncVisible(false);
      }
    }
  }, [exportData]);

  useEffect(() => {
    form.validateFields();
  }, [reportData]);

  useEffect(() => {
    if (!isMaintainData) {
      form.setFieldsValue({
        tableInsert: false,
        tableUpdate: false,
        tableDelete: false,
        deleteAuthority: [],
        insertAuthority: [],
        updateAuthority: [],
      });

      setExportData({
        ...exportData,
        tableInsert: 0,
        tableUpdate: 0,
        tableDelete: 0,
        deleteAuthority: [],
        insertAuthority: [],
        updateAuthority: [],
      });
    }
  }, [isMaintainData]);

  /**
   * @description: 提供给父组件调用的函数方法
   * @param {*} ref
   * @return {*}
   */
  // useImperativeHandle(ref, () => ({
  //   getExportConfigData: async () => {
  //     const data = await form.getFieldsValue();
  //     return JSON.stringify(data);
  //   },
  // }));

  /**
   * @description: 抽屉弹框
   * @param {React} node
   */
  const handleVisible = (node: React.ReactNode) => {
    setNode(node);
    setVisible(true);
  };

  /**
   * @description: 表头 title
   * @param {string} title
   * @param {React.ReactNode} drawerContent
   * @return {React.ReactNode}
   */
  const IconsDrawerTitle = (title: string | React.ReactNode, drawerContent: React.ReactNode) => {
    return (
      <>
        {title}
        <InformationOutlined
          title="点击查看"
          onClick={() => handleVisible(drawerContent)}
          style={{ marginLeft: 4, opacity: 0.45 }}
        />
      </>
    );
  };

  /**
   * @description: 表单值变化的处理
   * @param {any} changedValues
   */
  const onValuesChange = (changedValues: any) => {
    setExportData({
      ...exportData,
      ...changedValues,
    });
    // 展示首列序号
    if (changedValues?.hasOwnProperty('tableIndexCheckbox')) {
      setExportData({
        ...exportData,
        tableIndexConfig: changedValues['tableIndexCheckbox'] ? 1 : null,
      });
    }

    // 允许导入
    if (changedValues?.hasOwnProperty('tableImport')) {
      const tableImport = changedValues['tableImport'];
      setExportData({
        ...exportData,
        tableImport: tableImport ? 1 : 0,
        importAuthority: !tableImport ? [] : exportData?.importAuthority,
        templateId: !tableImport ? null : exportData?.templateId,
      });
    }

    // 允许导出
    if (changedValues?.hasOwnProperty('fieldExport')) {
      setExportData({
        ...exportData,
        fieldExportAuthority: !changedValues['fieldExport'] ? [] : exportData?.fieldExportAuthority,
        fieldExport: changedValues['fieldExport'] ? 1 : 0,
      });
    }

    // 树形数据
    if (changedValues?.hasOwnProperty('showTableStyle')) {
      // 如果明细配置中任何一条数据配置了行分组，表格显示样式不允许配置树形和可展开
      const isExistedRowGroup = reportData?.some((item) => item?.fieldRow);

      if (isExistedRowGroup) {
        form.setFieldsValue({
          showTableStyle: null,
        });
        setExportData({
          ...exportData,
          showTableStyle: null,
          isAsync: false,
          parent_id: null,
          isExpandName: null,
        });
        message.warn('存在行分组，不支持树形数据/可展开');
      } else if (changedValues['showTableStyle'] === 'isTree') {
        setExportData({
          ...exportData,
          ...changedValues,
          isAsync: false,
        });
      }
    }

    // 允许新建
    if (changedValues?.hasOwnProperty('tableInsert')) {
      setExportData({
        ...exportData,
        insertAuthority: !changedValues['tableInsert'] ? [] : exportData?.insertAuthority,
        tableInsert: changedValues['tableInsert'] ? 1 : 0,
      });
      setTableInsertAuthorityVisible(changedValues['tableInsert']);
    }

    // 允许编辑
    if (changedValues?.hasOwnProperty('tableUpdate')) {
      setExportData({
        ...exportData,
        updateAuthority: !changedValues['tableUpdate'] ? [] : exportData?.updateAuthority,
        tableUpdate: changedValues['tableUpdate'] ? 1 : 0,
      });
      setTableUpdateAuthorityVisible(changedValues['tableUpdate']);
    }

    // 允许删除
    if (changedValues?.hasOwnProperty('tableDelete')) {
      setExportData({
        ...exportData,
        deleteAuthority: !changedValues['tableDelete'] ? [] : exportData?.deleteAuthority,
        tableDelete: changedValues['tableDelete'] ? 1 : 0,
      });
      setTableDeleteAuthorityVisible(changedValues['tableDelete']);
    }
  };

  return (
    <Form
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{
        tableSumPosition: 'down',
      }}
    >
      <Row>
        <Col span={8}>
          <Form.Item labelCol={{ span: 14 }} label="展示首列序号" name="tableIndexCheckbox" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={12}>
          {indexConfigVisible ? (
            <Form.Item label="编序方式" name="tableIndexConfig">
              <Radio.Group>
                <Radio value={1}>翻页重新编序</Radio>
                <Radio value={2}>翻页连续编序</Radio>
              </Radio.Group>
            </Form.Item>
          ) : null}
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 14 }}
            label="允许拖拽调整列宽"
            name="fieldResizableTitle"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item labelCol={{ span: 14 }} label="合计显示位置" name="tableSumPosition">
            <Select
              options={[
                { label: '表格上方', value: 'up' },
                { label: '表格下方', value: 'down' },
              ]}
              style={{
                width: 120,
              }}
              placeholder="请选择"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 14 }}
            label="表格显示样式"
            name="showTableStyle"
            tooltip={() => ShowTableStyleTips}
            rules={[
              {
                validator: async (rule, value) => {
                  if (value) {
                    // 如果明细配置中任何一条数据配置了行分组，则不允许配置树形和可展开
                    const isExistedRowGroup = reportData?.some((item) => item?.fieldRow);

                    if (isExistedRowGroup) {
                      return Promise.reject(new Error('存在行分组，不支持树形数据/可展开'));
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              options={[
                { label: '树形数据', value: 'isTree' },
                { label: '可展开', value: 'isExpand' },
              ]}
              style={{
                width: 120,
              }}
              allowClear
              placeholder="请选择"
            />
          </Form.Item>
        </Col>
        {asyncVisible ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {exportData?.showTableStyle === 'isTree' ? (
              <>
                <Col span={0}>
                  <Form.Item
                    name="isAsync"
                    style={{
                      display: 'none',
                    }}
                  >
                    <Radio.Group>
                      <Radio value={false}>全量加载</Radio>
                      {/* <Radio value={true}>懒加载</Radio> */}
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="parent_id">
                    <Input placeholder="请输入parent_id，不输入则默认为null" />
                  </Form.Item>
                </Col>
              </>
            ) : exportData?.showTableStyle === 'isExpand' ? (
              <Col span={4}>
                <Form.Item name="isExpandName">
                  <Select
                    options={expandableConfig}
                    filterOption
                    showSearch
                    style={{
                      width: 200,
                    }}
                    fieldNames={{
                      label: 'name',
                      value: 'name',
                    }}
                    allowClear
                    placeholder="请选择组件"
                  />
                </Form.Item>
              </Col>
            ) : null}
          </>
        ) : null}
      </Row>

      {isMaintainData ? (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item labelCol={{ span: 14 }} label="允许新建" name="tableInsert" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={7}>
              {tableInsertAuthorityVisible ? (
                <Form.Item label="新建权限" name="insertAuthority">
                  <Select
                    options={UserInfo}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="请选择"
                    mode="multiple"
                  />
                </Form.Item>
              ) : null}
            </Col>
          </Row>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item labelCol={{ span: 14 }} label="允许编辑" name="tableUpdate" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={7}>
              {tableUpdateAuthorityVisible ? (
                <Form.Item label="编辑权限" name="updateAuthority">
                  <Select
                    options={UserInfo}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="请选择"
                    mode="multiple"
                  />
                </Form.Item>
              ) : null}
            </Col>
          </Row>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item labelCol={{ span: 14 }} label="允许删除" name="tableDelete" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
            <Col span={7}>
              {tableDeleteAuthorityVisible ? (
                <Form.Item label="删除权限" name="deleteAuthority">
                  <Select
                    options={UserInfo}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="请选择"
                    mode="multiple"
                  />
                </Form.Item>
              ) : null}
            </Col>
          </Row>
        </>
      ) : null}

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Form.Item labelCol={{ span: 14 }} label="允许导入" name="tableImport" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={7}>
          {canImport ? (
            <Form.Item
              label="配置模板"
              name="templateId"
              rules={[
                {
                  required: true,
                  message: '请选择配置模板',
                },
              ]}
            >
              <Select options={templateList} allowClear showSearch optionFilterProp="label" placeholder="请选择" />
            </Form.Item>
          ) : null}
        </Col>
        <Col span={7}>
          {canImport ? (
            <Form.Item label="导入权限" name="importAuthority">
              <Select
                options={UserInfo}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                mode="multiple"
              />
            </Form.Item>
          ) : null}
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Form.Item labelCol={{ span: 14 }} label="允许导出" name="fieldExport" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
        <Col span={7}>
          {cBox ? (
            <Form.Item label="导出权限" name="fieldExportAuthority">
              <Select
                options={UserInfo}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                mode="multiple"
              />
            </Form.Item>
          ) : null}
        </Col>
      </Row>

      <Row>
        <Col span={22}>
          <Form.Item
            labelCol={{ span: 5 }}
            label={IconsDrawerTitle('属性配置', TableApiConfigTips)}
            name="tableApiConfig"
          >
            <TextArea placeholder="请输入" rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Drawer width={620} closable={false} placement="right" visible={visible} onClose={() => setVisible(false)}>
        {node}
      </Drawer>
    </Form>
  );
}

export default ExportConfig;
