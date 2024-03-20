export enum SelectMode {
  /**
   * 级联单选
   */
  Cascader = 'cascader',
  /**
   * 级联多选
   */
  CascaderCheckout = 'cascaderCheckout',
  /**
   * 树形单选
   */
  TreeSelect = 'treeSelect',
  /**
   * 树形多选
   */
  TreeSelectCheckout = 'treeSelectCheckout',
  /**
   * 范围查询
   */
  SelectRange = 'selectRange',
  /**
   * 输入框 模糊查询
   */
  INPUT = 'input',
  /**
   * 输入框 精确查询
   */
  ExactInput = 'exactInput',
  /**
   * 包含查询 - 查询条件始终解析成文本输入框
   */
  IncludeInput = 'includeInput',
  /**
   * 下拉单选
   */
  SelectRadio = 'selectRadio',
  /**
   * 下拉多选
   */
  SelectCheckout = 'selectCheckout',
}

export enum FieldType {
  /**
   * 数字
   */
  Digit = 'digit',
  /**
   * 金额
   */
  Money = 'money',
  /**
   * 文本
   */
  Text = 'text',
  /**
   * 百分比
   */
  Percent = 'percent',
  /**
   * 日期
   */
  Date = 'date',
  /**
   * 时间
   */
  DateTime = 'dateTime',
  /**
   * 年月日
   */
  DateYMD = 'dateYMD',
}
