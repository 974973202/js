import { Form, Modal, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { DyTableColumnsType } from '../dynamic-page-manage/types';
import { useRequest } from 'ahooks';
import { getDynamicManageDetail } from '../dynamic-page-manage/services';
import { CreateFormItem } from './form-builder';
import { insertDataToTable, updateDataToTable } from '../services';
import { FormFieldType } from '../enums';
import moment from 'moment';

interface CreateEditModalProps {
  id: number;
  isEdit: boolean;
  initialData?: any;
  columns: DyTableColumnsType[];
  onSuccess: () => void;
  onCancel: () => void;
}

function parserOptions(column: DyTableColumnsType) {
  if (column.fieldProps) {
    return column.fieldProps.options;
  }

  if (column.valueEnum?.fieldProps) {
    return column.valueEnum.fieldProps.options;
  }

  if (column.valueEnum) {
    const keys = Object.keys(column.valueEnum);
    return keys.map((key) => {
      return {
        label: column.valueEnum?.[key],
        value: key,
      };
    });
  }
}

/**
 * 转换表单数据
 * @param data
 */
function transformFormValuesToReqData(data: any, configs: any[]) {
  const newData: Record<string, any> = {};
  for (const config of configs) {
    const { fieldName, operateStyle } = config;
    let value = data[fieldName];
    // 日期类型需要转换
    if (
      (operateStyle === FormFieldType.DatePicker || operateStyle === FormFieldType.DateTimePicker) && // 判断是否是moment对象
      moment.isMoment(value)
    ) {
      value = value.format('YYYY-MM-DD HH:mm:ss');
    }
    // 多选类型需要转换逗号拼接
    if (operateStyle === FormFieldType.SelectMultiple || operateStyle === FormFieldType.TreeSelectMultiple) {
      value = value.join(',');
    }
    newData[fieldName] = value;
  }
  return newData;
}

/**
 * 转换原始数据类型到表单类型
 * @returns
 */
function transformDataToFormValues(data: any, configs: any[]) {
  const newData: Record<string, any> = {};
  for (const config of configs) {
    const fieldName = config.fieldName;
    let value = data[fieldName];
    // 日期类型需要转换
    if (config.operateStyle === FormFieldType.DatePicker || config.operateStyle === FormFieldType.DateTimePicker) {
      value = value ? moment(value) : undefined;
    }
    // 多选类型逗号分割转成数组
    if (
      config.operateStyle === FormFieldType.SelectMultiple ||
      config.operateStyle === FormFieldType.TreeSelectMultiple
    ) {
      value = value ? value.split(',') : [];
    }
    newData[fieldName] = value;
  }
  return newData;
}

const CreateEditModal: React.FC<CreateEditModalProps> = (props) => {
  const { isEdit, id, columns, initialData, onSuccess, onCancel } = props;
  const title = isEdit ? '编辑' : '新建';
  const [form] = Form.useForm();
  const [primaryKey, setPrimaryKey] = useState<string>('');

  const { data: detail } = useRequest(() => getDynamicManageDetail(id));

  const formItemConfigs = useMemo(() => {
    if (detail && columns?.length > 0) {
      let configs = detail.data?.columnField;

      if (configs.length !== columns.length) return [];

      configs = configs.map((config, index) => {
        const column = columns[index];
        if (column) {
          config.options = parserOptions(column);
        }
        return { ...config };
      });
      if (detail.data?.primaryKey) {
        setPrimaryKey(detail.data?.primaryKey);
      }
      return configs;
    }
    return [];
  }, [detail, columns]);

  useEffect(() => {
    if (initialData && formItemConfigs?.length > 0) {
      const values = transformDataToFormValues(initialData, formItemConfigs);
      form.setFieldsValue(values);
    }
  }, [initialData, formItemConfigs]);

  const update = (values: any) => {
    const primaryKeyValue = initialData[primaryKey];
    if (!primaryKeyValue && primaryKeyValue !== 0) {
      message.error('主键不存在');
      return;
    }

    let newValues = transformFormValuesToReqData(values, formItemConfigs);
    newValues = {
      ...newValues,
      id: primaryKeyValue,
    };
    updateDataToTable(id, newValues)
      .then((res) => {
        if (res.success) {
          message.success('编辑成功');
          onSuccess();
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const create = (values: any) => {
    const newValues = transformFormValuesToReqData(values, formItemConfigs);

    insertDataToTable(id, newValues)
      .then((res) => {
        if (res.success) {
          message.success('新建成功');
          onSuccess();
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        update(values);
      } else {
        create(values);
      }
    } catch {
      return;
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal title={title} width={600} open={true} onOk={handleOk} onCancel={handleCancel}>
      <Form
        labelCol={{
          flex: '150px',
        }}
        form={form}
      >
        {formItemConfigs.map((config) => {
          return <CreateFormItem mode={isEdit ? 'update' : 'insert'} key={config.fieldName} config={config} />;
        })}
      </Form>
    </Modal>
  );
};

export default CreateEditModal;
