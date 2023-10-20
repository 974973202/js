import { EditableProTable, ProColumns } from "@ant-design/pro-table";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { to } from "@credit-risk/components";
import { getList } from "../services";
import cuid from "cuid";

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

function AllEtable(props: Props) {
  const { id } = props;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>();

  const handleGetList = async (id: string) => {
    const [, { success, data }] = await to(getList(id));
    if (success) {
      setDataSource(data);
      setEditableRowKeys(data.map((ele: { id: any }) => ele.id));
    }
  };

  useEffect(() => {
    if (id) {
      handleGetList(id);
    }
  }, [id]);

  const columns: ProColumns<DataSourceType>[] = [
    { dataIndex: "id", title: "id", editable: false },
    {
      title: "名称",
      dataIndex: "name",
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
      title: "性别",
      dataIndex: "gender",
      valueType: "select",
      valueEnum: {
        男: "男",
        女: "女",
        火星人: "火星人",
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "操作",
      valueType: "option",
      width: 80,
      render: () => {
        return null;
      },
    },
  ];

  return (
    <EditableProTable<DataSourceType>
      columns={columns}
      rowKey="id"
      scroll={{
        x: "max-content",
      }}
      cardProps={{
        bodyStyle: {
          marginTop: 0,
        },
      }}
      value={dataSource}
      recordCreatorProps={{
        newRecordType: "dataSource",
        record: () => ({
          id: cuid(),
        }),
      }}
      toolBarRender={() => {
        return [
          <Button
            type="primary"
            key="save"
            onClick={() => {
              // dataSource 就是当前数据，可以调用 api 将其保存
              console.log(dataSource);
            }}
          >
            保存数据
          </Button>,
        ];
      }}
      editable={{
        type: "multiple",
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          setDataSource(recordList);
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
}

export default AllEtable;
