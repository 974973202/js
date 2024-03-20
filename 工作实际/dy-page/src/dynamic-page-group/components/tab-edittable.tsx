/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-06-29 20:36:08
 * @FilePath: \amt-frontend\packages\components\src\sys-config\dynamic-page-group\components\tab-edittable.tsx
 * @Description: 动态页面组合编辑/新建 可编辑表格
 *
 */
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { useRequest } from 'ahooks';
import { FormInstance, Select, Checkbox, Input, Typography, Popconfirm } from 'antd';
import cuid from 'cuid';
import React, { useEffect, useState, useImperativeHandle } from 'react';

import { useForm } from 'antd/lib/form/Form';
import DragColumn from '../../dynamic-page-manage/components/drag-column';
import {
  getDynamicManage, // 获取动态页面管理的列表接口 -》
} from '../../dynamic-page-manage/services';
import request from 'umi-request';

const { Option } = Select;
const { Link } = Typography;

// tab标题和分组
const groupType = [
  { label: '卡片', value: 'card' },
  { label: '标签页', value: 'tabs' },
];

const requiredTitle = (text: string) => (
  <div>
    <span style={{ color: 'red' }}>*</span>
    {text}
  </div>
);

interface RefProps {
  setValue: (params: any) => void;
}

interface Props {
  onEditChange: (dataSource: any[]) => void;
  setState: (data: any[]) => void;
  dataSource: any[];
  ref: React.MutableRefObject<FormInstance | undefined>;
  groupStyle: string;
  menuData?: Array<{ value: string; label: string }>;
  key?: any;
}

const CustomSelect: React.FC<{
  value?: number;
  onChange?: (value: number) => void;
  options: { label: string; value: any }[];
}> = ({ value, onChange, options }) => {
  const _options = [...options];
  return (
    <Select placeholder="请选择" onChange={onChange} value={value}>
      {_options.map((i, index) => (
        <Option key={index} value={i.value}>
          {i.label}
        </Option>
      ))}
    </Select>
  );
};

const CustomCheckbox: React.FC<{
  value?: number;
  type?: string;
  dynamicType?: string;
  onChange?: (e: number) => void;
}> = ({ value, onChange = () => {}, dynamicType, type }) => {
  if (type === 'y' && dynamicType !== 'dy') {
    return <Checkbox disabled checked={value === 1} />;
  }
  return <Checkbox checked={value === 1 ? true : false} onChange={() => onChange(value === 1 ? 0 : 1)} />;
};

const TabEditTable = React.forwardRef<RefProps, Props>((props, ref) => {
  const { onEditChange, dataSource = [], setState, groupStyle, menuData } = props;
  const [editForm] = useForm();

  const [editableKeys, setEditableRowKeys] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [i, setI] = useState<string | number | undefined>('over'); // 判断是否清空dynamicId

  const { components: dragComponents } = DragColumn({
    data: dataSource,
    onSortEnd: setState,
  });

  useEffect(() => {
    if (dataSource.length > 0) {
      setEditableRowKeys(dataSource.map((item) => item.id));
    }
  }, [dataSource]);

  useImperativeHandle(ref, () => ({
    setValue: (data) => {
      editForm.setFieldsValue(data);
    },
  }));

  const { data: dynamicManage, loading } = useRequest(
    () => {
      return getDynamicManage({
        current: 1,
        pageSize: 1000,
      });
    },
    {
      formatResult: (response: any) => {
        return response?.data;
      },
    },
  );

  const { run, fetches } = useRequest(
    (id) => {
      return request(`/page/system/dynamic/page/manage/functionalForTitle/${id}`);
    },
    {
      formatResult: (res) => {
        if (Array.isArray(res?.data)) {
          return res?.data.map((ele: any) => ({
            label: ele.title,
            value: ele.dataIndex,
          }));
        }
        return [];
      },
      fetchKey: (id) => id,
      manual: true,
    },
  );

  const columns: ProColumns[] = [
    {
      title: requiredTitle('组合子页面'),
      width: 100,
      dataIndex: 'dynamicType',
      initialValue: 'dy',
      renderFormItem: (_) => {
        return (
          <Select
            onChange={() => {
              setI(_.index); // 记录索引
            }}
            placeholder="请选择"
          >
            <Option key={1} value="dy">
              动态页面
            </Option>
            <Option key={2} value="menu">
              菜单
            </Option>
            {/* <Option key={3} value="address">
              页面地址
            </Option> */}
          </Select>
        );
      },
    },
    {
      dataIndex: 'dynamicId',
      key: 'dynamicId',
      width: 200,
      renderFormItem: (_, { record: { dynamicType } }) => {
        if (dynamicType === 'dy') {
          return (
            <Select
              fieldNames={{ value: 'id', label: 'dynamicName' }}
              placeholder="请选择"
              optionFilterProp="label"
              options={dynamicManage}
              showSearch
            />
          );
        }
        if (dynamicType === 'menu') {
          return (
            <Select
              fieldNames={{ value: 'menu_id' }}
              placeholder="请选择"
              optionFilterProp="label"
              options={menuData}
              showSearch
            />
          );
        }
        return <Input />;
      },
    },
    {
      title: '显示子页面',
      dataIndex: 'isDisplay',
      key: 'isDisplay',
      valueType: 'checkbox',
      initialValue: 1,
      width: 100,
      renderFormItem: () => <CustomCheckbox />,
    },
    {
      title: '显示查询条件',
      dataIndex: 'conditionDisplay',
      key: 'conditionDisplay',
      valueType: 'checkbox',
      initialValue: 0,
      width: 100,
      renderFormItem: (_, { record: { dynamicType } }) => <CustomCheckbox type="y" dynamicType={dynamicType} />,
    },
    {
      title: '组合查询条件',
      dataIndex: 'conditionPublic',
      key: 'conditionPublic',
      width: 250,
      renderFormItem: (_, { record }) => {
        const { dynamicType, dynamicId } = record;
        if (dynamicId && dynamicType === 'dy' && !fetches?.[dynamicId]) {
          run(dynamicId);
        }
        return (
          <Select
            mode="multiple"
            showSearch={true}
            allowClear
            options={fetches?.[dynamicId]?.data || []}
            disabled={dynamicType !== 'dy'}
            placeholder="请选择"
          />
        );
      },
    },
    {
      title: groupStyle === 'tab' ? requiredTitle('Tab标题/分组') : 'Tab标题/分组',
      dataIndex: 'groupType',
      key: 'groupType',
      width: 120,
      renderFormItem: () => {
        return <Input style={{ margin: '8px 0' }} placeholder="请输入" />;
      },
    },
    {
      title: '页面展示风格',
      dataIndex: 'groupDisplayStyle',
      key: 'groupDisplayStyle',
      width: 120,
      initialValue: 'card',
      valueType: 'select',
      renderFormItem: () => {
        return <CustomSelect options={groupType} />;
      },
    },
  ];

  const handleDelete = (selectedRows: any[]) => {
    const restData = dataSource.filter((ele) => !selectedRows.includes(ele.id)) || dataSource;
    onEditChange(restData);
    setSelectedIds([]);
  };

  return (
    <EditableProTable<any>
      size="large"
      rowKey="id"
      columns={columns}
      value={dataSource}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        record: () => ({
          id: cuid(),
        }),
      }}
      style={{ overflowY: 'hidden' }}
      controlled
      editable={{
        type: 'multiple',
        editableKeys,
        form: editForm,
        onValuesChange: (record, recordList) => {
          for (const ele of recordList) {
            // dynamicTypeExt和dynamicId同步
            ele.dynamicTypeExt = ele.dynamicId;

            if (record?.groupType && ele.groupType === record?.groupType) {
              ele.groupDisplayStyle = record?.groupDisplayStyle;
            }
            // “显示查询条件”列，仅在“页面类型”选择“动态页面”时，可以进行勾选，其他“页面类型”时，为禁选状态。
            if (ele.dynamicType !== 'dy') {
              ele.conditionDisplay = 0; // 显示查询条件 值置为0
              ele.conditionPublic = []; // 公共查询条件清空
            }
          }
          // 切换页面类型，清空页面类型对应的值
          if (typeof i === 'number') {
            recordList[i].dynamicId = null;
            recordList[i].dynamicTypeExt = null;
            setI('over');
          }
          onEditChange(recordList);
        },
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
      onRow={(_, index) => {
        const attr = {
          index,
        };
        return attr as React.HTMLAttributes<any>;
      }}
      scroll={{ x: dataSource.length > 0 ? 'max-content' : 0 }}
      tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
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
  );
});

export default TabEditTable;
