/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-07-26 17:37:25
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 10:29:11
 * @FilePath: \amt-frontend\packages\dynamic-page\install\pages\dynamic-page\dynamic-page-group\index.tsx
 * @Description:
 *
 */
import { KeepAliveLayout } from '@/shared';
import { DynamicPageGroup } from '@cscs-fe/dynamic-page';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';

const DynamicPageManagePage: React.FC = () => {
  return (
    <KeepAliveLayout>
      <ConfigProvider prefixCls="cscs" locale={zhCN}>
        <DynamicPageGroup pageCode="menu:config:page_group" />
      </ConfigProvider>
    </KeepAliveLayout>
  );
};

export default DynamicPageManagePage;
