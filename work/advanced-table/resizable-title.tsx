import React from 'react';
import { Resizable } from 'react-resizable';
import { throttle } from 'throttle-debounce';

/**
 * 可伸缩表格列组件
 * @param props
 * @returns ReactNode
 */
const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={throttle(1000, onResize)}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default ResizableTitle;
