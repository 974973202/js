import React, { useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { treeToList } from '../shared/utils';

const CusSortableItem = SortableElement((props: any) => <tr {...props} style={{ cursor: 'move' }} />);
const CusSortableContainer = SortableContainer((props: any) => <tbody {...props} />);

interface DragColumnProps {
  data: any[];
  onSortEnd?: (oldData: any, newData: any, oldIndex: number, newIndex: number) => void;
}

/**
 * react-sortable-hoc 表格拖拽排序
 * @param props DragColumnProps
 * @returns TableComponents
 */
function DragColumn(props: DragColumnProps) {
  const { onSortEnd, data } = props;
  const [treeList, setTreeList] = useState(treeToList(data));

  useEffect(() => {
    // 处理树形表格数据
    const listData = treeToList(data);
    setTreeList(listData);
  }, [data]);

  /**
   * 拖拽结束后回调
   * @param oldIndex number
   * @param newIndex number
   */
  const onSort = (oldIndex: number, newIndex: number) => {
    if (oldIndex !== newIndex && onSortEnd) {
      const oldData = treeList[oldIndex];
      const newData = treeList[newIndex];
      onSortEnd(oldData, newData, oldIndex, newIndex);
    }
  };

  /**
   * 拖拽内容主体
   * @param props
   * @returns ReactNode
   */
  const DraggableContainer = (props: any) => (
    <CusSortableContainer
      helperClass="row-dragging-item"
      distance={5}
      onSortEnd={({ oldIndex, newIndex }: any) => onSort(oldIndex, newIndex)}
      {...props}
    />
  );

  /**
   * 拖拽当前行
   * @param props
   * @returns ReactNode
   */
  const DraggableBodyRow = (props: any) => {
    const index = treeList.findIndex((x: any) => x.key === props['data-row-key']);
    return <CusSortableItem index={index} {...props} />;
  };

  const components = {
    body: {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
    },
  };
  return { components: components };
}

export default DragColumn;
