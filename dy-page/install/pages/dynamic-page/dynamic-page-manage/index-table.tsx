/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2023-02-13 10:51:46
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-04-19 10:04:55
 * @FilePath: \cscs-fe\packages\components\install\pages\framework\sys-config\dynamic-page-manage\index-table.tsx
 * @Description:
 *
 */
import { expandableConfig, expandStrategy, LinkComponent } from '@/pages/dynamic-table-components';
import { KeepAliveLayout } from '@/shared';
import { DynamicOnlineTable } from '@cscs-fe/dynamic-page';
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
        <DynamicOnlineTable
          id={params.id}
          setTabName={(name: string) => keepAliveRef.current?.setCurrentTabName(name)}
          LinkComponent={LinkComponent || []}
          expandableConfig={expandableConfig || []}
          expandStrategy={expandStrategy || null}
        />
      </ConfigProvider>
    </KeepAliveLayout>
  );
};

export default DynamicIndexTablePage;
