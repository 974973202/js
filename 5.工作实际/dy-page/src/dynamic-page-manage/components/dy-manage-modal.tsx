/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-11-02 15:12:07
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\dy-manage-modal.tsx
 * @Description: 动态页面管理 新建/编辑 弹框
 *
 */
import { InformationOutlined } from '@cscs-fe/icons';
import { useRequest } from 'ahooks';
import { Col, Drawer, Form, Input, message, Radio, Row, Select, Spin, Tabs } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import cuid from 'cuid';
import { omit, uniqBy } from 'lodash-es';
import * as monaco from 'monaco-editor';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import FullScreenModal from '../../components/full-screen-modal';
import { queryDataSource } from '../../services';
import {
  getDynamicManageDetail,
  getDynamicTemplateList,
  getUserRoleBasic,
  optionsDynamicManage,
  queryDict,
} from '../services';
import {
  DyFormType,
  DyQueryDatabaseResponse,
  ExportDataType,
  ListResponse,
  saveDataType,
  SqlFields,
  SqlParams,
  TemplateListType,
} from '../types';
import CodeEnhance, { CodeRef } from './code-enhance';
import { dynamicSqlTips } from './config-tips';
import ExportConfig, { ExportConfigActions } from './export-config';
import PreviewTable from './preview-table';
import { SqlConfig } from './sql-config';
import styles from './style.less';
import TabEditTable, { fieldCodeValid } from './tab-edittable';
import { b64DecodeUnicode, b64EncodeUnicode } from '../../utils';

const { TabPane } = Tabs;
const { Option } = Select;
const { useForm } = Form;
// 判断是否是谷歌浏览器
// const isChrome = window.navigator.userAgent.includes('Chrome');

interface CreateFormProps {
  // 取消回调
  onCancel: () => void;
  // 确认回调
  onOk: () => void;
  // 编辑id
  id?: number | null;
  // 导入的数据
  importData?: ListResponse | null;
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<any> & {
      ExpandableComponent: React.FC;
    };
  }>;
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
  dataSourceList?: DyQueryDatabaseResponse[];
  importStatus?: '编辑' | '预览' | '';
  setImportDrawerData?: (data?: saveDataType) => void;
}

/**
 * @description: 字段显示样式
 */
const columnTypeOptions = [
  { label: '数字', value: 'digit' },
  { label: '金额', value: 'money' },
  { label: '文本', value: 'text' },
  { label: '百分比', value: 'percent' },
  { label: '日期', value: 'date' },
  { label: '时间', value: 'dateTime' },
  { label: '年月日', value: 'dateYMD' },
];

// 特殊字符处理
const containSpecial = new RegExp(/[\s#%&+/=?？]+/);

const mysqlPrimaryKeyStrategyOptions = [
  { label: '自增', value: 'auto' },
  { label: '雪花算法', value: 'snowflake' },
];
const oraclePrimaryKeyStrategyOptions = [
  { label: '序列', value: 'sequence' },
  { label: '雪花算法', value: 'snowflake' },
];

/**
 * @description: 动态页面管理 新建/编辑 弹框
 * @param {*} props
 */
const DyManageModal: React.FC<CreateFormProps> = (props) => {
  const {
    onCancel,
    onOk,
    id,
    importData,
    expandableConfig,
    expandStrategy,
    dataSourceList,
    importStatus,
    setImportDrawerData,
  } = props;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const jsCodeRef = useRef<CodeRef>(null);
  const jsEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const tabEditTableRef = useRef<{ getFormDatas: () => Promise<any>; validate: () => Promise<any> }>(null);

  const [form] = useForm();
  // loading
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // tab默认选中
  const [activeKey, setActiveKey] = useState<string>('1');
  // 配置明细
  const [reportData, setReportData] = useState<SqlFields[]>([]);
  // 参数配置
  const [reportParamsData, setReportParamsData] = useState<SqlParams[]>([]);
  // 导出配置
  const [exportData, setExportData] = useState<Partial<ExportDataType>>();
  // 数据预览参数
  const [previewOptions, setPreviewOptions] = useState<
    | ({
        columns: (SqlFields | SqlParams)[];
      } & DyFormType)
    | undefined
    | null
  >();
  // 抽屉相关参数
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<React.ReactNode>();
  // 数据预览结果SQL
  const [sqlNode, setSqlNode] = useState<string>();
  // SQL类型
  const [syntacticType, setSyntacticType] = useState('source_type');
  // 允许数据维护
  const [maintainData, setMaintainData] = useState(0);
  const exportConfigRef = useRef<ExportConfigActions | null>(null);
  // js code
  const [jsScript, setJsScript] = useState<string>('');

  const [primaryKeyStrategy, setPrimaryKeyStrategy] = useState<string | null>(null);
  const [dataSourceName, setDataSourceName] = useState<string>('');
  const [defaultDataSourceType, setDefaultDataSourceType] = useState<string>('');

  /**
   * @description: 获取编辑数据
   */
  const {
    data: initialData,
    run: getInitialData,
    loading,
  } = useRequest(
    (id: number) => {
      return getDynamicManageDetail(id);
    },
    {
      formatResult: (response) => {
        return response?.data;
      },
      manual: true,
    },
  );

  // 获取数据源
  const { data: dataSourceDetailList } = useRequest(() => queryDataSource(), {
    formatResult: (res) => {
      setDefaultDataSourceType(res.data?.default?.jdbcType);
      return res.data.list || [];
    },
  });

  // 初始化数据源类型
  const primaryKeyStrategyOptions = useMemo(() => {
    let dataSourceType: string | undefined = defaultDataSourceType;

    if (dataSourceName) {
      const dataSourceDetail = dataSourceDetailList?.find((item) => item.databaseName === dataSourceName);
      dataSourceType = dataSourceDetail?.jdbcType;
    }

    return dataSourceType === 'mysql' ? mysqlPrimaryKeyStrategyOptions : oraclePrimaryKeyStrategyOptions;
  }, [dataSourceDetailList, dataSourceList, dataSourceName, defaultDataSourceType]);

  /**
   * @description: 处理请求/导入的数据
   * @param {ListResponse} initData
   */
  // eslint-disable-next-line complexity
  const initData = (initData: ListResponse) => {
    if (!initData) return;

    const customTableConfig = JSON.parse(initData?.customTableConfig || '{}');

    /**
     * 表格配置数据处理
     * ?? 后处理的是历史旧数据兼容问题
     */
    setExportData({
      tableImport: initData.tableImport,
      importAuthority: initData?.importAuthority ? initData.importAuthority.split(',') : [],
      templateId: initData.templateId,
      fieldExport: customTableConfig.fieldExport ?? initData.fieldExport,
      fieldExportAuthority:
        customTableConfig?.fieldExportAuthority ??
        (initData?.fieldExportAuthority ? initData?.fieldExportAuthority?.split(',') : []),
      tableIndexConfig: customTableConfig.tableIndexConfig,
      fieldResizableTitle: customTableConfig.fieldResizableTitle ?? initData.fieldResizableTitle ? true : false,
      tableSumPosition: customTableConfig.tableSumPosition,
      showTableStyle: customTableConfig.showTableStyle,
      isAsync: customTableConfig.isAsync,
      parent_id: customTableConfig.parent_id,
      isExpandName: customTableConfig.isExpandName,
      tableApiConfig: initData?.tableApiConfig,
      tableInsert: initData?.tableInsert,
      tableUpdate: initData?.tableUpdate,
      tableDelete: initData?.tableDelete,
      insertAuthority: initData?.insertAuthority ? initData?.insertAuthority.split(',') : [],
      updateAuthority: initData?.updateAuthority ? initData?.updateAuthority.split(',') : [],
      deleteAuthority: initData?.deleteAuthority ? initData?.deleteAuthority.split(',') : [],
    });

    // sql 是base64编码
    let sql = initData.dynamicSql;
    try {
      sql = b64DecodeUnicode(initData.dynamicSql || '');
    } catch (error) {
      console.error(error);
    }
    form.setFieldsValue({
      // SQL
      dynamicSql: sql || '',
      dynamicName: initData.dynamicName || '',
      dataResource: initData.dataResource || null,
      syntacticType: initData.syntacticType || 'source_type',
      // 表格
      maintainData: initData.maintainData || 0,
      tableName: initData.tableName || '',
      primaryKey: initData.primaryKey || '',
      primaryKeyStrategy: initData.primaryKeyStrategy || null,
      sequenceName: initData.sequenceName || '',
    });
    // 允许数据维护
    setMaintainData(initData?.maintainData || 0);
    setDataSourceName(initData?.dataResource || '');
    setPrimaryKeyStrategy(initData?.primaryKeyStrategy || null);

    // SQL类型
    setSyntacticType(initData?.syntacticType || 'source_type');

    for (const ele of initData.columnField || []) {
      // 权限的处理，后端返回的是字符串，前端需要的是数组
      ele.fieldDataAuthority = typeof ele.fieldDataAuthority === 'string' ? ele.fieldDataAuthority.split(',') : [];
      ele.deleteAuthority = typeof ele.deleteAuthority === 'string' ? ele.deleteAuthority.split(',') : [];
      ele.updateAuthority = typeof ele.editAuthority === 'string' ? ele.editAuthority.split(',') : [];
      ele.insertAuthority = typeof ele.insertAuthority === 'string' ? ele.insertAuthority.split(',') : [];
      // 字段操作配置处理，后端返回的是字符串，前端需要的是对象
      ele.fieldOperate = ele.fieldOperate ? JSON.parse(ele.fieldOperate) : null;
    }
    // 明细配置数据
    setReportData(initData.columnField || []);
    // 参数配置数据
    setReportParamsData(initData.columnParam || []);
    // 代码增强数据
    setJsScript(initData.jsScript);
  };

  // 导入的数据
  useEffect(() => {
    importData && initData(importData);
  }, [importData]);

  // 编辑 通过id请求的数据
  useEffect(() => {
    initialData && initData(initialData);
  }, [initialData]);

  /**
   * @description: 编辑数据的请求
   */
  useEffect(() => {
    if (id) {
      getInitialData(id);
    }
  }, [id]);

  /**
   * @description: 主键生成策略
   */

  // 获取角色
  const { data: UserInfo } = useRequest(
    () => {
      return getUserRoleBasic();
    },
    {
      formatResult: (response) => {
        return response?.data;
      },
    },
  );

  // 获取“配置模板”下拉框数据
  const { data: templateList } = useRequest(
    () => {
      return getDynamicTemplateList();
    },
    {
      formatResult: (response) => {
        return response?.data?.map((item: TemplateListType) => {
          return {
            value: item.id,
            label: item.templateName,
          };
        });
      },
    },
  );

  // 聚合策略
  const { data: strategyData } = useRequest(() => queryDict('aggregation_strategy'), {
    formatResult: (response) => {
      return response?.data;
    },
  });

  // 新建&编辑
  const create = async (data: saveDataType, method: string) => {
    try {
      setIsSubmitting(true);
      const { success } = await optionsDynamicManage(data, method);
      if (success) {
        message.success(method === 'POST' ? '新建成功' : '修改成功');
        onOk();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * @description: 表单值变化
   */
  const handleValuesChange = (changedValues: any) => {
    const keys = Object.keys(changedValues);
    if (keys.includes('maintainData')) {
      setMaintainData(changedValues.maintainData);
      if (changedValues.maintainData === 0) {
        form.setFieldsValue({
          tableName: '',
          primaryKey: '',
          primaryKeyStrategy: null,
          sequenceName: '',
        });
      }
    }
    if (keys.includes('dataResource')) {
      setDataSourceName(changedValues.dataResource);
      form.setFieldValue('primaryKeyStrategy', null);
      form.setFieldValue('sequenceName', '');
    }
    if (keys.includes('primaryKeyStrategy')) {
      setPrimaryKeyStrategy(changedValues.primaryKeyStrategy);
      if (changedValues.primaryKeyStrategy !== 'sequence') {
        form.setFieldsValue({
          sequenceName: '',
        });
      }
    }
  };

  /**
   * @description: 数据的校验
   * @return {boolean}
   */
  // eslint-disable-next-line complexity
  const handleValidateFields = () => {
    let reportDataValidate = false;
    if (reportData?.length === 0) {
      message.error('请添加配置明细');
      setActiveKey('1');
      return false;
    }
    const reportDataMsgArr: string[] = [];
    for (const ele of reportData) {
      if (!!ele.fieldName === false && !reportDataMsgArr.includes('字段')) {
        reportDataMsgArr.push('字段');
        reportDataValidate = true;
      }
      if (!!ele.fieldContent === false && !reportDataMsgArr.includes('字段说明')) {
        reportDataMsgArr.push('字段说明');
        reportDataValidate = true;
      }

      // 如果明细配置中任何一条数据配置了行分组，表格显示样式不允许配置树形和可展开
      if (ele.fieldRow && exportData?.showTableStyle) {
        message.warn('存在行分组，不支持树形数据/可展开');
        return false;
      }

      // 字段类型为文本，查询模式属于下拉框（包括下拉单选、下拉多选等）、树形选择（包括树形单选、树形多选等）时，需必填
      if (
        ele.fieldType === 'text' &&
        fieldCodeValid.has(ele?.selectMode || '') &&
        !!ele.fieldCode === false &&
        !reportDataMsgArr.includes('字典')
      ) {
        reportDataMsgArr.push('字典');
        reportDataValidate = true;
      }
    }
    if (reportDataValidate) {
      message.error(`请输入${reportDataMsgArr.join('，')}`);
      setActiveKey('1');
      return false;
    }

    const reportParamsDataMsgArr: string[] = [];
    let reportParamsDataValidate = false;
    for (const ele of reportParamsData) {
      if (!!ele.fieldName === false && !reportParamsDataMsgArr.includes('参数')) {
        reportParamsDataMsgArr.push('参数');
        reportParamsDataValidate = true;
      }
      if (!!ele.fieldContent === false && !reportParamsDataMsgArr.includes('参数说明')) {
        reportParamsDataMsgArr.push('参数说明');
        reportParamsDataValidate = true;
      }
      // 若为原生SQL语法，需必填
      // if (
      //   syntacticType === 'source_type' &&
      //   !!ele.defaultValue === false &&
      //   !reportParamsDataMsgArr.includes('默认值')
      // ) {
      //   reportParamsDataMsgArr.push('默认值');
      //   reportParamsDataValidate = true;
      // }
    }
    if (reportParamsDataValidate) {
      message.error(`请输入${reportParamsDataMsgArr.join('，')}`);
      setActiveKey('2');
      return false;
    }
    return true;
  };

  /**
   * @description: 保存参数处理
   * @param {DyFormType} params
   * @param {string} key 有值时不处理 取巧判断 用于弹窗数据处理避免影响原始值，省去克隆操作
   * @return {*}
   */
  const saveParams = (params: DyFormType, key?: string): saveDataType => {
    // 表格配置数据
    // const exportConfigData = (await exportRef?.current?.getExportConfigData()) || exportData;
    const oldExportConfigData = {
      fieldExport: exportData?.fieldExport ? 1 : 0,
      fieldExportAuthority: exportData?.fieldExportAuthority?.toString(),
      fieldResizableTitle: exportData?.fieldResizableTitle ? 1 : 0,
      tableIndexConfig: exportData?.tableIndexConfig || 0,
      tableInsert: exportData?.tableInsert ? 1 : 0,
      tableUpdate: exportData?.tableUpdate ? 1 : 0,
      tableDelete: exportData?.tableDelete ? 1 : 0,
      insertAuthority: exportData?.insertAuthority?.toString(),
      updateAuthority: exportData?.updateAuthority?.toString(),
      deleteAuthority: exportData?.deleteAuthority?.toString(),
    };

    const { tableApiConfig, tableImport, importAuthority, templateId, ...rest } = exportData || {};

    const data = {
      ...params,
      columns: [...reportData, ...reportParamsData],
      tableApiConfig,
      tableImport: tableImport ? 1 : 0,
      importAuthority: importAuthority?.length > 0 ? importAuthority.join(',') : '',
      templateId,
      customTableConfig: JSON.stringify({ ...rest }),
      jsScript: jsCodeRef.current?.getJsScript() ?? jsScript,
      ...oldExportConfigData, // 给后端玩的历史旧数据
    };
    data.columns = data.columns.map((i, index: number) => {
      const newData = { ...i };
      if (newData.columnType === 1) {
        newData.sort = index; // 用于后端排序
      }
      if (newData.fieldDataAuthority && !key) {
        newData.fieldDataAuthority = newData.fieldDataAuthority.toString() || null;
      }
      // 将列表中的 fieldOperate 对象转换为字符串
      if (newData.fieldOperate) {
        newData.fieldOperate = JSON.stringify(newData.fieldOperate) as any;
      }
      if (Object.prototype.toString.call(newData.id) === '[object String]') {
        // 新添加的数据删掉 自创建id
        return omit(newData, ['id']);
      }
      return newData;
    });
    return data;
  };

  /**
   * @description: 确认
   */
  const onSubmit = async () => {
    // 校验名称 数据源 SQL
    try {
      await tabEditTableRef?.current?.validate();
      const res = await form.validateFields();
      // 因为@ant-design/pro-table"2.46.1" 不支持EditableProTable的校验提示
      // 故手动校验动态报表明细，报表参数
      if (!handleValidateFields()) return false;
      const data = saveParams(res);
      if (importStatus === '编辑') {
        data.columnField = reportData; // 用于二次操作回显

        data.columnParam = reportParamsData; // 用于二次操作回显
        setImportDrawerData?.({ ...data, id: importData?.id });
      } else {
        // dynamicSql encode base64
        data.dynamicSql = b64EncodeUnicode(data.dynamicSql);
        if (id) {
          data.id = id;
          create(data, 'PUT');
        } else {
          create(data, 'POST');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // SQL解析之后的tabs 列表数据
  const handleAnalysisSqlFinish = (fieldsColumns: SqlFields[], paramsColumns: SqlParams[]) => {
    for (const fields of fieldsColumns) {
      fields.id = cuid();
      fields.fieldDisplay = fields.fieldDisplay ? 1 : 0;
      fields.fieldSelect = fields.fieldSelect ? 1 : 0;
      fields.fieldSum = fields.fieldSum ? 1 : 0;
      fields.fieldSort = fields.fieldSort ? 1 : 0;
      fields.selectMode = 'input';
      if (typeof fields.fieldDataAuthority === 'string') {
        fields.fieldDataAuthority = fields.fieldDataAuthority.split(',');
      }
      if (!fields.fieldDataAuthority) {
        fields.fieldDataAuthority = [];
      }
    }
    for (const params of paramsColumns) params.id = cuid();
    setReportData(uniqBy([...reportData, ...fieldsColumns], 'fieldName'));
    setReportParamsData(uniqBy([...reportParamsData, ...paramsColumns], 'fieldName'));
  };

  // table add
  const addFieldColumn = (columns: Array<SqlFields | SqlParams>, type: string) => {
    type === 'reportDetails'
      ? setReportData(columns as Array<SqlFields>)
      : setReportParamsData(columns as Array<SqlParams>);
  };

  /**
   * @description: tab切换函数
   * @param {string} key
   */
  const handleActiveKey = async (key: string) => {
    if (key === '3') {
      setSqlNode('');
      form
        .validateFields(['dynamicSql'])
        .then(async () => {
          if (!handleValidateFields()) return false;
          const params: DyFormType = form.getFieldsValue([
            'dynamicName',
            'dataResource',
            'dynamicSql',
            'syntacticType',
            'maintainData',
            'tableName',
            'primaryKey',
            'primaryKeyStrategy',
            'sequenceName',
          ]);
          const options = saveParams(params, key);
          setPreviewOptions(options);
          return;
        })
        .catch((error) => {
          return error;
        });
    }
    // if (key === '4') {
    //   const isExistedRowGroup = reportData?.some((item) => item?.fieldRow);
    //   if (isExistedRowGroup) {
    //     message.error('明细配置中任何一条数据配置了行分组，表格显示样式不允许配置树形和可展开');
    //   }
    // }
    setActiveKey(key);
    setPreviewOptions(null);
  };

  /**
   * @description: 抽屉函数
   * @param {React} node
   */
  const handleVisible = (node: React.ReactNode) => {
    setNode(node);
    setVisible(true);
  };

  /**
   * @description: 编辑器布局初始化
   */
  const toggleScreen = () => {
    setTimeout(() => {
      editorRef?.current?.layout();
      jsEditorRef?.current?.layout();
    }, 0);
  };

  // eslint-disable-next-line no-nested-ternary
  const title = importStatus ? importStatus : id ? '编辑' : '新建';
  const status = importStatus === '预览' ? true : false;

  return (
    <FullScreenModal
      destroyOnClose
      title={title}
      visible={true}
      onCancel={onCancel}
      onOk={onSubmit}
      maskClosable={false}
      width="80%"
      confirmLoading={isSubmitting}
      fullScreen={true}
      toggleScreen={toggleScreen}
      cancelButtonProps={{
        disabled: status,
      }}
      okButtonProps={{
        disabled: status,
      }}
    >
      <Form
        className="login-form"
        labelCol={{
          flex: '120px',
        }}
        wrapperCol={{
          flex: 1,
        }}
        initialValues={initialData}
        form={form}
        onValuesChange={handleValuesChange}
      >
        <Row gutter={24}>
          <Col span={6} key={0}>
            <Form.Item
              name="dynamicName"
              label="名称"
              style={{
                flexWrap: 'nowrap',
                marginLeft: 7,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入名称',
                },
                () => ({
                  validator(_, value) {
                    if (value && containSpecial.test(value)) {
                      return Promise.reject(new Error('名称中不能包含空格及特殊字符：+=/?%#&'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={6} key={2}>
            <Form.Item
              name="dataResource"
              label="数据源"
              style={{
                flexWrap: 'nowrap',
              }}
              tooltip="若不选择数据源，则使用SpringBoot配置文件里配置的主数据源"
            >
              <Select placeholder="请选择" allowClear showSearch>
                {dataSourceList?.map((i, index) => (
                  <Option value={i.databaseName} key={index}>
                    {i.databaseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} key={3}>
            <Form.Item
              name="syntacticType"
              label="SQL类型"
              style={{
                flexWrap: 'nowrap',
              }}
              initialValue="source_type"
            >
              <Select onChange={setSyntacticType} placeholder="请选择">
                <Option value="source_type" key={1}>
                  原生SQL语法
                </Option>
                <Option value="mybatis_type" key={2}>
                  MyBatis语法
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} key={3}>
            <Form.Item
              name="maintainData"
              label="允许数据维护"
              style={{
                flexWrap: 'nowrap',
              }}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {maintainData === 1 ? (
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label="数据库表名"
                name="tableName"
                required
                rules={[
                  {
                    required: true,
                    message: '请输入数据库表名',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="表主键字段"
                name="primaryKey"
                required
                rules={[
                  {
                    required: true,
                    message: '请输入表主键字段',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="主键生成策略"
                name="primaryKeyStrategy"
                required
                rules={[
                  {
                    required: true,
                    message: '请选择主键生成策略',
                  },
                ]}
              >
                <Select options={primaryKeyStrategyOptions} placeholder="请选择" />
              </Form.Item>
            </Col>

            {primaryKeyStrategy === 'sequence' ? (
              <Col span={6}>
                <Form.Item
                  label="序列名称"
                  name="sequenceName"
                  required
                  rules={[
                    {
                      required: true,
                      message: '请输入序列名称',
                    },
                  ]}
                >
                  <Input placeholder="请选择" />
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        ) : null}

        <Col span={24}>
          <Form.Item
            label="配置 SQL"
            name="dynamicSql"
            required
            rules={[
              {
                required: true,
                message: '请输入SQL',
              },
            ]}
            labelCol={{
              flex: '106px',
            }}
            wrapperCol={{
              span: 24,
            }}
            tooltip={{
              icon: <InformationOutlined style={{ opacity: 0.45 }} onClick={() => handleVisible(dynamicSqlTips)} />,
            }}
          >
            <SqlConfig editorRef={editorRef} onAnalysisFinish={handleAnalysisSqlFinish} form={form} />
          </Form.Item>
        </Col>
      </Form>

      {loading ? (
        <Spin />
      ) : (
        <Tabs className={styles['edit-tab']} activeKey={activeKey} destroyInactiveTabPane onChange={handleActiveKey}>
          <TabPane tab="明细配置" key="1">
            <TabEditTable
              ref={tabEditTableRef}
              setState={setReportData}
              type="reportDetails"
              onEditChange={addFieldColumn}
              dataSource={reportData}
              columnTypeOptions={columnTypeOptions}
              UserInfo={UserInfo}
              strategyData={strategyData}
              isMaintainData={maintainData === 1}
            />
          </TabPane>
          <TabPane tab="参数配置" key="2">
            <TabEditTable
              type="reportParams"
              syntacticType={syntacticType}
              onEditChange={addFieldColumn}
              setState={setReportParamsData}
              dataSource={reportParamsData}
            />
          </TabPane>
          <TabPane tab="表格配置" key="4">
            <ExportConfig
              UserInfo={UserInfo}
              templateList={templateList}
              exportData={exportData}
              setExportData={setExportData}
              expandableConfig={expandableConfig}
              reportData={reportData}
              actionsRef={exportConfigRef}
              isMaintainData={maintainData === 1}
            />
          </TabPane>
          <TabPane tab="代码增强" key="5">
            <CodeEnhance jsScript={jsScript} setJsScript={setJsScript} jsEditorRef={jsEditorRef} ref={jsCodeRef} />
          </TabPane>
          <TabPane tab="数据预览" key="3">
            <PreviewTable
              expandableConfig={expandableConfig}
              expandStrategy={expandStrategy}
              // exportData={exportData}
              previewOptions={previewOptions}
              // onCancel={onCancel}
              // setSqlNode={setSqlNode}
            />
          </TabPane>
        </Tabs>
      )}
      <Drawer width={500} closable={false} placement="right" visible={visible} onClose={() => setVisible(false)}>
        {node}
      </Drawer>
    </FullScreenModal>
  );
};

export default DyManageModal;
