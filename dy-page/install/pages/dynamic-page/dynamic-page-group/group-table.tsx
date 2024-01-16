/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-02-01 15:02:44
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-03-21 15:25:29
 * @FilePath: \cscs-fe\packages\components\install\pages\framework\sys-config\dynamic-page-group\group-table.tsx
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

const DynamicGroupTablePage: React.FC = () => {
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

export default DynamicGroupTablePage;
