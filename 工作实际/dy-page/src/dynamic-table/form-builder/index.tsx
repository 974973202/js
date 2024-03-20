import React from 'react';
import { Form, Input, TreeSelect, Select, DatePicker, FormRule } from 'antd';
import { FormItemConfig } from './types';
import { FormFieldType } from '../../enums';
import { DefaultOptionType } from 'antd/lib/select';

interface CreateInputProps {
  disabled?: boolean;
  placeholder?: string;
}

export const CreateFormItem: React.FC<{
  config: FormItemConfig;
  mode: 'insert' | 'update';
}> = (props) => {
  const { config, mode } = props;
  const { fieldName, operateStyle, fieldContent, options, fieldOperate, columnConfig } = config;

  const disabled = false;
  const rules: FormRule[] = [];
  let formItemInner;
  let operateConfig: {
    insert?: boolean;
    update?: boolean;
    must?: boolean;
  } = {};
  let columnConfigRules: FormRule[] = [];

  // 解析字段操作配置，如果解析失败则忽略
  try {
    operateConfig = JSON.parse(fieldOperate || '{}');
    const _columnConfig = JSON.parse(columnConfig);
    columnConfigRules = _columnConfig?.form?.rules;
  } catch (error) {
    console.error(error);
  }

  const enableInsert = operateConfig?.insert;
  const enableUpdate = operateConfig?.update;
  const required = operateConfig?.must;

  // 新建不显示
  if (mode === 'insert' && !enableInsert) {
    return null;
  }

  // 编辑不显示
  if (mode === 'update' && !enableUpdate) {
    return null;
  }

  // 优先使用字段配置的规则
  if (columnConfigRules?.length > 0) {
    rules.push(...columnConfigRules);
  } else {
    if (required) {
      rules.push({
        required: true,
        message: `${fieldContent}不能为空`,
      });
    }
  }

  if (operateStyle === FormFieldType.Input) {
    formItemInner = createInput({
      disabled,
    });
  }

  if (operateStyle === FormFieldType.Select) {
    formItemInner = createSelect({
      disabled,
      multiple: false,
      options,
    });
  }

  if (operateStyle === FormFieldType.TreeSelect) {
    formItemInner = createTreeSelect({
      disabled,
      multiple: false,
      treeData: options,
    });
  }

  if (operateStyle === FormFieldType.DatePicker) {
    formItemInner = createDatePicker({
      disabled,
      showTime: false,
    });
  }

  if (operateStyle === FormFieldType.DateTimePicker) {
    formItemInner = createDatePicker({
      disabled,
      showTime: true,
    });
  }

  if (operateStyle === FormFieldType.SelectMultiple) {
    formItemInner = createSelect({
      disabled,
      multiple: true,
      options,
    });
  }

  if (operateStyle === FormFieldType.TreeSelectMultiple) {
    formItemInner = createTreeSelect({
      disabled,
      multiple: true,
      treeData: options,
    });
  }

  if (!formItemInner) {
    return null;
  }

  return (
    <Form.Item label={fieldContent} name={fieldName} rules={rules}>
      {formItemInner}
    </Form.Item>
  );
};

function createInput(props: CreateInputProps) {
  const { disabled, placeholder = '请输入' } = props;
  return <Input placeholder={placeholder} disabled={disabled} />;
}

export function createSelect(props: { disabled?: boolean; multiple?: boolean; placeholder?: string; options: any[] }) {
  const { disabled, multiple, placeholder = '请选择', options } = props;

  return (
    <Select
      placeholder={placeholder}
      allowClear
      disabled={disabled}
      getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      options={options}
      mode={multiple ? 'multiple' : undefined}
    />
  );
}

function createTreeSelect(props: { disabled?: boolean; multiple: boolean; treeData: DefaultOptionType[] }) {
  const { disabled = false, treeData, multiple } = props;
  return (
    <TreeSelect
      dropdownStyle={{
        maxHeight: 600,
        overflow: 'auto',
      }}
      treeNodeFilterProp="title"
      showSearch
      disabled={disabled}
      treeData={treeData}
      multiple={multiple}
    />
  );
}

function createDatePicker(props: { disabled?: boolean; showTime?: boolean }) {
  const { disabled = false, showTime = false } = props;
  return <DatePicker disabled={disabled} showTime={showTime} />;
}
