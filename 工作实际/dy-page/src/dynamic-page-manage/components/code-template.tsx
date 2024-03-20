/**
 * @description: 动态页面出码
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
export const codeTemplate = (id: string | number, name: string) => {
  return `import React from 'react';
import { Card } from 'antd';
import { EnhanceDyTable } from '@cscs-fe/dynamic-page';

function EnhanceDyTableTemplate() {
  return (
    <Card
      bodyStyle={{
        padding: '1px 0 0 0',
      }}
      title="${name}"
      bordered={false}
    >
    <EnhanceDyTable
      id="${id}"
      customDealColumns={(data) => {
        // 动态页面columns表头属性，可以添加columns属性，尽量不要修改已有配置，可在动态页面明细配置里修改已有配置
        // 动态页面columns表头属性可参考:
        // ant proTable: https://procomponents.ant.design/components/table#columns-列定义
        // ant table:  https://ant.design/components/table-cn/#Column
        return data;
      }}
      // request 查询的额外参数，一旦变化会触发重新加载，涉及导出、排序、合计等接口传参
      requestParams={{}}
      customDealdataSource={(data) => {
        // 动态页面接口返回表格data数据
        return data;
      }}
      // 自定义请求表格data接口
      customFunctionalForDataUrl=""
      // 自定义请求columns表头接口，返回的数据格式需参考原来接口
      customFunctionalForTitle=""
      // 点击表格数据跳转弹框 组件集合。类似于查看详情，可获取当前行数据
      // 类型：{ name: string; element: React.FC; width: number }[]
      LinkComponent={[]}

      // 其他参数配置参考框架超级表格：AdvancedTable  类型：AdvancedTableProps
      // ...
    />
    </Card>
  );
}

export default EnhanceDyTableTemplate;
`;
};
