import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { Tree, Input, Typography, Dropdown, Menu, Button, Popconfirm, Tag } from 'antd';
import { treeToList } from '@cscs-fe/base-components';
import styles from '../index.less';
import { AddOutlined, MoreOutlined } from '@cscs-fe/icons';

interface TreeData {
  key: string;
  title: string | ReactNode;
  children?: TreeData[] | any;
  [key: string]: any;
}

const { Search } = Input;
const { Text } = Typography;

interface SearchTreeProps {
  placeholder?: string;
  treeDatas: TreeData[];
  onSelect?: (keys: React.Key[], info: any) => void;
  checkable?: boolean;
  defaultCheckedKeys?: React.Key[];
  checkedKeys?: React.Key[];
  onCheck?: (
    checked:
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        }
      | React.Key[],
  ) => void;
  styleTree?: Record<string, any>;
}

function SearchTree(props: SearchTreeProps) {
  const {
    placeholder = '',
    checkable = false,
    defaultCheckedKeys = [],
    checkedKeys = [],
    treeDatas,
    onSelect,
    onCheck,
    styleTree = {},
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const treeDataList = useMemo(() => {
    return treeToList(treeDatas);
  }, [treeDatas]);

  function operateTreeData(data: any) {
    if (data && data.length > 0) {
      for (const item of data) {
        item.titleReactElement = (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {item.title}
              {item.switch ? <Tag className="custom-noborder-tag-green">启用</Tag> : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    // setSelectedData(item);
                    // setCreateVisible(true);
                  }}
                  size="small"
                  type="link"
                  icon={<AddOutlined />}
                ></Button>
                <Dropdown
                  key="1"
                  // className="hiddenButton ml-sm"
                  overlay={
                    <Menu style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                      <Button
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          // form.setFieldsValue(item);
                          // setSelectedData(item);
                          // setEditVisible(true);
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        导出
                      </Button>
                      <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={(event: any) => {
                          event.stopPropagation();
                        }}
                        onCancel={(event: any) => {
                          event.stopPropagation();
                        }}
                      >
                        <Button
                          type="text"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    </Menu>
                  }
                >
                  {/* <MoreOutlined className={`${styles.buttonIcons}  ml-sm`} /> */}
                  <Button size="small" type="link" icon={<MoreOutlined />}></Button>
                </Dropdown>
              </div>
            </div>
          </div>
        );
        operateTreeData(item.children);
      }
    } else {
      return [];
    }
    return data;
  }

  const loop: (data: TreeData[]) => TreeData[] = useCallback(
    (data: TreeData[]) => {
      return data && data.length > 0
        ? data.map((item) => {
            item.replaceTitle = item.title;
            const index = (item.title as string).indexOf(searchValue);
            const beforeStr = (item.title as string).slice(0, Math.max(0, index));
            const afterStr = (item.title as string).slice(index + searchValue.length);
            const title =
              index > -1 ? (
                <span>
                  {beforeStr}
                  <Text type="danger">{searchValue}</Text>
                  {afterStr}
                </span>
              ) : (
                <span>{item.title}</span>
              );
            if (item.children) {
              return { ...item, title, key: item.key, children: loop(item.children) };
            }

            return {
              ...item,
              title,
              key: item.key,
            };
          })
        : [];
    },
    [searchValue],
  );

  const onExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  const onChange = (e: any) => {
    const { value } = e.target;
    const keys = treeDataList
      .map((item) => {
        if ((item.title as string).includes(value)) {
          return item.key;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(keys as string[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return (
    <div>
      <Search style={{ padding: '12px 24px 12px 24px' }} placeholder={placeholder} onChange={(e) => onChange(e)} />
      <%_ if(data.leftType === 'listData'){ _%>
      <Tree
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={operateTreeData(loop(treeDatas))}
        style={styleTree}
        fieldNames={{
          title: 'titleReactElement',
          key: 'key',
        }}
      />
      <%_ } else { _%>
      <Tree
        checkable={checkable}
        defaultCheckedKeys={defaultCheckedKeys}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        onCheck={onCheck}
        onExpand={(keys) => onExpand(keys)}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={operateTreeData(loop(treeDatas))}
        style={styleTree}
        className={styles.wrapperTree}
        fieldNames={{
          title: 'titleReactElement',
          key: 'key',
        }}
      />
      <%_ } _%>
    </div>
  );
}

export default SearchTree;
