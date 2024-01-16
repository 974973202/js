import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { treeToList } from '../shared/utils';

// 配合react-dnd 所需方法库
export { HTML5Backend } from 'react-dnd-html5-backend';
export { DndProvider };

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': any;
  // onSortEnd: (oldData: any, newData: any, dragIndex: number, hoverIndex: number) => void;
}

interface DragColumnProps {
  data: any[];
  onSortEnd?: (oldData: any, newData: any, dragIndex: number, hoverIndex: number) => void;
}

/**
 * react-dnd 表格拖拽排序
 * @param props DragColumnProps
 * @returns TableComponents
 */
function DragColumn(props: DragColumnProps) {
  const { data, onSortEnd } = props;
  const [treeList, setTreeList] = useState(treeToList(data));

  useEffect(() => {
    // 处理树形表格数据
    const listData = treeToList(data);
    setTreeList(listData);
  }, [data]);

  /**
   * 拖拽方法
   * @param props DraggableBodyRowProps
   * @returns ReactNode
   */
  const DraggableBodyRow = (props: DraggableBodyRowProps) => {
    const { className, style, ...restProps } = props;
    const ref = useRef<HTMLTableRowElement>(null);

    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: 'DraggableBodyRow',
      collect: (monitor) => {
        const { key } = monitor.getItem() || {};
        if (key === props['data-row-key']) {
          return {};
        }
        const newIndex = treeList.findIndex((x: any) => x.key === props['data-row-key']);
        const oldIndex = treeList.findIndex((x: any) => x.key === key);
        return {
          isOver: monitor.isOver(),
          dropClassName: oldIndex < newIndex ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      // 放下回调
      drop: (item: { key: number }) => {
        const newIndex = treeList.findIndex((x: any) => x.key === props['data-row-key']);
        const oldIndex = treeList.findIndex((x: any) => x.key === item.key);
        if (oldIndex !== newIndex && onSortEnd) {
          onSortEnd(treeList[oldIndex], treeList[newIndex], oldIndex, newIndex);
        }
      },
    });

    // 点击拖动
    const [, drag] = useDrag({
      type: 'DraggableBodyRow',
      item: { key: props['data-row-key'] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drop(drag(ref));

    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
        {...restProps}
      />
    );
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  return { components: components };
}

export default DragColumn;
