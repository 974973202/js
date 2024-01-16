/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-30 19:16:50
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\tab-edittable.tsx
 * @Description: 动态页面管理编辑页面 可编辑表格部分
 */
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { Input, message, FormInstance, Checkbox, Tooltip, Typography, Popconfirm, Drawer, Select } from 'antd';
import cuid from 'cuid';
import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useForm } from 'antd/lib/form/Form';
import DragColumn from './drag-column';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  fieldCodeTips,
  defaultValueTips,
  configDefaultValueTips,
  fieldUnitTips,
  fieldDisplayTips,
  fieldSelectTips,
  selectModeTips,
  fieldHrefTips,
  ColumnConfigTips,
  fieldRowTitle,
  fieldAggregationTitle,
  fieldTotalTitle,
  fieldCreateEditTips,
  fieldStyleTips,
} from './config-tips';
import styles from './style.less';
import { InformationOutlined } from '@cscs-fe/icons';
import { debounce, uniqBy } from 'lodash-es';
import { SqlFields, SqlParams } from '../types';
import { FormFieldType } from '../../enums';

const { TextArea } = Input;
const { Link } = Typography;

/**
 * @description: 查询模式
 * @return {Array}
 */
const selectMod = [
  { label: '精确查询', value: 'exactInput' },
  { label: '模糊查询', value: 'input' },
  { label: '包含查询', value: 'includeInput' },
  { label: '范围查询', value: 'selectRange' },
  { label: '下拉单选', value: 'selectRadio' },
  { label: '下拉多选', value: 'selectCheckout' },
  { label: '树形单选', value: 'treeSelect' },
  { label: '树形多选', value: 'treeSelectCheckout' },
  { label: '级联单选', value: 'cascader' },
  { label: '级联多选', value: 'cascaderCheckout' },
];

const formFieldTypeOptions = [
  { label: '输入框', value: FormFieldType.Input },
  { label: '日期选择框', value: FormFieldType.DatePicker },
  { label: '日期时间选择框', value: FormFieldType.DateTimePicker },
  { label: '下拉单选框', value: FormFieldType.Select },
  { label: '下拉多选框', value: FormFieldType.SelectMultiple },
  { label: '树形单选框', value: FormFieldType.TreeSelect },
  { label: '树形多选', value: FormFieldType.TreeSelectMultiple },
];

/**
 * 校验项
 */
export const fieldCodeValid = new Set([
  'selectRadio',
  'selectCheckout',
  'treeSelect',
  'treeSelectCheckout',
  'cascader',
  'cascaderCheckout',
]);
const iconTitle = '点击查看';

/**
 * @description: 加 *
 * @param {string} text
 * @return {ReactNode}
 */
const requiredTitle = (text: string) => (
  <span>
    <span style={{ color: 'red' }}>*</span>
    {text}
  </span>
);

/**
 * @description: 表头 title
 * @param {string} title
 * @param {React} titleTips
 * @param {Record} tooltipProps
 * @return {React.ReactNode}
 */
const IconsTitle = (title: string, titleTips: React.ReactNode, tooltipProps?: Record<string, any>) => {
  return (
    <>
      {title}
      <Tooltip {...tooltipProps} placement="top" title={() => titleTips}>
        <QuestionCircleOutlined style={{ marginLeft: 4 }} />
      </Tooltip>
    </>
  );
};

interface RefProps {
  // 获取表格 data
  getFormDatas: () => Promise<any>;
  validate: () => Promise<any>;
}

interface Props<T = any> {
  /** 判断明细配置还是参数配置 */ type: string;
  /** 向父组件传递新增&编辑数据 */ onEditChange: (dataSource: Array<SqlFields | SqlParams>, type: string) => void;
  /** 向父组件传递变化数据 */ setState: (data: T) => void;
  /** 表格数据 */ dataSource: Array<SqlFields | SqlParams>;
  ref: React.MutableRefObject<FormInstance | undefined>;
  /** 字段显示样式列表 */ columnTypeOptions?: Array<{ label: string; value: string }>;
  /** SQL类型，用于判断必填符号 */ syntacticType?: string;
  /** 用户列表 用于权限 */ UserInfo?: {
    label: string;
    value: string;
  }[];
  /** 聚合策略字典值 */ strategyData?: Array<{
    value: string;
    label: string;
    description: string | null;
  }>;
  isMaintainData?: boolean; // 是否支持维护页面
}

/**
 * @description: 自定义 勾选框
 */
const CustomCheckbox: React.FC<{
  type?: string;
  fieldType?: string;
  value?: number;
  onChange?: (e: number) => void;
}> = ({ value, onChange = () => {}, fieldType, type }) => {
  if (type === 'sum' && fieldType !== 'digit' && fieldType !== 'money') {
    return <Checkbox disabled checked={value === 1} />;
  }
  return <Checkbox checked={value === 1} onChange={() => onChange(value === 1 ? 0 : 1)} />;
};

/**
 * @description: 明细配置/参数配置表格页
 * @param {*} React
 * @param {*} Props
 * @return {ReactNode}
 */
const TabEditTable = React.forwardRef<RefProps, Props>((props, ref) => {
  const {
    onEditChange,
    dataSource = [],
    type,
    setState,
    columnTypeOptions = [],
    UserInfo = [],
    syntacticType,
    strategyData,
    isMaintainData,
  } = props;

  const [editForm] = useForm(); // 可编辑表格的key
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(dataSource?.map((item) => item.id as string)); // 抽屉 visible
  const [visible, setVisible] = useState(false); // 抽屉展示的 数据
  const [node, setNode] = useState<React.ReactNode>(); // 选中ids
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
  const [fieldAggregationData, setFieldAggregationData] = useState<
    Array<{
      label?: string;
      value?: string;
    }>
  >([]); // 聚合依据数据
  const [fieldNameArray, setFieldNameArray] = useState<string[]>([]); // 收集 字段说明，用于判断聚合下拉数据是否禁用
  const [aggregationIndex, setAggregationIndex] = useState<string | number | undefined>(); // 改变聚合依据的索引
  const [isAllEnableCreateEdit, setIsAllEnableCreateEdit] = useState<boolean>(true); // 是否所有的允许新建编辑必填都是 true
  /**
   * @description: 可拖拽表格配置
   */
  const { components: dragComponents } = DragColumn({
    data: dataSource,
    onSortEnd: setState,
  });

  /**
   * @description: 收集可编辑表格的key，用于可编辑表格
   */
  useEffect(() => {
    setEditableRowKeys(dataSource.map((item) => item.id as string));
    if (type === 'reportDetails') {
      setFieldNameArray(dataSource.map((item) => item.fieldName) || []);
      const _fieldAggregationData = [];
      for (const ele of dataSource) {
        // 存在行分组则取该项数据作为聚合依据的数据
        if (ele?.fieldRow) {
          _fieldAggregationData.push({
            label: ele.fieldContent,
            value: ele.fieldName,
          });
        }
      }
      setFieldAggregationData(_fieldAggregationData);
    }

    // 判断是否所有 允许新建编辑必填 都是 true
    const isAllEnableCreateEdit = dataSource.every(
      (item) => item.fieldOperate?.insert && item.fieldOperate?.update && item.fieldOperate?.must,
    );

    setIsAllEnableCreateEdit(dataSource.length > 0 ? isAllEnableCreateEdit : false);
  }, [dataSource]);

  useEffect(() => {
    // 用于判断是否显示允许新建编辑，false 清空fieldOperate, operateStyle
    if (!isMaintainData) {
      const newDataSource = dataSource.map((item) => {
        return {
          ...item,
          fieldOperate: {
            insert: false,
            update: false,
            must: false,
          },
          operateStyle: null,
        };
      });
      onEditChange(newDataSource, type);
    }
  }, [isMaintainData]);

  /**
   * @description: 给父组件暴露的子组件方法函数
   * @param {*} ref
   * @return {function}
   */
  useImperativeHandle(ref, () => ({
    getFormDatas: async () => {
      const fieldsValue = await editForm.validateFields();
      return fieldsValue;
    },
    validate: async () => {
      return await editForm.validateFields();
    },
  }));

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
          title={iconTitle}
          onClick={() => handleVisible(drawerContent)}
          style={{ marginLeft: 4, opacity: 0.45 }}
        />
      </>
    );
  };

  /**
   * 设置所有的允许新建编辑
   */
  const handleToggleAllEnableCreateEdit = (e: any) => {
    const { checked } = e.target;
    setIsAllEnableCreateEdit(checked);
    const newDataSource = dataSource.map((item) => {
      return {
        ...item,
        fieldOperate: {
          insert: checked,
          update: checked,
          must: checked,
        },
      };
    });
    onEditChange(newDataSource, type);
  };

  /**
   * @description: 明细配置/参数配置 columns
   */
  const columns: (syntacticType?: string) => ProColumns[] = (syntacticType) =>
    type === 'reportDetails'
      ? [
          {
            title: requiredTitle('字段'),
            dataIndex: 'fieldName',
            key: 'fieldName',
            fixed: 'left',
            width: 150,
            renderFormItem: (_, { record: { fieldName } }) => (
              <TextArea status={fieldName ? '' : 'error'} placeholder="请输入" rows={1} />
            ),
          },
          {
            title: requiredTitle('字段说明'),
            dataIndex: 'fieldContent',
            key: 'fieldContent',
            fixed: 'left',
            width: 150,
            renderFormItem: (_, { record: { fieldContent } }) => (
              <TextArea status={fieldContent ? '' : 'error'} placeholder="请输入" rows={1} />
            ),
          },
          {
            title: requiredTitle('字段显示样式'),
            dataIndex: 'fieldType',
            key: 'fieldType',
            valueType: 'select',
            width: 110,
            fieldProps: {
              allowClear: false,
              options: columnTypeOptions,
            },
          },
          {
            title: IconsTitle('字段显示参数', fieldUnitTips, {
              overlayInnerStyle: {
                width: 370,
              },
            }),
            dataIndex: 'fieldUnit',
            key: 'fieldUnit',
            width: 150,
            renderFormItem: (_, { record: { fieldType } }) => (
              <TextArea disabled={fieldType === 'dateYMD'} placeholder="请输入" rows={1} />
            ),
            formItemProps: {
              rules: [
                {
                  validator: (_, value: string) => {
                    return new Promise((resolve, reject) => {
                      // 逗号前后不允许缺少参数
                      if (value?.includes(',') && !/\d+,[^\s,]+/.test(value)) {
                        reject(new Error('输入不合法'));
                      }
                      // 不允许输入负数
                      if (/^\s*-\d+/.test(value)) {
                        reject(new Error('输入不合法'));
                      }
                      resolve(null);
                    });
                  },
                },
              ],
            },
          },
          {
            title: IconsTitle('列表中显示', fieldDisplayTips),
            dataIndex: 'fieldDisplay',
            key: 'fieldDisplay',
            valueType: 'checkbox',
            initialValue: 1,
            width: 110,
            align: 'center',
            renderFormItem: () => <CustomCheckbox />,
          },
          {
            title: IconsDrawerTitle('字典', fieldCodeTips),
            dataIndex: 'fieldCode',
            key: 'fieldCode',
            width: 200,
            renderFormItem: (_, { record: { fieldType, fieldCode, selectMode } }) => {
              // 字段类型为文本，查询模式属于下拉框（包括下拉单选、下拉多选等）、树形选择（包括树形单选、树形多选等）时，需必填
              const vaild = fieldCodeValid.has(selectMode);
              const statusText = fieldType === 'text' && vaild ? (fieldCode ? '' : 'error') : '';
              return <TextArea status={statusText} placeholder="请输入" rows={1} />;
            },
          },
          {
            title: IconsTitle('条件中显示', fieldSelectTips),
            dataIndex: 'fieldSelect',
            key: 'fieldSelect',
            valueType: 'checkbox',
            initialValue: 0,
            width: 110,
            align: 'center',
            renderFormItem: () => <CustomCheckbox />,
          },
          {
            title: IconsDrawerTitle('查询模式', selectModeTips),
            dataIndex: 'selectMode',
            key: 'selectMode',
            valueType: 'select',
            width: 120,
            fieldProps: () => {
              return {
                allowClear: false,
              };
            },
            request: async () => selectMod || [],
          },
          {
            title: IconsDrawerTitle('查询默认值', defaultValueTips),
            dataIndex: 'defaultValue',
            key: 'defaultValue',
            width: 110,
            renderFormItem: () => {
              return <TextArea placeholder="请输入" rows={1} />;
            },
          },
          ...(isMaintainData
            ? [
                {
                  title: (
                    <>
                      <Checkbox checked={isAllEnableCreateEdit} onChange={handleToggleAllEnableCreateEdit} />
                      {IconsTitle(' 允许新建编辑', fieldCreateEditTips)}
                    </>
                  ),
                  dataIndex: 'fieldOperate',
                  key: 'fieldOperate',
                  width: 220,
                  hideInForm: isMaintainData,
                  renderFormItem: () => {
                    return <OperationFormItem />;
                  },
                },
                {
                  title: IconsTitle('组件样式', fieldStyleTips),
                  dataIndex: 'operateStyle',
                  key: 'operateStyle',
                  width: 200,
                  renderFormItem: () => <Select options={formFieldTypeOptions} placeholder="请选择" />,
                },
              ]
            : []),
          {
            title: IconsDrawerTitle('字段超链接', fieldHrefTips),
            dataIndex: 'fieldHref',
            key: 'fieldHref',
            width: 200,
            renderFormItem: () => <TextArea placeholder="请输入" rows={1} style={{ margin: '8px 0' }} />,
          },
          {
            title: IconsTitle('允许排序', '勾选后，该列列头支持根据该字段或者“排序字段”所填字段列值进行排序。'),
            dataIndex: 'fieldSort',
            key: 'fieldSort',
            valueType: 'checkbox',
            initialValue: 0,
            width: 100,
            align: 'center',
            renderFormItem: () => <CustomCheckbox />,
          },
          {
            title: IconsTitle(
              '排序字段',
              '当允许排序时，可填写某一“字段”，则按所填字段列值进行排序。若未填写，则默认使用该“字段”列值进行排序。',
            ),
            dataIndex: 'fieldSortName',
            key: 'fieldSortName',
            width: 100,
            renderFormItem: () => <TextArea placeholder="请输入" rows={1} />,
          },
          {
            title: '列分组标题',
            dataIndex: 'fieldTitle',
            key: 'fieldTitle',
            width: 100,
            renderFormItem: () => <TextArea placeholder="请输入" rows={1} />,
          },
          {
            title: IconsTitle('行分组', fieldRowTitle),
            dataIndex: 'fieldRow',
            key: 'fieldRow',
            valueType: 'select',
            width: 110,
            fieldProps: {
              options: [
                { label: '不合并显示', value: 'default' },
                { label: '合并显示', value: 'merge' },
              ],
            },
          },
          {
            title: IconsTitle('聚合依据', fieldAggregationTitle),
            dataIndex: 'fieldAggregation',
            key: 'fieldAggregation',
            valueType: 'select',
            width: 110,
            fieldProps: (_, { entry: { fieldType }, rowIndex }: { entry: Record<string, any>; rowIndex: number }) => {
              return {
                options: fieldAggregationData.map((ele) => ({
                  ...ele,
                  disabled: rowIndex < fieldNameArray.indexOf(ele?.value || ''), // 只能选比当前前的数据
                })),
                disabled: fieldType !== 'digit' && fieldType !== 'money',
                onChange: () => setAggregationIndex(rowIndex),
              };
            },
          },
          {
            title: '聚合策略',
            dataIndex: 'fieldStrategy',
            key: 'fieldStrategy',
            valueType: 'select',
            width: 100,
            fieldProps: (_, { entry: { fieldAggregation } }: { entry: Record<string, any> }) => ({
              options: strategyData,
              disabled: !fieldAggregation,
              allowClear: false,
            }),
          },
          {
            title: IconsTitle('合计', fieldTotalTitle),
            dataIndex: 'fieldSum',
            key: 'fieldSum',
            valueType: 'checkbox',
            initialValue: 0,
            width: 80,
            renderFormItem: (_, { record: { fieldType } }) => {
              return <CustomCheckbox type="sum" fieldType={fieldType} />;
            },
          },
          {
            title: IconsDrawerTitle('属性配置', ColumnConfigTips),
            dataIndex: 'columnConfig',
            key: 'columnConfig',
            width: 200,
            renderFormItem: () => <TextArea placeholder="请输入" rows={1} />,
          },
          {
            title: '字段查看权限',
            dataIndex: 'fieldDataAuthority',
            key: 'fieldDataAuthority',
            valueType: 'select',
            width: 200,
            fieldProps: {
              mode: 'multiple',
              maxTagCount: 1,
              // getPopupContainer: (triggerNode) => triggerNode.parentElement || document.body,
              options: UserInfo || [],
            },
          },
        ]
      : [
          {
            title: requiredTitle('参数'),
            dataIndex: 'fieldName',
            key: 'fieldName',
            fieldProps: (_, { entry: { fieldName } }: { entry: Record<string, any> }) => ({
              status: fieldName ? '' : 'error',
            }),
          },
          {
            title: requiredTitle('参数说明'),
            dataIndex: 'fieldContent',
            key: 'fieldContent',
            fieldProps: (_, { entry: { fieldContent } }: { entry: Record<string, any> }) => ({
              status: fieldContent ? '' : 'error',
            }),
          },
          {
            title: IconsDrawerTitle('默认值', configDefaultValueTips),
            dataIndex: 'defaultValue',
            key: 'defaultValue',
          },
        ];

  /**
   * @description: 删除表格行
   * @param {function} selectedRows
   */
  const handleDelete = (selectedRows: React.Key[]) => {
    const restData = dataSource.filter((ele) => !selectedRows?.includes(ele?.id as string)) || dataSource;
    // 处理后传给父组件
    onEditChange(restData, type);
    // 清空选中的key
    setSelectedIds([]);
  };

  const debounceHandleValuesChange = debounce((record, recordList) => handleValuesChange(record, recordList), 800);

  // eslint-disable-next-line complexity
  const handleValuesChange = (record: SqlFields | SqlParams, recordList: Array<any>) => {
    let mergeData = recordList;
    if (type === 'reportDetails') {
      const _fieldAggregationData = []; // 聚合依据数据
      const { fieldType, fieldSum, id, fieldSelect } = record || {};

      // 字段显示样式是年月日的 字段显示参数设置为 yyyy-MM-DD
      if (fieldType === 'dateYMD') {
        record.fieldUnit = 'yyyy-MM-DD';
        mergeData = uniqBy([...recordList, record], 'id');
      }

      // 金额和数字类型的合计逻辑处理
      if (fieldType !== 'digit' && fieldType !== 'money' && fieldSum === 1) {
        message.error('合计只支持金额和数字类型');
        for (const ele of mergeData) {
          if (ele.id === id) {
            ele.fieldSum = 0;
          }
        }
      }
      for (const ele of mergeData) {
        if (fieldSelect === 1 && ele.id === id && !ele.selectMode) {
          ele.selectMode = 'input';
        }
        if (ele.fieldType === 'text' && ele.selectMode === 'selectRange') {
          ele.selectMode = 'input';
          message.warn('“文本”类型不支持“范围查询”模式');
        }
        // 不是数字或金额类型，清空聚合依据和策略
        if (ele.fieldType !== 'digit' && ele.fieldType !== 'money') {
          ele.fieldAggregation = null;
          ele.fieldStrategy = null;

          // 金额和数字类型的合计逻辑处理
          // if (fieldSum === 1) {
          //   message.error('合计只支持金额和数字类型');
          //   if (ele.id === id) {
          //     ele.fieldSum = 0;
          //   }
          // }
        }
        // 存在行分组则取该项数据作为聚合依据的数据
        if (ele.fieldRow) {
          _fieldAggregationData.push({
            label: ele.fieldContent,
            value: ele.fieldName,
          });
        }
      }
      // 使用上一次聚合依据的数据来判断 当前选中的聚合依据和策略是否清空
      for (const ele of mergeData) {
        if (!_fieldAggregationData.some(({ value }) => value === ele.fieldAggregation)) {
          ele.fieldAggregation = null;
          ele.fieldStrategy = null;
        }
      }
      // 初始选中聚合依据时，给聚合策略赋予默认值 sum
      if (typeof aggregationIndex === 'number') {
        if (mergeData[aggregationIndex].fieldAggregation && !mergeData[aggregationIndex].fieldStrategy) {
          mergeData[aggregationIndex].fieldStrategy = 'sum';
        } else {
          mergeData[aggregationIndex].fieldStrategy = null;
        }
        setAggregationIndex('over');
      }
      setFieldNameArray(mergeData.map((ele) => ele.fieldName) || []);
      setFieldAggregationData(_fieldAggregationData);
    }
    onEditChange(mergeData, type);
  };

  return (
    <>
      <EditableProTable
        rowKey="id"
        className={styles['dy-table']}
        onHeaderRow={() => {
          return {
            // 添加表头吸顶
            style: {
              position: 'sticky',
              top: 0,
              zIndex: 99,
            },
          };
        }}
        columns={columns(syntacticType)}
        value={dataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          // 添加数据的默认选项
          record: () => ({
            id: cuid(),
            columnType: type === 'reportDetails' ? 1 : 2,
            fieldType: 'text',
            selectMode: 'input',
          }),
        }}
        controlled
        style={{
          margin: '8px 0',
          overflowY: 'hidden',
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          form: editForm,
          // 数据改变后的处理逻辑
          onValuesChange: debounceHandleValuesChange,
          onChange: setEditableRowKeys,
        }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          preserveSelectedRowKeys: false,
          onChange: (selectedId) => {
            if (selectedId) {
              setSelectedIds(selectedId);
            }
          },
        }}
        components={dragComponents}
        scroll={{ x: dataSource.length > 0 ? 'max-content' : 0 }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <div>
              <Link key="select" style={{ marginRight: 16 }} onClick={onCleanSelected}>
                取消选择
              </Link>

              <Popconfirm
                key="selectDel"
                title="确定要删除吗?"
                onConfirm={() => {
                  handleDelete(selectedRowKeys);
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
      <Drawer width={620} closable={false} placement="right" visible={visible} onClose={() => setVisible(false)}>
        {node}
      </Drawer>
    </>
  );
});

const OperationFormItem = (props: {
  value?: Record<string, boolean>;
  onChange?: (value: Record<string, boolean>) => void;
}) => {
  const { value, onChange } = props;
  const values = Object.keys(value ?? {}).filter((key) => value?.[key]);
  return (
    <Checkbox.Group
      options={[
        { label: '新增', value: 'insert' },
        { label: '编辑', value: 'update' },
        { label: '必填', value: 'must' },
      ]}
      value={values}
      onChange={(_value) => {
        let update = _value.includes('update');
        // 新增权限被勾选时，编辑权限也被勾选
        if (_value.includes('insert') && !values.includes('insert')) {
          update = true;
        }

        onChange?.({
          insert: _value.includes('insert'),
          update,
          must: _value.includes('must'),
        });
      }}
    />
  );
};

export default TabEditTable;
