import { Form, Drawer, Input } from 'antd';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { ControlledEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { InformationOutlined } from '@cscs-fe/icons';

const jsCodeTemplate = `(function () {
  function idOnChange(utils, value, options) {
    const len = utils.finalColumns.length;
    if(len > 1) {
      utils.setFinalColumns(utils.finalColumns.slice(0, len - 1))
    } else {
      utils.setFinalColumns(utils.original.finalColumns)
    }
  }
  function handleTableChange(utils, pagination, filters, sorter, extra) {
    console.log('排序参数', pagination, filters, sorter, extra);
  }
  function handleSubmit(utils, submitParams) {
    console.log('点击查询', submitParams);
  }
  function handleReset(utils) {
    console.log('点击重置');
  }
  function handleTableApi(utils) {
    return {
      footer: () => 'Here is footer',
    };
  }
  return {
    idOnChange,
    handleTableChange,
    handleSubmit,
    handleReset,
    handleTableApi,
  };
})();`;

const isChrome = window.navigator.userAgent.includes('Chrome');
const { TextArea } = Input;

function JSEditor(props: any) {
  const { value, onChange, handleEditorDidMount } = props;

  return (
    <ControlledEditor
      height="500px"
      editorDidMount={handleEditorDidMount}
      language="javascript"
      value={value}
      onChange={(_, value) => {
        onChange?.(value || '');
      }}
      theme="dark"
    />
  );
}

interface CodeProps {
  jsScript: string;
  setJsScript: (data: string) => void;
  jsEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
}

export interface CodeRef {
  getJsScript: () => string;
}

/**
 * @description: JS增强
 * @return {*}
 */
const CodeEnhance = React.forwardRef<CodeRef, CodeProps>((props, ref) => {
  const { jsScript, setJsScript, jsEditorRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false); // 抽屉展示的 数据

  /**
   * @description: 表格配置回显数据处理
   */
  useEffect(() => {
    if (jsScript) {
      form.setFieldsValue({ jsScript });
    }
    // 用于切换tab的时候存值避免频繁set，并非  保存 的最终值
    // 保存最终值 jsCodeRef.current?.getJsScript
    return () => {
      const jscodeData = form.getFieldValue('jsScript');
      setJsScript(jscodeData);
    };
  }, [jsScript]);

  const handleEditorDidMount = useCallback((_: () => string, editor: monaco.editor.IStandaloneCodeEditor) => {
    jsEditorRef.current = editor;
  }, []);

  /**
   * @description: 提供给父组件调用的函数方法
   * @param {*} ref
   * @return {*}
   */
  useImperativeHandle(ref, () => ({
    getJsScript: () => form.getFieldValue('jsScript'),
  }));

  return (
    <Form form={form}>
      <Form.Item
        label={
          <>
            JS增强
            <InformationOutlined
              title="点击查看"
              onClick={() => setVisible(true)}
              style={{ marginLeft: 4, opacity: 0.45 }}
            />
          </>
        }
        name="jsScript"
      >
        {isChrome ? <JSEditor handleEditorDidMount={handleEditorDidMount} /> : <TextArea rows={4} />}
      </Form.Item>

      <Drawer width={620} closable={false} placement="right" visible={visible} onClose={() => setVisible(false)}>
        <div>
          <div>在线编写JS脚本，通过按钮触发事件、或绑定内置钩子函数来触发JS代码。</div>
          <div>
            JS模板：
            <ControlledEditor
              editorDidMount={(_: () => string, editor: monaco.editor.IStandaloneCodeEditor) => {
                // 设置为只读模式
                editor.updateOptions({ readOnly: true });
              }}
              height="600px"
              language="javascript"
              value={jsCodeTemplate}
              theme="dark"
            />
          </div>
          <div>每个函数方法都会注入 utils，属性如下：</div>
          <div>获取url参数：utils.urlParams</div>
          <div>获取表格数据：utils.dataSource，设置表格数据：utils.setDataSource(data)</div>
          <div>获取表头数据：utils.finalColumns，设置表头数据：utils.setFinalColumns(columns)</div>
          <div>请求方法：utils.request，数据初始值：utils.original，...</div>
          <div>1、搜索项改变触发：字段 + OnChange，参数取决于搜索项使用的组件</div>
          <div>2、分页、排序、筛选变化时触发：handleTableChange</div>
          <div>3、点击查询触发：handleSubmit，参数为搜索项参数</div>
          <div>4、点击重置触发：handleReset</div>
          <div>5、表格Api：handleTableApi，返回值为对象</div>
          <div>
            <strong>需要返回定义的每一个函数方法</strong>
          </div>
        </div>
      </Drawer>
    </Form>
  );
});

export default CodeEnhance;
