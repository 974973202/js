import React, { useState } from 'react';
import { InputNumber } from 'antd';

/**
 * 表格自定义数字 百分比 金额类型的范围查询组件
 * @param props ColumnsType
 * @returns ReactNode
 */
const InputCompact: React.FC<any> = (props) => {
  const { value, valueType, fieldUnit, ...rest } = props;

  // 内部最小值修改
  const [minNumber, setMinNumber] = useState<number | string | null>(value?.[0] || null);
  // 内部最大值修改
  const [maxNumber, setMaxNumber] = useState<number | string | null>(value?.[1] || null);

  return (
    <div style={{ display: 'flex' }}>
      <InputNumber
        placeholder="请输入"
        {...rest}
        onChange={(val: number | string | null) => {
          setMinNumber(val);
          if (val === null && maxNumber === null) {
            props?.onChange([]);
          } else {
            props?.onChange([val, maxNumber]);
          }
        }}
        addonBefore={valueType === 'money' ? fieldUnit || '￥' : null}
        addonAfter={valueType === 'percent' ? '%' : null}
        value={value?.[0] || null}
      />
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#d9d9d9', margin: '0 8px' }}
      >
        ~
      </div>
      <InputNumber
        placeholder="请输入"
        {...rest}
        onChange={(val: number | string | null) => {
          setMaxNumber(val);
          if (val === null && minNumber === null) {
            props?.onChange([]);
          } else {
            props.onChange([minNumber, val]);
          }
        }}
        addonBefore={valueType === 'money' ? fieldUnit || '￥' : null}
        addonAfter={valueType === 'percent' ? '%' : null}
        value={value?.[1] || null}
      />
    </div>
  );
};

export default InputCompact;
