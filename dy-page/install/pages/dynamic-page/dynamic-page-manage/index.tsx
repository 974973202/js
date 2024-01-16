import { expandableConfig } from '@/pages/dynamic-table-components';
import { KeepAliveLayout } from '@/shared';
import { DynamicPageManage } from '@cscs-fe/dynamic-page';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';

const DynamicPageManagePage: React.FC = () => {
  return (
    <KeepAliveLayout>
      <ConfigProvider prefixCls="cscs" locale={zhCN}>
        <DynamicPageManage pageCode="menu:config:page_manage" expandableConfig={expandableConfig} />
      </ConfigProvider>
    </KeepAliveLayout>
  );
};

export default DynamicPageManagePage;
