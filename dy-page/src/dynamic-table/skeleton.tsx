import React from 'react';
import LeftBarFilter from './leftbar-filter';
import { DyTableColumnsType } from '../dynamic-page-manage/types';
import { FoldColumnsGrid } from '@cscs-fe/base-components';
import { Card } from 'antd';
import { useModel } from 'umi';
import { SelectMode } from './enum';
import { SUPPORTED_MODE_LIST } from './constants';

interface DynamicTableSkeletonProps {
  wrapped: boolean;
  title: React.ReactNode;
  leftBarTitle?: string;
  leftBarWidth?: string;
  columns: DyTableColumnsType[];
  onLeftBarFilterParamsChange: (params: Record<string, any>, reload: boolean) => void;
  leftBarFilterParams?: Record<string, any>;
}

const leftBarDefaultWidth = '260px';

const DynamicTableSkeleton: React.FC<DynamicTableSkeletonProps> = (props) => {
  const {
    wrapped,
    title,
    leftBarTitle,
    columns,
    leftBarWidth,
    onLeftBarFilterParamsChange,
    leftBarFilterParams,
    children,
  } = props;
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState.config.tabNavPosition;
  const showLeftBar = columns.some((i) => {
    const supported = SUPPORTED_MODE_LIST.includes(i.selectMode as SelectMode);
    return i.showInLeftBar && supported;
  });

  if (showLeftBar) {
    return (
      <FoldColumnsGrid
        flexWidth={leftBarWidth ?? leftBarDefaultWidth}
        LeftComponent={
          <LeftBarFilter
            title={leftBarTitle}
            onParamsChange={onLeftBarFilterParamsChange}
            columns={columns}
            params={leftBarFilterParams}
          />
        }
        RightComponent={
          <Card
            bodyStyle={{
              padding: '1px 0 0 0',
              height: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 178px)',
              overflow: 'auto',
            }}
            bordered={false}
            title={title}
          >
            {children}
          </Card>
        }
      />
    );
  }

  return wrapped ? (
    <div className="px-lg py-md">
      <Card
        bodyStyle={{
          padding: '1px 0 0 0',
          minHeight: tabNavPosition === 'header' ? 'calc(100vh - 138px)' : 'calc(100vh - 178px)',
        }}
        bordered={false}
        title={title}
      >
        {children}
      </Card>
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default DynamicTableSkeleton;
