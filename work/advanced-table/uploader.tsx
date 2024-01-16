import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Typography, Upload, UploadProps } from 'antd';
import { ActionType } from '@ant-design/pro-table';
import React, { useState } from 'react';
import { downloadBlob } from '../shared/utils';
import { AuthService } from '../services';
import { downloadTemplate } from './service';
import { useConfigContext } from '../shared/config-provider';

interface UploaderProps {
  backCode: string | undefined;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}

/**
 * 导入组件
 * @param props UploaderProps
 * @returns ReactNode
 */
export const Uploader: React.FC<UploaderProps> = (props) => {
  const { backCode, actionRef } = props;
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const config = useConfigContext();

  const tokenData = AuthService.getToken();
  const token = `${tokenData?.token_type} ${tokenData?.token}`;
  const uploadConfig: UploadProps = {
    maxCount: 1,
    showUploadList: true,
    name: 'file',
    action: `${backCode}/import`,
    // accept: '.xlsx',
    data: {},
    headers: {
      Authorization: token,
    },
    // beforeUpload(file, fileList) {
    //   const type = file?.name?.endsWith('.xlsx');
    //   if(!type) {
    //     return Promise.reject()
    //   }
    //   return Promise.resolve()
    // },
    onChange(ret) {
      const file = ret.file;
      if (file.status === 'uploading') {
        setUploading(true);
      }
      if (file.status === 'error') {
        message.error('导入失败');
        setUploading(false);
      }
      if (file.status === 'done') {
        const data = file.response?.data;
        if (data?.success) {
          const { success, failed } = data;
          if (failed === 0) {
            Modal.success({
              content: `${success}条数据导入成功`,
            });
          } else {
            Modal.error({
              content: `${success}条数据导入成功，${failed}条数据导入失败`,
            });
          }
          actionRef?.current?.reload();
        } else {
          message.error('导入失败');
        }
        setUploading(false);
      }
    },
  };

  const handleCancel = () => {
    if (!uploading) {
      setVisible(false);
    } else {
      message.warn('正在上传文件请勿关闭窗口');
    }
  };

  const open = () => {
    setVisible(true);
  };

  /**
   * 下载模板
   */
  const download = () => {
    const fileName = backCode?.replace(/\//g, '_');
    if (fileName) {
      downloadTemplate(fileName)
        .then((res) => {
          const { response, data } = res;
          if (data.size > 0) {
            const match = response.headers.get('content-disposition')?.match(/filename="?([^"]*)"?;?/);
            downloadBlob(match ? match[1] : '导入模板', data);
            return true;
          } else {
            message.error('文件不存在');
            return false;
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Button type="primary" onClick={open}>
        导入
      </Button>
      <Modal title="导入" visible={visible} onCancel={handleCancel} footer={false} destroyOnClose>
        <Upload.Dragger {...uploadConfig} disabled={uploading}>
          <p className={`${config.prefixCls}-upload-drag-icon`}>
            <InboxOutlined />
          </p>
          <p className={`${config.prefixCls}-upload-text`}>点击或者拖动文件到这里上传</p>
        </Upload.Dragger>

        <div style={{ paddingTop: '12px' }}>
          <Typography.Link onClick={download} target="_blank">
            下载导入模板
          </Typography.Link>
        </div>
      </Modal>
    </>
  );
};
