import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useRequest } from 'ahooks';
import { queryCascadeData } from './service';

const TableSelect: React.FC<{
  state: {
    type: string;
    column: string;
    title: string;
  };
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { state, value, onChange } = props;
  const [selectValue, setSelectValue] = useState(value);
  const { type, column, title } = state || {};

  const { data, loading, run } = useRequest(() => queryCascadeData(type, column), {
    ready: type !== undefined && type !== null,
    manual: true,
    formatResult: (response: any) => {
      return response?.data;
    },
    onSuccess: () => {
      if (!data || data.length === 0) {
        setSelectValue('');
      }
    },
  });

  useEffect(() => {
    if (type && column) {
      run();
    } else {
      setSelectValue('');
    }
  }, [JSON.stringify(state)]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setSelectValue('');
    } else {
      setSelectValue(value);
    }
  }, [value]);

  return (
    <Select
      options={data || []}
      value={selectValue || null}
      onChange={onChange}
      loading={loading}
      disabled={!type}
      placeholder={!type ? `请先选择${title}` : ''}
    />
  );
};

export default TableSelect;
