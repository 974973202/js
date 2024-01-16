import { ParamsType } from '@ant-design/pro-provider';
import ProTable from '@ant-design/pro-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ResizableTitle from './resizable-title';
import { InnerTableProps } from './typing';
import { flatDeepGetColumns, flattenDeepGetColumnKey } from './utils';
import './table.less';

// 剔除 hideInTable 为 true 的数据
const delHideInTableColumns = (columns: any) =>
  columns.filter((item: any) => {
    if (item?.chilCdren?.length > 0) {
      delHideInTableColumns(item?.chilCdren);
    }
    return !item.hideInTable;
  });

/**
 * 高级表格 更快 更好 更方便
 * @param props InnerTableProps<T, U>
 */
const InnerTable = <T extends Record<string, any>, U extends ParamsType = ParamsType>(props: InnerTableProps<T, U>) => {
  const {
    columns,
    resizeable,
    scroll,
    size,
    calcResizeWidthFinish,
    onSizeChange = (size) => {
      setCurSize(size);
    },
    ...restProps
  } = props;
  let tableProps: any = {
    columns,
    scroll,
  };
  const data = flattenDeepGetColumnKey(delHideInTableColumns(columns));
  const [columnSize, setColumnSize] = useState(data);
  const [curSize, setCurSize] = useState(size);

  useEffect(() => {
    // 表头拖拽调整列宽 columns有width  但是没在columnSize中
    if (
      calcResizeWidthFinish &&
      Object.values(data).filter((e) => e).length === Object.values(data).length &&
      !Object.values(columnSize)?.[1]
    ) {
      setColumnSize(data);
    }
  }, [data]);

  // 调整表格表头列宽计算
  const scrollX = useMemo(() => {
    let total = 0;
    if (columnSize && Object.keys(columnSize).length > 0) {
      total = Object.keys(columnSize)
        .map((key: string) => {
          if (columnSize[key]) {
            return columnSize[key];
          }
          return 0;
        })
        .reduce((total: number, num: number) => {
          return total + num;
        });
    }

    // 120是buffer
    return total + 120;
  }, [columnSize]);

  const handleResize = useCallback(
    (key) =>
      (e: any, { size }: any) => {
        setColumnSize({
          ...columnSize,
          [key]: size.width,
        });
      },
    [columnSize],
  );

  // 可伸缩表头的配置项
  if (resizeable || calcResizeWidthFinish) {
    tableProps = {
      ...tableProps,
      tableLayout: 'fixed',
      scroll: {
        scrollToFirstRowOnChange: true,
        ...scroll,
        x: scrollX,
      },
      bordered: true,
      components: {
        header: {
          cell: ResizableTitle,
        },
      },
      columns: flatDeepGetColumns(columns, columnSize, handleResize),
    };
  }

  return <ProTable<T, U> {...restProps} {...tableProps} size={curSize} onSizeChange={onSizeChange} />;
};

export default InnerTable;
