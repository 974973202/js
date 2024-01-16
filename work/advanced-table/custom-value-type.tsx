import React, { useState } from 'react';
import { InputNumber, Modal, Tooltip, TreeSelect, Typography, Input, Cascader, message } from 'antd';
import moment from 'moment';
import { isString } from 'lodash-es';
import dotProp from 'dot-prop';

import { visitTree } from '../shared/utils';
import InputCompact from './input-compact';
import { AdvancedColumns } from './typing';
import { getUrlLink } from './service';
import { MatchComponent, MatchComponentWidth } from './match-component';

export interface CustomUrlParams {
  text: string;
  finalUrl: string;
  column: any;
  record: any;
  onCancel?: () => void;
  textMaxLength?: number;
}

enum valueTypes {
  TEXT = 'text', // 文本类型
  DIGIT = 'digit', // 数字类型
  DATETIME = 'dateTime', // 时间类型
  DATE = 'date', // 日期类型
  MONEY = 'money', // 金额类型
  PERCENT = 'percent', // 百分比类型

  DATETIMERANGE = 'dateTimeRange', // 时间范围类型
  DATERANGE = 'dateRange', // 日期范围类型
}

enum selectModes {
  CASCADER = 'cascader', // 级联单选
  CASCADERCHECKOUT = 'cascaderCheckout', // 级联多选
  TREESELECT = 'treeSelect', // 下拉树单选
  TREESELECTCHECKOUT = 'treeSelectCheckout', // 下拉树多选
  SELECTRANGE = 'selectRange', // 范围查询
  INPUT = 'input', // 输入框 模糊查询
  EXACTINPUT = 'exactInput', // 输入框 精确查询
  INCLUDEINPUT = 'includeInput', // 包含查询 - 查询条件始终解析成文本输入框
}

const YMD = 'YYYY-MM-DD';
const YMDHms = 'YYYY-MM-DD HH:mm:ss';

const fnMap = new Map<string, (...params: any) => any>([
  [
    'nvl',
    function (value: any, defaultValue: any) {
      return value || defaultValue;
    },
  ],
]);

/**
 * 自定义表格展示
 * @param column 表格列表
 * @param textMaxLength 多少文本长度处理...
 * @param onCancel 弹框内点击跳转链接处理逻辑
 */
export function customValueType(
  column: AdvancedColumns,
  textMaxLength?: number,
  onCancel?: () => void,
  _dynamicClickParams?: () => any,
) {
  if (column.valueType === valueTypes.TEXT) {
    customTextRender(column, onCancel, _dynamicClickParams, textMaxLength);
  }
  if (column.valueType === valueTypes.DIGIT) {
    customDigitRender(column, onCancel, _dynamicClickParams);
  }
  if (
    column.valueType === valueTypes.DATETIME ||
    column.valueType === valueTypes.DATE ||
    column.valueType === valueTypes.DATETIMERANGE ||
    column.valueType === valueTypes.DATERANGE
  ) {
    customDateRender(column, onCancel, _dynamicClickParams);
  }
  if (column.valueType === valueTypes.MONEY) {
    customMoneyRender(column, onCancel, _dynamicClickParams);
  }
  if (column.valueType === valueTypes.PERCENT) {
    customPercentRender(column, onCancel, _dynamicClickParams);
  }

  // var valueTypeMap = new Map([
  //   [valueTypes.TEXT, customTextRender],
  //   [valueTypes.DIGIT, customDigitRender],
  //   [valueTypes.DATETIME, customDateRender],
  //   [valueTypes.DATE, customDateRender],
  //   [valueTypes.DATETIMERANGE, customDateRender],
  //   [valueTypes.DATERANGE, customDateRender],
  //   [valueTypes.MONEY, customMoneyRender],
  //   [valueTypes.PERCENT, customPercentRender],
  // ]);

  // if (column?.valueType) {
  //   valueTypeMap.get(column.valueType)(column, onCancel, _customClickLink, textMaxLength);
  // }
}

export function customRenderFormItem(column: AdvancedColumns) {
  const { selectMode, valueType, fieldProps, fieldUnit } = column || {};
  // 包含查询 - 查询条件始终解析成文本输入框
  if (selectMode === selectModes.INCLUDEINPUT) {
    column.renderFormItem = () => {
      return <Input {...fieldProps} />;
    };
  }
  if (selectMode === selectModes.TREESELECT || selectMode === selectModes.TREESELECTCHECKOUT) {
    const { options, onChange, ...props } = fieldProps || {};
    column.renderFormItem = () => {
      if (selectMode === selectModes.TREESELECTCHECKOUT) {
        return (
          <CustomTreeSelect
            allowClear
            placeholder="请选择"
            showCheckedStrategy="SHOW_ALL"
            treeNodeFilterProp="title"
            {...props}
            treeData={options || []}
            multiple
            treeCheckable
            onCustomChange={onChange}
          />
        );
      }
      return (
        <CustomTreeSelect
          placeholder="请选择"
          treeNodeFilterProp="title"
          allowClear
          showSearch
          {...props}
          treeData={options || []}
          onCustomChange={onChange}
        />
      );
    };
  }
  // 级联单选 & 级联多选
  if (
    valueType === valueTypes.TEXT &&
    (selectMode === selectModes.CASCADER || selectMode === selectModes.CASCADERCHECKOUT)
  ) {
    const { options, onChange, ...props } = fieldProps || {};
    const cascaderProps = {
      allowClear: true,
      fieldNames: {
        label: 'title',
        value: 'value',
        children: 'children',
      },
      expandTrigger: 'hover',
      ...props,
      options: options || [],
      showSearch: true,
    };
    column.renderFormItem = () => {
      // if (selectMode === selectModes.CASCADERCHECKOUT) {
      //   return <Cascader {...cascaderProps} multiple onCustomChange={onChange} />;
      // }
      // return <Cascader {...cascaderProps} onChange={onChange} />;
      if (selectMode === selectModes.CASCADERCHECKOUT) {
        return <CustomCascader {...cascaderProps} multiple onCustomChange={onChange} />;
      }
      return <CustomCascader {...cascaderProps} onCustomChange={onChange} />;
    };
  }
  if (
    (valueType === valueTypes.DIGIT || valueType === valueTypes.MONEY || valueType === valueTypes.PERCENT) &&
    selectMode === selectModes.SELECTRANGE
  ) {
    column.renderFormItem = () => {
      return <InputCompact {...fieldProps} valueType={valueType} fieldUnit={fieldUnit} />;
    };
  }
  if (
    valueType === valueTypes.MONEY &&
    (!selectMode || selectMode === selectModes.INPUT || selectMode === selectModes.EXACTINPUT)
  ) {
    column.renderFormItem = () => {
      return <InputNumber {...fieldProps} prefix={<span>{fieldUnit || '￥'}</span>} />;
    };
  }
}

function CustomCascader(props: any) {
  return (
    <Cascader
      {...props}
      onChange={(...arg) => {
        props?.onChange(...arg);
        props?.onCustomChange(...arg);
      }}
    />
  );
}

function CustomTreeSelect(props: any) {
  return (
    <TreeSelect
      {...props}
      onChange={(...arg) => {
        props?.onChange(...arg);
        props?.onCustomChange(...arg);
      }}
    />
  );
}

/**
 * 过滤对象为null的数据
 * @param obj
 * @returns
 */
function excludeNullFields(obj: Record<string, unknown>) {
  return Object.keys(obj).reduce(function (result: any, key) {
    if (obj[key] !== null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * 解析url上的参数为键值对形式
 */
function urlSearchParamsObj() {
  const query = window.location.search;
  const SearchParams = new URLSearchParams(query);
  return Object?.fromEntries(SearchParams?.entries()) || {};
}

/**
 * 表头超链接判断
 * @param column AdvancedColumns
 * @param record data
 * @returns string
 */
export const getFieldUrl = (column: AdvancedColumns, record: any) => {
  let url = column?.fieldUrl;
  url = url?.trim();

  // 解析js表达式，表达式格式为 {{xxx}}，
  // 正则匹配表达式
  if (url?.startsWith('{{') && url?.endsWith('}}')) {
    const expression = url.slice(2, -2);
    const variables = Object.keys(record);
    try {
      // eslint-disable-next-line no-new-func
      url = new Function(...variables, `return ${expression}`)(...variables.map((v) => record[v]));
    } catch (error) {
      console.error(`url 表达式解析错误 ${url}`, error);
      return '';
    }
  }

  if (url) {
    let finalUrl = url;
    // 不匹配 ${} #{}
    const expressionList = url.match(/(?<![#$]){[^{}]+}/g);

    const recordReal = excludeNullFields(record);
    const queryObj = urlSearchParamsObj();

    if (expressionList) {
      for (const expression of expressionList) {
        const value = parseExpression(expression, { ...queryObj, ...recordReal });
        // 如果没有值，url不合法，直接返回空
        if (value === undefined || value === null || value === '') {
          return '';
        }
        finalUrl = value ? finalUrl.replace(`${expression}`, value) : '';
      }
    }

    return finalUrl;
  } else {
    return '';
  }
};

/**
 * 解析表达式
 * 表达式格式为 {id:fn1(params),fn2(params)}
 */
function parseExpression(expression: string, record: any) {
  const expContent = expression.slice(1, -1);
  const field = expContent.split(':')[0];
  const fnPipeStr = expContent.split(':')[1];

  if (!/^\w+(\.\w+)*$/.test(field)) {
    console.error('表达式错误');
    return '';
  }
  if (fnPipeStr && !/^\w+\([^()]*\)(,\w+\([^()]*\))*$/.test(fnPipeStr)) {
    console.error('函数表达式错误');
    return '';
  }

  let value: any = dotProp.get(record, field);

  if (fnPipeStr) {
    const fnPipe = fnPipeStr.split(',');
    for (const fnStr of fnPipe) {
      const fnName = fnStr.split('(')[0];
      const params = fnStr.split('(')[1]?.slice(0, -1).split(',') || [];
      const fn = fnMap.get(fnName);
      if (fn) {
        value = fn(value, ...params);
      } else {
        // console.error(`路径表达式函数 ${fnName} 不存在`, fnPipeStr);
        return '';
      }
    }
  }

  if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'string') {
    return value;
  } else {
    // console.error(`路径表达式 ${field} 解析错误`);
    return '';
  }
}

// 数字类型处理
export const digitData = (text: any, fieldUnit: number) => {
  return Number(fieldUnit) === 0
    ? Number(Number(text).toFixed(0)).toLocaleString()
    : Number.parseFloat(text)
        ?.toFixed(Number(fieldUnit))
        ?.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};

/**
 * 自定义表格digit类型展示
 * @param column AdvancedColumns
 */
export const customDigitRender = (column: AdvancedColumns, onCancel?: () => void, _dynamicClickParams?: () => any) => {
  const fieldUnit = column?.fieldUnit !== null && Number(column?.fieldUnit) >= 0 ? Number(column?.fieldUnit) : 2;
  column.render = (node: any, record: any) => {
    const finalUrl = getFieldUrl(column, record);
    const txt = node.props.text || node?.props?.ellipsis?.tooltip;
    const customData =
      txt || txt === 0
        ? handleDataUrl(finalUrl, digitData(txt, fieldUnit), column, record, onCancel, _dynamicClickParams)
        : node;
    return customData;
  };
};

/**
 * 自定义表格Date类型展示
 * @param column AdvancedColumns
 */
export const customDateRender = (column: AdvancedColumns, onCancel?: () => void, _dynamicClickParams?: () => any) => {
  const fieldUnit = column?.fieldUnit ? column?.fieldUnit : null;
  const defaultMoment =
    column.valueType === valueTypes.DATE || column.valueType === valueTypes.DATERANGE ? YMD : YMDHms;
  /**
   * 允许开始或结束日期为空
   * http://pmo.chinacscs.com/www/index.php?m=execution&f=storyView&storyID=254&tid=i6j93to2
   */
  column.fieldProps = {
    ...column.fieldProps,
    allowEmpty: [true, true],
  };
  column.render = (node: any, record: any) => {
    const finalUrl = getFieldUrl(column, record);
    const dataText = node?.props?.text || node?.props?.children?.props?.text || node?.props?.ellipsis?.tooltip;
    const customData = dataText
      ? handleDataUrl(
          finalUrl,
          moment(dataText).format(fieldUnit || defaultMoment),
          column,
          record,
          onCancel,
          _dynamicClickParams,
        ) || node
      : node;
    return customData;
  };
};

/**
 * 金额类型处理
 * 金额型的字段显示样式支持设置小数点位，同数字的字段显示样式。但由于金额型样式还支持货币符号的设置，
 * 需要和小数点位做一个区分。通过解析“字段显示参数”填入的内容为“数字”的识别为对“小数点位”的设置，
 * 填入的内容为“字符串”的识别为对“货币符号”的设置，中间用英文逗号隔开，如2,$ 代表保留两位小数和使用美元的货币符号
 */
export const moneyData = (fieldUnit: string, text: any) => {
  // 小数点位数
  let places = 2;
  let moneySymbol = '￥';
  // 位数,货币符号
  if (/^\d+,\D+$/.test(fieldUnit)) {
    const [places$, symbol] = fieldUnit.split(',');
    places = Number(places$);
    moneySymbol = symbol;
  }
  // 位数
  if (/^\d+$/.test(fieldUnit)) {
    places = Number(fieldUnit);
  }
  // 货币符号
  if (/^\D+$/.test(fieldUnit)) {
    moneySymbol = fieldUnit;
  }

  return `${moneySymbol}${Number.parseFloat(text)
    ?.toFixed(places)
    ?.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
};

/**
 * 自定义表格Money类型展示
 * @param column AdvancedColumns
 */
export const customMoneyRender = (column: AdvancedColumns, onCancel?: () => void, _dynamicClickParams?: () => any) => {
  column.render = (node: any, record: any) => {
    const finalUrl = getFieldUrl(column, record);
    const moneyNum: number = node?.props?.text || node?.props?.ellipsis?.tooltip;
    const fieldUnit = column?.fieldUnit;
    const customData =
      moneyNum || moneyNum === 0
        ? handleDataUrl(finalUrl, moneyData(fieldUnit ?? '', moneyNum), column, record, onCancel, _dynamicClickParams)
        : node;
    return customData;
  };
};

// 百分比处理
export const percentData = (percentNum: number, fieldUnit: number) => {
  const symbol = percentNum >= 0 ? '' : '-';
  return Number(fieldUnit) === 0
    ? Number(Number(percentNum).toFixed(0)).toLocaleString() + '%'
    : `${symbol}${Number.parseFloat(Math.abs(percentNum).toString())
        ?.toFixed(fieldUnit)
        ?.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}%`;
};

/**
 * 自定义表格Percent类型展示
 * @param column AdvancedColumns
 */
export const customPercentRender = (
  column: AdvancedColumns,
  onCancel?: () => void,
  _dynamicClickParams?: () => any,
) => {
  column.render = (node: any, record: any) => {
    const finalUrl = getFieldUrl(column, record);
    const fieldUnit = column?.fieldUnit !== null && Number(column?.fieldUnit) >= 0 ? Number(column?.fieldUnit) : 2;
    const text = node?.props?.text !== null ? Number(node?.props?.text) : null;
    const percentNum: number = text ? text : node?.props?.ellipsis?.tooltip;
    const customData =
      !Number.isNaN(percentNum) && typeof percentNum === 'number'
        ? handleDataUrl(finalUrl, percentData(percentNum, fieldUnit), column, record, onCancel, _dynamicClickParams)
        : node;
    return customData;
  };
};

/**
 * 自定义表格Text类型展示
 * @param column AdvancedColumns
 * @param textMaxLength number
 */
export const customTextRender = (
  column: AdvancedColumns,
  onCancel?: () => void,
  _dynamicClickParams?: () => any,
  textMaxLength?: number,
) => {
  column.render = (text: any, record: any) => {
    let renderText = text;
    if (
      [
        selectModes.TREESELECT,
        selectModes.TREESELECTCHECKOUT,
        selectModes.CASCADER,
        selectModes.CASCADERCHECKOUT,
      ].includes(column?.selectMode as selectModes)
    ) {
      const isDataProps = column?.fieldProps?.options;
      const dataIndex: any = column?.dataIndex;
      if (Array.isArray(isDataProps)) {
        visitTree(isDataProps, (data) => {
          if (String(data?.value) === String(record?.[dataIndex])) {
            renderText = data.title;
          }
        });
      }
    }

    const finalUrl = getFieldUrl(column, record);
    if (finalUrl) {
      return handleFinalUrl(finalUrl, renderText, column, record, onCancel, _dynamicClickParams, textMaxLength);
    }

    if (
      textMaxLength &&
      renderText.length > textMaxLength &&
      isString(renderText) &&
      !column.hasOwnProperty('ellipsis')
    ) {
      return (
        <Tooltip title={renderText} overlayInnerStyle={renderText.length > 1000 ? { width: 600 } : {}}>
          {renderText.slice(0, textMaxLength) + '...'}
        </Tooltip>
      );
    }
    return renderText;
  };
};

/**
 * 超链接逻辑处理判断
 * @param finalUrl
 * @param text
 * @param onCancel
 * @param _customClickLink
 * @returns ReactNode
 */
export const handleDataUrl = (
  finalUrl: string,
  text: string,
  column: any,
  record: any,
  onCancel?: () => void,
  _dynamicClickParams?: () => any,
) => {
  return finalUrl ? handleFinalUrl(finalUrl, text, column, record, onCancel, _dynamicClickParams) : text;
};

// 跳转超链接处理
export const handleFinalUrl = (
  finalUrl: string,
  text: string,
  column: any,
  record: any,
  onCancel?: () => void,
  _dynamicClickParams?: () => any,
  textMaxLength?: number,
) => {
  return (
    <ClickRender
      column={column}
      record={record}
      text={text}
      finalUrl={finalUrl}
      onCancel={onCancel}
      textMaxLength={textMaxLength}
      _dynamicClickParams={_dynamicClickParams}
    />
  );
};

/**
 * 自定义处理超链接跳转逻辑
 * @returns React.ReactNode
 */
function ClickRender(props: {
  finalUrl: string;
  text: string;
  column: any;
  record: any;
  onCancel?: () => void;
  _dynamicClickParams?: () => any;
  textMaxLength?: number;
}) {
  const { _dynamicClickParams, column, record, text, finalUrl, onCancel, textMaxLength } = props;
  const { ComponentCollection, DynamicOnlineTable, status } = _dynamicClickParams?.() ?? {};
  const [visible, setVisible] = useState(false);
  const [modalWidth, setModalWidth] = useState<number | string>('80%');
  const [modalContent, setModalContent] = useState<React.ReactNode>();
  const [title, setTitle] = useState<string>('');
  const { linkConfig } = column;
  const pathLinkConfig = linkConfig?.path;

  const handleUrlLink = async () => {
    try {
      // 可能没有 getUrlLink 对应接口
      const { data: url } = await getUrlLink(finalUrl);
      // 新开浏览器窗口打开
      if (/^(https?|http?)?:\/\//.test(url)) {
        window.open(url);
        return;
      }

      // 触发弹框
      if (url.endsWith('.tsx') && ComponentCollection) {
        setModalWidth(MatchComponentWidth(url.slice(0, Math.max(0, url.indexOf('.'))), ComponentCollection));
        setModalContent(MatchComponent(url.slice(0, Math.max(0, url.indexOf('.'))), ComponentCollection, record));
        setVisible(true);
        return;
      }

      const urlMatch = url.match(/^\s*@dynamicId=([\dA-Za-z]*)&(.+)*\s*;?$/);
      if (urlMatch && DynamicOnlineTable) {
        const id = urlMatch[1];
        const params = urlMatch[2]?.split('&')?.reduce((obj: any, item: any) => {
          const [key, value] = item.split('=');
          obj[key] = value ?? ''; // 将键值对存储到对象中
          return obj;
        }, {});
        const { dynamicTitle, width = '80%', ...rest } = params;

        if (width) {
          if (/^\d+$/.test(width)) {
            setModalWidth(Number(width));
          } else {
            setModalWidth(width);
          }
        }
        if (id) {
          setModalContent(<DynamicOnlineTable id={id} wrapped={false} modalParams={rest} />);
        } else {
          message.error('未设置动态页面id');
          return;
        }
        setTitle(dynamicTitle);
        setVisible(true);
        return;
      }

      if (status === 'modal') {
        message.error('新建/编辑状态下不支持路由超链接的预览');
      } else {
        // 路由跳转
        if (pathLinkConfig?.disabled) {
          if (pathLinkConfig.disabledMessage) {
            message.error(pathLinkConfig.disabledMessage);
          }
          return;
        } else {
          (window as any).csRouter(url);
        }

        if (onCancel) {
          onCancel();
        }
      }
    } catch {
      if (/^(https?|http?)?:\/\//.test(finalUrl)) {
        window.open(finalUrl);
        return;
      }
      // 路由跳转
      if (pathLinkConfig?.disabled) {
        if (pathLinkConfig.disabledMessage) {
          message.error(pathLinkConfig.disabledMessage);
        }
        return;
      } else {
        (window as any).csRouter(finalUrl);
      }
    }
  };

  return (
    <>
      <Typography.Link onClick={handleUrlLink}>
        {textMaxLength && text.length > textMaxLength && isString(text) && !column.hasOwnProperty('ellipsis') ? (
          <Tooltip title={text} overlayInnerStyle={text.length > 1000 ? { width: 600 } : {}}>
            {text.slice(0, textMaxLength) + '...'}
          </Tooltip>
        ) : (
          text
        )}
      </Typography.Link>
      <Modal
        maskClosable
        title={title}
        onCancel={() => {
          setVisible(false);
        }}
        centered
        footer={null}
        open={visible}
        width={modalWidth}
      >
        {modalContent}
      </Modal>
    </>
  );
}
