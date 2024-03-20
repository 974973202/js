/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-07-26 17:37:25
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 10:28:33
 * @FilePath: \amt-frontend\packages\dynamic-page\install\pages\dynamic-page\dynamic-page-group\index-table.tsx
 * @Description:
 *
 */
import { expandableConfig, LinkComponent } from '@/pages/dynamic-table-components';
import { KeepAliveLayout } from '@/shared';
import { DynamicGroupTable } from '@cscs-fe/dynamic-page';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React, { useRef, useState } from 'react';
import { useParams } from 'umi';

const DynamicIndexTablePage: React.FC = () => {
  const params = useParams();
  const keepAliveRef = useRef<any>(null);

  return (
    <KeepAliveLayout id={params.id} refs={keepAliveRef}>
      <ConfigProvider prefixCls="cscs" locale={zhCN}>
        <DynamicGroupTable
          id={params.id}
          setTabName={(name: string) => keepAliveRef.current?.setCurrentTabName(name)}
          LinkComponent={LinkComponent}
          expandableConfig={expandableConfig}
        />
      </ConfigProvider>
    </KeepAliveLayout>
  );
};

export default DynamicIndexTablePage;
