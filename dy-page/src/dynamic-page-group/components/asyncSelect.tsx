import { Select, SelectProps } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

type AsyncSelectProps = Omit<SelectProps<any>, 'options'> & {
  loadOptions?: any;
  dynamicManageData: any[];
};

const defaultPlaceholder = '请选择';

export const AsyncSelect: React.FC<AsyncSelectProps> = (props) => {
  const { dynamicManageData = [], placeholder, allowClear = true, ...restProps } = props;
  const [realOptions, setRealOptions] = useState<any[]>([]);

  useEffect(() => {
    if (dynamicManageData.length > 0) {
      setRealOptions(
        dynamicManageData.map((d) => (
          <Option value={d.id} key={d.id}>
            {d.dynamicName}
          </Option>
        )),
      );
    }
  }, [dynamicManageData]);

  return (
    <Select {...restProps} placeholder={placeholder || defaultPlaceholder} allowClear={allowClear}>
      {realOptions}
    </Select>
  );
};

export default AsyncSelect;
