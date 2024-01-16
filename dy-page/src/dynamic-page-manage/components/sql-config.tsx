/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-26 19:38:12
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\sql-config.tsx
 * @Description: sql编辑器组件
 *
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { autocompleteSqlKeywordsProvider, sqlFormatterProvider, themeDark } from '@cscs-fe/components/es/monaco';
import { ControlledEditor } from '@monaco-editor/react';
import { Button, Checkbox, Col, FormInstance, Input, message, Row, Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import * as monaco from 'monaco-editor';
import React, { useCallback, useEffect, useState } from 'react';

import { b64EncodeUnicode } from '../../utils';
import { parseSqlDynamicManage } from '../services';
import { SqlFields, SqlParams } from '../types';
import styles from './style.less';

const { TextArea } = Input;
const isChrome = window.navigator.userAgent.includes('Chrome');

interface SqlConfigProps {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  /**
   * @description: SQL value
   */
  value?: string;
  // /**
  //  * @description: 请求参数
  //  */
  // dataResource?: string;
  /**
   * @description: 获取请求参数
   */
  form?: FormInstance;
  /**
   * @description: sql变化的回调
   * @return {void}
   */
  onChange?: (source: string) => void;
  /**
   * @description: 父组件的回调
   * @return {void}
   */
  onAnalysisFinish: (inputColumns: SqlFields[], outputColumns: SqlParams[]) => void;
}

export const SqlConfig: React.FC<SqlConfigProps> = observer((props) => {
  const { value, form, onChange, onAnalysisFinish, editorRef } = props;

  const [isAnalyzing, setIsAnalyzing] = useState(false); // SQL button loading
  const [isReuse, setIsReuse] = useState(false); // 是否复用

  const handleEditorDidMount = useCallback((_: () => string, editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  }, []);

  /**
   * @description: sql解析数据
   */
  const analysisColumns = useCallback(() => {
    const isMaintainData = form?.getFieldValue('maintainData');
    const tableName = form?.getFieldValue('tableName');

    if (isMaintainData && !tableName) {
      message.error('请先输入数据库表名');
      return;
    }

    if (!value) {
      message.error('sql不能为空');
      return;
    }
    setIsAnalyzing(true);

    const sql = b64EncodeUnicode(value);

    parseSqlDynamicManage({
      dynamicSql: sql,
      ...form?.getFieldsValue(['syntacticType', 'dataResource', 'tableName']),
      isReuse: isReuse ? 1 : 0,
      maintainData: isMaintainData ? 1 : 0,
    })
      .then(({ data, errorMessage, success }) => {
        if (success) {
          const { fields, params } = data;
          // 解析数据传给父组件
          onAnalysisFinish(fields, params);
          message.success('解析成功');
        } else {
          console.error(errorMessage);
        }
        return true;
      })
      .finally(() => {
        setIsAnalyzing(false);
      })
      .catch((error) => console.error(error));
  }, [value, form, onAnalysisFinish, isReuse]);

  /**
   * @description: 编辑器初始化
   */
  useEffect(() => {
    monaco.languages.registerCompletionItemProvider('sql', autocompleteSqlKeywordsProvider);
    monaco.languages.registerDocumentFormattingEditProvider('sql', sqlFormatterProvider);
    monaco.editor.defineTheme('dark-theme', themeDark as any);
  }, []);

  return (
    <Row gutter={24}>
      <Col span={24}>
        <div className={styles['editor-wrapper']}>
          {isChrome ? (
            <ControlledEditor
              height="180px"
              language="sql"
              value={value}
              editorDidMount={handleEditorDidMount}
              onChange={(_, value) => {
                onChange?.(value || '');
              }}
              theme="dark-theme"
            />
          ) : (
            <TextArea rows={4} onChange={(e) => onChange?.(e.target.value)} value={value} />
          )}
        </div>
      </Col>
      <Col span={24}>
        <Button onClick={analysisColumns} style={{ margin: '24px 16px 0 0' }} type="primary" loading={isAnalyzing}>
          SQL解析
        </Button>
        <Checkbox checked={isReuse} onChange={(e) => setIsReuse(e.target.checked)}>
          字段配置复用
        </Checkbox>
        <Tooltip
          placement="top"
          title="勾选后，SQL解析出来的字段若和已有动态页面存在相同的字段，会将已有相同字段的最新配置回显出来。"
        >
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </Col>
    </Row>
  );
});
