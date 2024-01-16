/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-19 18:06:24
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-07-27 09:04:49
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-group\components\groupModal.tsx
 * @Description: 动态页面组合 编辑/新建 弹框
 *
 */
import { message, Select, Form, Tabs, Col, Row, Input, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { omit } from 'lodash-es';
import React, { useState, useEffect, useRef } from 'react';

import {
  optionsDynamicGroup, // 新增 编辑
  getDynamicGroupMenuUrl, // 动态组合菜单路由
} from '../services';
import TabEditTable from './tab-edittable';
import FullScreenModal from '../../components/full-screen-modal';
import styles from './style.less';
import { useGroupInitData } from './custom-hooks';

const { TabPane } = Tabs;
const { Option } = Select;

interface CreateFormProps {
  // 取消回调
  onCancel: () => void;
  // 确认的回调
  onOk: () => void;
  // 编辑的id
  id?: number | null;
}

// 组合布局
const groupType = [
  { name: 'Tab布局', value: 'tab' },
  { name: '单列布局', value: 'solo' },
  { name: '双列布局', value: 'double' },
];

// 特殊符号处理
const containSpecial = new RegExp(/[\s#%&+/=?？]+/);

/**
 * @description: 动态页面组合 编辑/新建 弹框
 * @param {*} props
 */
const GroupModal: React.FC<CreateFormProps> = (props) => {
  const { onCancel, onOk, id } = props;
  const [form] = useForm();
  // 弹框loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const groupTableRef = useRef<any>();
  const [groupColumnData, setGroupColumnData] = useState<any[]>([]); // 组合配置
  const [groupStyle, setGroupStyle] = useState<string>('tab'); // 组合风格。只有"tab"才需要tab分组
  const { initialData, loading } = useGroupInitData(id); // 通过id请求的初始数据

  /**
   * @description: 初始化数据处理
   */
  useEffect(() => {
    if (!initialData) return;
    form.resetFields();
    form.setFieldsValue(initialData);

    setGroupStyle(initialData.groupStyle);
    // 处理公共查询条件回显
    for (const ele of initialData.column || []) {
      ele.conditionPublic = typeof ele.conditionPublic === 'string' ? ele.conditionPublic.split(',') : [];
    }
    setGroupColumnData(initialData.column || []);
  }, [initialData]);

  /**
   * @description: 动态组合菜单路由
   * @return {*}
   */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDynamicGroupMenuUrl();
        setMenuData(data);
      } catch (error: any) {
        throw new Error(error);
      }
    })();
  }, []);

  /**
   * @description: 新建/编辑
   * @param {any} data
   * @param {string} method
   */
  const create = (data: any, method: string) => {
    optionsDynamicGroup(data, method)
      .then((res) => {
        if (res.success) {
          message.success(method === 'POST' ? '新建成功' : '修改成功');
          if (onOk) {
            onOk();
          }
          return true;
        }
        return false;
      })
      .finally(() => {
        setIsSubmitting(false);
      })
      .catch((error) => console.error(error));
  };

  /**
   * @description: 确认
   */
  const onSubmit = async () => {
    for (const ele of groupColumnData) {
      if (!!ele.dynamicId === false) {
        return message.error('请选择组合子页面');
      }
      if (groupStyle === 'tab' && !!ele.groupType === false) {
        return message.error('请输入Tab标题/分组');
      }
    }
    if (groupColumnData?.length === 0) {
      return message.error('请添加组合配置');
    }
    form
      .validateFields()
      .then((res) => {
        const data = {
          ...res,
          columns: groupColumnData,
        };
        // 通过id判断新建还是编辑
        if (id) {
          data.columns = data.columns.map((i: any, index: number) => {
            i.sort = index;
            i.conditionPublic = i?.conditionPublic?.toString() || null;
            if (Object.prototype.toString.call(i.id) === '[object String]') {
              return omit(i, ['id']);
            }
            return i;
          });
          data.id = id;
          create(data, 'PUT');
        } else {
          data.columns = data.columns.map((i: any, index: number) => {
            i.sort = index;
            i.conditionPublic = i?.conditionPublic?.toString() || null;
            return omit(i, ['id']);
          });
          create(data, 'POST');
        }
        return;
      })
      .catch((error) => console.error(error));
  };

  return (
    <FullScreenModal
      destroyOnClose
      title={id ? '编辑' : '新建'}
      visible={true}
      onCancel={() => onCancel()}
      onOk={onSubmit}
      maskClosable={false}
      width="90%"
      confirmLoading={isSubmitting}
      fullScreen={true}
    >
      <Form
        className="login-form"
        labelCol={{
          flex: '80px',
        }}
        wrapperCol={{
          flex: 1,
        }}
        initialValues={initialData}
        form={form}
        onValuesChange={(value) => {
          if (value['groupStyle']) {
            setGroupStyle(value['groupStyle']);
          }
        }}
      >
        <Row gutter={24}>
          <Col span={8} key={0}>
            <Form.Item
              name="groupName"
              label="组合名称"
              style={{
                flexWrap: 'nowrap',
              }}
              rules={[
                {
                  required: true,
                  message: '请输入组合名称',
                },
                () => ({
                  validator(_, value) {
                    if (value && containSpecial.test(value)) {
                      return Promise.reject(new Error('名称中不能包含空格及特殊字符：+=/?%#&'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8} key={2}>
            <Form.Item
              name="groupStyle"
              label="组合布局"
              style={{
                flexWrap: 'nowrap',
              }}
              initialValue="tab"
            >
              <Select>
                {groupType?.map((i, index) => (
                  <Option value={i.value} key={index}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <Spin />
      ) : (
        <Tabs className={styles['edit-tab']} defaultActiveKey="1">
          <TabPane tab="组合配置" key="1">
            <TabEditTable
              onEditChange={(columns) => setGroupColumnData(columns)}
              setState={setGroupColumnData}
              dataSource={groupColumnData}
              ref={groupTableRef}
              groupStyle={groupStyle}
              menuData={menuData}
            />
          </TabPane>
        </Tabs>
      )}
    </FullScreenModal>
  );
};

export default GroupModal;
