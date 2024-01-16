/* eslint-disable complexity */
/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-09-09 10:44:03
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\preview-table.tsx
 * @Description: 动态页面预览页
 *
 */
import { Alert, Drawer } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import React, { useEffect, useState } from 'react';
import { ControlledEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import OnlineTable from '../../dynamic-table';
import { Link } from 'umi';
import { dynamicManagePreviewSave, previewQuerySql } from '../services';
import { SqlFields, SqlParams } from '../types';
import { cloneDeep, omit } from 'lodash-es';

interface PreviewOptions {
  columns?: (SqlFields | SqlParams)[];
  dataResource?: string;
  dynamicName?: string;
  dynamicSql?: string;
  params?: any;
  onSubmit?: number; // 点击查询的标识
}
interface PreviewOnlineTableProps<RecordType> {
  /**
   * @description: 获取动态页面名称回调，用于设置标签名
   */
  setTabName?: (name: string) => void;
  /**
   * @description: 点击表格数据跳转弹框 组件集合
   */
  LinkComponent?: { name: string; element: React.FC; width?: number }[];
  /**
   * @description: antd expandable
   */
  expandableConfig?: Array<{
    name: string;
    expandableParams: ExpandableConfig<RecordType> & {
      ExpandableComponent: React.FC;
    };
  }>;
  /**
   * @description: 聚合策略的扩展方法
   */
  expandStrategy?: (scopeData: any[], dataIndex: string, fieldStrategy?: string | null) => string | number;
  wrapped?: boolean; // 是否包裹在卡片中
  /**
   * 内置卡片弹框 搜索传参
   */
  modalParams?: Record<string, unknown>;
  previewOptions: PreviewOptions | undefined | null;
}

const PreviewOnlineTable: React.FC<PreviewOnlineTableProps<any>> = (props) => {
  // TODO LinkComponent
  const { LinkComponent, expandableConfig, expandStrategy, previewOptions } = props;
  const [sql, setSql] = useState('');
  const [sqlDrawerVisible, setSqlDrawerVisible] = useState(false);
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (previewOptions) {
      const data = cloneDeep(previewOptions);
      data.columns = data.columns?.map((i, index: number) => {
        if (i.columnType === 1) {
          // 用于后端排序
          i.sort = index;
        }
        if (i.fieldDataAuthority) {
          i.fieldDataAuthority = i.fieldDataAuthority.toString() || null;
        }
        if (Object.prototype.toString.call(i.id) === '[object String]') {
          // 新添加的数据删掉 自创建id
          return omit(i, ['id']);
        }
        return i;
      });

      dynamicManagePreviewSave(data as any)
        .then((res) => {
          if (res.success) {
            setId(res.data);
          }
          return res;
        })
        .catch((error) => {
          console.log('预览保存失败', error);
        });
    }
  }, [previewOptions]);

  const handleSearch = (params: Record<string, unknown>) => {
    if (id) {
      previewQuerySql(id, params)
        .then((res) => {
          if (res.success) {
            setSql(res.data?.sql);
          }
          return res;
        })
        .catch((error) => {
          console.error('预览查询失败', error);
        });
    }
  };

  return (
    <>
      <Alert
        message=""
        type="info"
        style={{ marginBottom: 16 }}
        action={
          <Link
            onClick={() => {
              setSqlDrawerVisible(true);
            }}
          >
            数据预览结果SQL
          </Link>
        }
      />
      {id ? (
        <OnlineTable
          id={id}
          LinkComponent={LinkComponent}
          expandableConfig={expandableConfig}
          expandStrategy={expandStrategy}
          wrapped={false}
          isPreview={true}
          onSearch={handleSearch}
        />
      ) : null}
      <Drawer
        width="50%"
        title="数据预览结果SQL"
        placement="right"
        open={sqlDrawerVisible}
        onClose={() => setSqlDrawerVisible(false)}
      >
        <ControlledEditor
          editorDidMount={(_: () => string, editor: monaco.editor.IStandaloneCodeEditor) => {
            editor.updateOptions({ readOnly: true });
          }}
          height="calc(100vh - 100px)"
          language="sql"
          value={sql}
          theme="dark-theme"
        />
      </Drawer>
    </>
  );
};

export default PreviewOnlineTable;
