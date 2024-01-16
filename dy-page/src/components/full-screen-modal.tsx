import React, { ReactElement, useState } from 'react';
import { ModalProps } from 'antd/es/modal';
import { Modal } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useConfigContext } from '@cscs-fe/base-components';

export interface InlineModalProps extends ModalProps {
  element?: ReactElement;
  fullScreen?: boolean;
  beforeOpen?: () => void;
  beforeClose?: () => void;
  children?: React.ReactNode;
  toggleScreen?: () => void;
}

function FullScreenModal(props: InlineModalProps) {
  const { fullScreen: FS = false, beforeOpen, beforeClose, onOk, onCancel, title, toggleScreen } = props;

  const [visible, setVisible] = useState<boolean>(!!props.visible || !!props.open);
  const [fullScreen, setFullScreen] = useState<boolean>(FS);
  const config = useConfigContext();

  // 显示模态框
  const showModalHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (beforeOpen) {
      beforeOpen();
    }
    handleModalVisible(true);
  };

  // 隐藏模态框
  const hideModalHandler = () => {
    if (beforeClose) {
      beforeClose();
    }
    handleModalVisible(false);
  };

  const handleModalVisible = (flag?: boolean) => {
    setVisible(!!flag);
  };

  const cancelHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (onCancel) {
      const ret: any = onCancel(e);
      if (ret instanceof Promise) {
        ret
          .then(() => {
            hideModalHandler();
            return;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        hideModalHandler();
      }
    } else {
      hideModalHandler();
    }
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
    toggleScreen?.();
  };

  const titleRender = () => {
    return (
      <>
        {title}
        <button
          type="button"
          className={`${config.prefixCls}-modal-close`}
          style={{ right: 42 }}
          onClick={toggleFullScreen}
        >
          <span className={`${config.prefixCls}-modal-close-x`}>
            {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </span>
        </button>
      </>
    );
  };

  const { children, element, ...rest } = props;

  return (
    <>
      {element && React.cloneElement(element, { onClick: showModalHandler })}
      <span onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}>
        <Modal
          {...rest}
          wrapClassName={`${fullScreen ? `${config.prefixCls}-modal-wrap-fullscreen` : ''} ${
            fullScreen && props.footer === null ? `${config.prefixCls}-modal-wrap-fullscreen-no-footer` : ''
          }`}
          title={titleRender()}
          visible={visible}
          centered
          onOk={onOk}
          onCancel={cancelHandler}
        >
          {children}
        </Modal>
      </span>
    </>
  );
}

export default FullScreenModal;
