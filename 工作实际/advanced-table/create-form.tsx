import React, { useState } from 'react';
import { Form, FormInstance, Input } from 'antd';
import { useRequest } from 'ahooks';
import { queryCreateFormConfig } from '../services/common';
import { CreateFormItem, FormItemConfig } from '../easy-form';
import { encrypt } from '../shared/utils';

interface CreateFormProps {
  /**
   * 确认按钮回调
   */
  onSubmit: (values: any) => void;
  /**
   * 取消按钮回调
   */
  onCancel: () => void;
  /**
   * 传入values值
   */
  values: any;
  /**
   * 用于判断是否需要密码加密
   */
  isUpdate: boolean;
  /**
   * 请求表格数据接口
   */
  pageCode?: string | undefined;
  /**
   * 提供表格内部 FormInstance
   */
  formRef: React.MutableRefObject<FormInstance | undefined>;
  /**
   * 传入的表单配置
   */
  formConfig?: FormItemConfig[];
  /**
   * 自定义高级表格内置Modal layout布局
   */
  formModalLayout?: Record<string, any>;
}

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

/**
 * 通过配置生成新建数据的表单窗口；标准化增删改查接口；内置标准增删改查操作
 * @param CreateFormProps
 * @returns ReactNode
 */
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {
    onSubmit: handleUpdate,
    values,
    pageCode,
    formRef,
    isUpdate,
    formConfig: inputFormConfig,
    formModalLayout,
  } = props;
  const [form] = Form.useForm();
  const [validEncryptedItems, setValidEncryptedItems] = useState<Record<string, any>>({});

  let finalFormConfigs: FormItemConfig[] = [];

  if (formRef) {
    formRef.current = form;
  }
  let formItems: any[] = [];

  /**
   * 接口请求的form表单配置
   */
  const { data: formConfigs } = useRequest(
    () => {
      return pageCode ? queryCreateFormConfig(pageCode) : Promise.resolve(null);
    },
    {
      formatResult: (response: any) => {
        if (response) {
          const data = response?.data;
          for (const i of data) {
            i.rules = JSON.parse(i.rules);
            i.formItemType = JSON.parse(i.formItemType);
          }
          return data as FormItemConfig[];
        } else {
          return [];
        }
      },
    },
  );

  if (!pageCode && !inputFormConfig) {
    return null;
  }

  if (pageCode && formConfigs) {
    finalFormConfigs = formConfigs;
  } else if (inputFormConfig) {
    finalFormConfigs = inputFormConfig;
  } else {
    finalFormConfigs = [];
  }

  formItems = finalFormConfigs.map((config) => {
    // 处理密码是否加密
    if (config.formItemType.type === 'encryptedPwd' && isUpdate) {
      return validEncryptedItems[config.dataIndex] ? (
        <CreateFormItem config={config} key={config.dataIndex} disabled={isUpdate && !config.mutable} />
      ) : (
        <Form.Item label={config.title}>
          <Input
            onFocus={() =>
              setValidEncryptedItems({
                ...validEncryptedItems,
                [config.dataIndex]: true,
              })
            }
            placeholder="点击修改密码"
          />
        </Form.Item>
      );
    } else {
      return <CreateFormItem config={config} key={config.dataIndex} disabled={isUpdate && !config.mutable} />;
    }
  });

  /**
   * 确认/保存逻辑处理
   * @param formValues
   */
  const handleFinish = (formValues: Record<string, any>) => {
    const encryptedKeys: string[] =
      formConfigs?.filter((i) => i.formItemType.type === 'encryptedPwd').map((i) => i.dataIndex) || [];

    const finalFormValues = { ...formValues };
    for (const key of encryptedKeys) {
      finalFormValues[key] = validEncryptedItems[key] || !isUpdate ? encrypt(finalFormValues[key]) : null;
    }

    handleUpdate({
      id: values.id,
      ...finalFormValues,
    });
  };

  if (isUpdate) {
    for (const i of finalFormConfigs) {
      if (i.formItemType?.type === 'encryptedPwd') {
        values[i.dataIndex] = null;
      }
    }
  }

  const formLayout = formModalLayout ? formModalLayout : layout;

  return formItems.length > 0 ? (
    <Form
      name="basic"
      {...formLayout}
      form={form}
      initialValues={{
        ...values,
      }}
      onFinish={handleFinish}
    >
      {formItems}
    </Form>
  ) : null;
};

export default CreateForm;
