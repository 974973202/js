import { Card, Tree, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

import { DyTableColumnsType } from '../dynamic-page-manage/types';
import { SelectMode } from './enum';
import styles from './leftbar-filter.less';
import { SUPPORTED_MODE_LIST } from './constants';
import { useDebounceFn } from 'ahooks';

interface LeftBarFilterProps {
  columns: DyTableColumnsType[];
  title?: string;
  params?: Record<string, any>;
  onParamsChange?: (params: Record<string, any>, reload: boolean) => void;
}

const LeftBarFilter: React.FC<LeftBarFilterProps> = (props) => {
  const { columns, title, params, onParamsChange } = props;
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const { initialState } = useModel('@@initialState'); // 全局数据

  // 过滤掉不支持的模式
  const filteredColumns = columns.filter((i) => {
    const supported = SUPPORTED_MODE_LIST.includes(i.selectMode as SelectMode);
    return i.showInLeftBar && supported;
  });

  const cardTitle = title ?? (filteredColumns.length === 1 ? filteredColumns[0].title : null); // 单个tab时，使用column的title

  // 设置卡片高度
  const tabNavPosition = initialState.config.tabNavPosition;
  const cardTitleHeight = cardTitle ? 56 : 0;
  const height =
    tabNavPosition === 'header'
      ? `calc(100vh - 82px - ${cardTitleHeight}px )`
      : `calc(100vh - 82px - 40px - ${cardTitleHeight}px)`;
  const isShowTabs = filteredColumns.length > 1;

  useEffect(() => {
    const params: Record<string, any> = {};
    for (const column of filteredColumns) {
      if (column.initialValue !== undefined) {
        params[column.dataIndex] = column.initialValue;
      }
    }
    if (onParamsChange) {
      onParamsChange(params, true);
    }
  }, [columns]);

  const { run: onChange } = useDebounceFn(
    (value: any, dataIndex: string) => {
      const column = columns.find((i) => i.dataIndex === dataIndex);
      let reload = column?.selectMode === SelectMode.SelectRadio || column?.selectMode === SelectMode.TreeSelect;
      const showInLeftBar = column?.showInLeftBar ?? {};
      if (showInLeftBar.reloadOnChange !== undefined) {
        reload = showInLeftBar.reloadOnChange;
      }

      // console.log('param', value, 'dataIndex', dataIndex);

      if (onParamsChange) {
        onParamsChange({ ...params, [dataIndex]: value }, reload);
      }
    },
    {
      wait: 500,
    },
  );

  const switchTo = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Card
      title={cardTitle}
      bordered={false}
      bodyStyle={{
        padding: 0,
        height,
        overflowY: 'hidden',
      }}
    >
      {isShowTabs ? (
        <div className={styles.tabs}>
          {filteredColumns.map((i, index) => {
            return (
              <div className={styles.tab} key={index}>
                {index === currentIndex ? (
                  <Typography.Link onClick={() => switchTo(index)}>{i.title}</Typography.Link>
                ) : (
                  <Typography.Text onClick={() => switchTo(index)}>{i.title}</Typography.Text>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
      <div
        className={styles.filters}
        style={{
          height: isShowTabs ? 'calc(100% - 48px)' : '100%',
        }}
      >
        {filteredColumns.map((i, index) => {
          // 树形单选
          if (i.selectMode === SelectMode.TreeSelect) {
            const treeData = i.fieldProps?.options;
            const dataIndex = i.dataIndex;
            const initialValue = i.initialValue;
            return (
              <div key={index} hidden={currentIndex !== index}>
                <Tree
                  treeData={treeData}
                  fieldNames={{
                    key: 'value',
                  }}
                  onSelect={(selectedKeys) => onChange(selectedKeys[0], dataIndex)}
                  defaultSelectedKeys={initialValue ? [initialValue] : []}
                />
              </div>
            );
          }

          // 树形多选
          if (i.selectMode === SelectMode.TreeSelectCheckout) {
            const treeData = i.fieldProps?.options;
            const dataIndex = i.dataIndex;
            const initialValue = i.initialValue;
            return (
              <div key={index} hidden={currentIndex !== index}>
                <Tree
                  checkable
                  treeData={treeData}
                  fieldNames={{
                    key: 'value',
                  }}
                  onCheck={(checked) => onChange(checked, dataIndex)}
                  defaultCheckedKeys={initialValue ?? []}
                />
              </div>
            );
          }

          // 单选
          if (i.selectMode === SelectMode.SelectRadio) {
            const treeData = i.fieldProps?.options;
            const dataIndex = i.dataIndex;
            const initialValue = i.initialValue;
            return (
              <div key={index} hidden={currentIndex !== index} className={styles['select-radio-wrapper']}>
                <Tree
                  treeData={treeData}
                  fieldNames={{
                    title: 'label',
                    key: 'value',
                  }}
                  onSelect={(selectedKeys) => onChange(selectedKeys[0], dataIndex)}
                  defaultSelectedKeys={initialValue ? [initialValue] : []}
                />
              </div>
            );
          }

          // 多选
          if (i.selectMode === SelectMode.SelectCheckout) {
            const treeData = i.fieldProps?.options;
            const dataIndex = i.dataIndex;
            const initialValue = i.initialValue;
            return (
              <div key={index} hidden={currentIndex !== index} className={styles['select-checkable-wrapper']}>
                <Tree
                  checkable
                  fieldNames={{
                    title: 'label',
                    key: 'value',
                  }}
                  treeData={treeData}
                  onCheck={(checked) => onChange(checked, dataIndex)}
                  defaultCheckedKeys={initialValue ?? []}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </Card>
  );
};

export default LeftBarFilter;
