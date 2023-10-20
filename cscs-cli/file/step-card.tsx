import { Button, Card, Col, Input, PageHeader, Row, Spin, Steps } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';

const { Step } = Steps;

const First = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    getValidateForm,
  }));

  const getValidateForm = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  };

  return <>计算新报告</>;
});

function <%= data.name %>() {
  const { initialState } = useModel('@@initialState'); // 全局数据
  const tabNavPosition = initialState?.config?.tabNavPosition;

  const stepsRef = useRef<{
    getValidateForm: () => Promise<any>;
  }>(null);

  const [spinning, setSpinning] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);

  const stepTitle = ['计算新报告', '数据采集', '数据处理', '结果汇总', '完成'];
  const steps = [
    {
      title: '计算新报告',
      key: 0,
      content: <First ref={stepsRef} />,
    },
    {
      title: '数据采集',
      key: 1,
      content: <div>数据采集</div>,
    },
    {
      title: '数据处理',
      key: 2,
      content: <div>数据处理</div>,
    },
    {
      title: '结果汇总',
      key: 3,
      content: <div>结果汇总</div>,
    },
    {
      title: '完成',
      key: 4,
      content: <div>完成</div>,
    },
  ];

  /** 下一步 */
  const onNext = async () => {
    switch (current) {
      case 0:
        setSpinning(true);
        if (await stepsRef.current?.getValidateForm()) {
          setSpinning(false);
          setCurrent(current + 1);
        }
        break;
      case 1:
        setCurrent(current + 1);
        break;
      case 2:
        break;
      default:
        return;
    }
  };

  /** 上一步 */
  const onPrev = () => {
    setCurrent(current - 1);
  };

  /** 完成 */
  const onAccomplish = () => {};

  return (
    <Spin spinning={spinning}>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <PageHeader title="模型构建">
          <Row align="middle" justify="space-between">
            <Col span={19}>
              {/* 步骤条 */}
              <Steps current={current} style={{ padding: '16px 24px' }}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Col>
            <Col span={5}>
              {/* 按钮 */}
              <div style={{ float: 'right' }}>
                {current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={onPrev}>
                    上一步
                  </Button>
                )}
                {current < stepTitle.length - 1 && (
                  <Button type="primary" onClick={onNext}>
                    下一步
                  </Button>
                )}
                {current === stepTitle.length - 1 && (
                  <Button type="primary" onClick={onAccomplish}>
                    完成
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </PageHeader>
      </Card>
      <div className="px-lg py-md">
        <Card
          bordered={false}
          bodyStyle={{
            padding: '1px 0 0 0',
            minHeight: tabNavPosition === 'header' ? 'calc(100vh - 210px)' : 'calc(100vh - 194px)',
            // minHeight: tabNavPosition === 'header' ? 'calc(100vh - 265px)' : 'calc(100vh - 249px)',
          }}
        >
          {steps.map((ele, index) => (
            // 使用 这种写法是为了方便缓存数据
            <div style={{ display: steps[current].key === index ? 'block' : 'none' }}>{ele.content}</div>
          ))}
        </Card>
      </div>
    </Spin>
  );
}

export default <%= data.name %>;