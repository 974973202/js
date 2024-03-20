import React, { useState, useRef } from 'react';
import { FormInstance, message, Modal } from 'antd';
import CreateForm from './create-form';
import { add, update } from './service';

interface FormModelProps {
  /**
   * 向外提供 modalRef 方法
   */
  modalRef: ReturnType<typeof useRef>;
  isUpdate: boolean;
  /**
   * 请求表格数据接口
   */
  pageCode: string;
  /**
   * 增删改查接口
   */
  backCode: string;
  /**
   * 编辑方法回调
   */
  onUpdated?: () => void;
  /**
   * 新建方法回调
   */
  onCreated?: () => void;
  /**
   * 自定义高级表格内置Modal layout布局
   */
  formModalLayout?: Record<string, any>;
}

// 外部调用
export interface FormModalRef {
  /**
   * 打开弹框
   */
  open: () => void;
  /**
   * 关闭弹框
   */
  close: () => void;
  /**
   * 设置form表单的值
   */
  setFormValue: (value: any) => void;
}

/**
 * 通过配置生成新建数据的表单窗口；标准化增删改查接口；内置标准增删改查操作
 * @param props FormModelProps
 * @returns ReactNode
 */
const FormModal: React.FC<FormModelProps> = (props) => {
  const { isUpdate, backCode, pageCode, modalRef, onUpdated, onCreated, formModalLayout } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<FormInstance>();

  if (modalRef) {
    // 向外提供modalRef方法
    modalRef.current = {
      open: () => {
        setVisible(true);
      },
      close: () => {
        setVisible(false);
      },
      setFormValue: (value: any) => {
        setFormValue(value);
      },
    };
  }

  /**
   * 新建
   * @param fields 表格
   */
  const handleAdd = async (fields: any) => {
    const hide = message.loading('正在添加');
    try {
      const res = await add(
        {
          ...fields,
        },
        backCode,
      );
      if (res.success) {
        hide();
        message.success('添加成功');
        if (onCreated) {
          onCreated();
        }
        return true;
      }
      return false;
    } catch {
      hide();
      message.error('添加失败请重试');
      return false;
    }
  };

  /**
   * 更新
   * @param fields 参数
   */
  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在修改');
    try {
      const res = await update(
        {
          ...fields,
        },
        backCode,
      );
      if (res.success) {
        hide();
        message.success('修改成功');
        if (onUpdated) {
          onUpdated();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);

      hide();
      message.error('修改失败请重试');
      return false;
    }
  };

  return visible ? (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={isUpdate ? '编辑' : '新建'}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => {
        formRef?.current?.submit();
      }}
      confirmLoading={isSubmitting}
      centered // 垂直居中
    >
      <CreateForm
        onSubmit={async (value: any) => {
          let success = false;
          setIsSubmitting(true);
          success = await (isUpdate ? handleUpdate(value) : handleAdd(value));
          if (success) {
            setVisible(false);
            setFormValue({});
          }
          setIsSubmitting(false);
        }}
        onCancel={() => {
          setVisible(false);
          setFormValue({});
        }}
        values={formValue}
        isUpdate={isUpdate}
        pageCode={pageCode}
        formRef={formRef}
        formModalLayout={formModalLayout}
      />
    </Modal>
  ) : null;
};

export default FormModal;
