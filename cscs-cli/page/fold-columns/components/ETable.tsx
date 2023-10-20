import React, { useRef, useState } from "react";
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from "@ant-design/pro-table";
import { getList, del, _post, add } from "../services";
import { message, Popconfirm, Select, Typography } from "antd";
import { to } from "@credit-risk/components";
import cuid from "cuid";

const { Link } = Typography;

type DataSourceType = {
  id: number | string;
  name?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: number;
};

interface Props {
  id: string;
}

function ETable(props: Props) {
  const { id } = props;
  const actionRef = useRef<ActionType | any>();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<DataSourceType>[] = [
    { dataIndex: "id", title: "id", editable: false },
    {
      dataIndex: "name",
      title: "名称",
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      dataIndex: "age",
      title: "年龄",
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      dataIndex: "gender",
      title: "性别",
      width: 120,
      renderFormItem: () => (
        <Select
          style={{ width: 120 }}
          options={[
            { label: "男", value: "男" },
            { label: "女", value: "女" },
            { label: "火星人", value: "火星人" },
          ]}
        />
      ),
    },
    { dataIndex: "email", title: "邮箱" },
    { dataIndex: "phone", title: "手机号", hideInSearch: true },
    {
      title: "操作",
      valueType: "option",
      fixed: "right",
      width: 96,
      render: (text, record, index, action) => {
        return [
          <Link
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </Link>,
          <Popconfirm
            key="selectDel"
            title="确定要删除吗?"
            onConfirm={async () => {
              const [, { success }] = await to(del(record.id as number));
              if (success) {
                actionRef.current?.reload();
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <Link key="delete" type="danger">
              删除
            </Link>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <EditableProTable<DataSourceType>
      rowKey="id"
      actionRef={actionRef}
      scroll={{
        x: "max-content",
      }}
      cardProps={{
        bodyStyle: {
          marginTop: 0,
        },
      }}
      recordCreatorProps={{
        record: () => ({ id: cuid() }),
      }}
      columns={columns}
      request={getList}
      params={{
        id,
      }}
      editable={{
        type: "multiple",
        editableKeys,
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row);

          let result = [];
          if (data.id && typeof data.id === "number") {
            result = await to(_post(data));
          } else {
            result = await to(add(data));
          }
          const [error, { success, errorMessage }] = result;
          if (error) return message.error(error.message);
          if (success) {
            message.success(errorMessage);
            actionRef.current?.reload();
          }
        },
        actionRender: (row, config, defaultDom) => [
          defaultDom.save,
          defaultDom.cancel,
        ],
        onChange: setEditableRowKeys,
      }}
    />
  );
}

export default ETable;
