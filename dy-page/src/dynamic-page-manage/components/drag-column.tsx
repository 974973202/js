/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-04-07 11:16:14
 * @FilePath: \cscs-fe\packages\components\src\sys-config\dynamic-page-manage\components\drag-column.tsx
 * @Description: 可拖拽表格
 *
 */
import { MenuOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const CusSortableItem = SortableElement((props: any) => <tr {...props} style={{ cursor: 'move' }} />);
const CusSortableContainer = SortableContainer((props: any) => <tbody {...props} />);

let listData: any[] = []; // 非受控 拖拽排序使用的data数据

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

interface DragColumnProps {
  data: any[];
  onSortEnd?: (newData: any) => void;
}

function DragColumn(props: DragColumnProps) {
  const { onSortEnd, data } = props;
  listData = data;

  const onSort = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex && onSortEnd) {
      const DragColumnData = [...listData];
      const startIndex = oldIndex < 0 ? DragColumnData.length + oldIndex : oldIndex;
      if (startIndex >= 0 && startIndex < DragColumnData.length) {
        const endIndex = newIndex < 0 ? DragColumnData.length + newIndex : newIndex;

        const [item] = DragColumnData.splice(oldIndex, 1);
        DragColumnData.splice(endIndex, 0, item);
        // 拖拽清空索引间的聚合依据和聚合策略
        const [start, end] = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
        for (const [index, value] of DragColumnData.entries()) {
          if (index >= start && index <= end) {
            value.fieldAggregation = null;
            value.fieldStrategy = null;
          }
        }
      }
      onSortEnd(DragColumnData);
    }
  };

  const DraggableContainer = useCallback(
    (props: any) => (
      <CusSortableContainer
        helperClass="row-dragging-item"
        distance={5}
        onSortEnd={({ oldIndex, newIndex }: any) => onSort(oldIndex, newIndex)}
        {...props}
      />
    ),
    [],
  );

  const DraggableBodyRow = useCallback((props: any) => {
    const index = listData.findIndex((x: any) => x.id === props['data-row-key']);
    return <CusSortableItem index={index} {...props} />;
  }, []);

  const components = {
    body: {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
    },
  };
  return { components: components };
}

export { DragHandle };
export default DragColumn;
