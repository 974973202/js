/**
 * 将column映射成对象形式
 * @param key 列的唯一标识，dataIndex或者key
 */
const getColumnKey = (key: any, parentKey: any) => {
  const result = Array.isArray(key) ? key.join('.') : key;
  return parentKey ? `${parentKey}-${result}` : result;
};

/**
 * 递归生成列的宽度映射对象
 * @param columns 表格的列
 * @param parentKey 父层级,有父层级的情况，会默认使用-隔开
 */
const flattenDeepGetColumnKey = (columns: any, parentKey?: any) => {
  return columns.reduce((size: any, column: any) => {
    let newSize = {
      ...size,
    };
    const dataIndex = column.dataIndex;
    const columnKey = getColumnKey(dataIndex || column.key, parentKey);
    // 支持dotPath
    if (typeof dataIndex === 'string' && /^([^.]+\.)+[^.]+$/.test(dataIndex)) {
      column.dataIndex = dataIndex.split('.');
    }
    if (Array.isArray(column.children) && column.children.length > 0) {
      const subSize = flattenDeepGetColumnKey(column.children, columnKey);
      newSize = {
        ...size,
        ...subSize,
      };
      // const widths = Object.values(subSize) as number[];
      // newSize[columnKey] = widths.reduce((sumWidth: number | undefined, width: number) => {
      //   if (sumWidth !== undefined && isNumber(width)) {
      //     return sumWidth + width;
      //   }
      //   return undefined;
      // }, 0);
    } else {
      newSize[columnKey] = column.width;
    }
    return newSize;
  }, {});
};

const flatDeepGetColumns = (
  columns: any,
  columnSize: any,
  handleResize: any,
  parentKey?: any,
  // eslint-disable-next-line max-params
) => {
  return columns?.map((col: any) => {
    const hasChildren = col.children && col.children.length > 0;
    const columnKey = getColumnKey(col.dataIndex || col.key, parentKey);
    const width = hasChildren ? undefined : columnSize[columnKey];
    return {
      ...col,
      width,
      onHeaderCell: () => {
        return {
          width,
          onResize: handleResize(columnKey),
        };
      },
      children: hasChildren ? flatDeepGetColumns(col.children, columnSize, handleResize, columnKey) : undefined,
    };
  });
};

export { flattenDeepGetColumnKey, flatDeepGetColumns };
