/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-08-29 17:53:40
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-11-02 16:43:51
 * @FilePath: \amt-frontend\packages\dynamic-page\src\dynamic-page-manage\components\config-tips.tsx
 * @Description: 表格明细配置 tips 说明文档
 *
 */
/* eslint-disable quotes */
import React from 'react';

export const fieldCodeTips = (
  <div>
    <div>
      当查询模式属于下拉框（包括下拉单选、下拉多选等）、树形选择（包括树形单选、树形多选等）、级联选择（包括级联单选、级联多选等）时，需必填，针对下拉框支持填写字典编码和SQL语句，针对树形选择、级联选择支持填写JSON格式的数据集和RESTfull
      API。
    </div>
    <div>1、字典编码（如性别，则填写字典编码gender）；</div>
    <div>2、返回value、title两列的SQL查询语句（如select id value, name title from table）；</div>
    <div>
      3、特定格式的JSON数据集，模板为：
      <pre>
        {JSON.stringify(
          {
            fieldProps: {
              options: [
                {
                  title: '性别',
                  value: '2',
                  children: [
                    {
                      title: '男',
                      value: '0',
                    },
                    {
                      title: '女',
                      value: '1',
                    },
                  ],
                },
              ],
            },
          },
          null,
          2,
        )}
      </pre>
    </div>
    <div>
      4、RESTfull API（GET方式，系统已提供部门、行业和区域的RESTfull
      API），支持相对路径和以http或https开头的全路径，支持URL传参，参数值支持使用系统变量，接口返回数据中需要有result属性，模板为：
      <pre>
        {JSON.stringify(
          {
            success: true,
            result: {
              fieldProps: {
                options: [
                  {
                    title: '性别',
                    value: '2',
                    children: [
                      {
                        title: '男',
                        value: '0',
                      },
                      {
                        title: '女',
                        value: '1',
                      },
                    ],
                  },
                ],
              },
            },
            message: 200,
          },
          null,
          2,
        )}
      </pre>
    </div>
  </div>
);

export const dynamicSqlTips = (
  <div style={{ width: 460 }}>
    <div>
      <strong>关于系统变量：</strong>
    </div>
    <p>
      您可以在SQL中使用系统变量。
      <br />
      {`目前支持的系统变量包括当前登录人ID：#{sysUserId}
      当前登录人所属部门ID列表（不包含子部门）：#{sysUserDepartment}、
      当前登录人所属部门ID列表（包含所有子部门）：#{sysUserDepartmentWithSub}、
      当前登录人属性角色ID列表：#{sysUserRole}、当前登录人姓名：#{sysUserName}、
      系统日期：#{sysDate}、系统时间：#{sysDateTime}。
      同时支持使用【运维管理-通用字典配置】中字典类型编码为authority_data_type的所有字典作为动态的系统变量。`}
    </p>
    <p>{`示例1、根据当前登录人ID查询数据： select * from table where user_id = #{sysUserId}`}</p>
    <p>{`示例2、根据当前登录人所属部门ID查询数据： select * from table where department_id in (#{sysUserDepartment})`}</p>
    <p>{`示例3、根据当前登录人所拥有的部门数据权限查询数据： select * from table where department in (#{department})`}</p>
    <p>{`关于自定义参数： 您可以在SQL中使用“\${abc}”作为一个参数，这里abc是参数的名称。 `}</p>
    <p>{`示例4、精确查询： select * from table where id = \${abc}。 示例5、模糊查询： select * from table where id like '%\${abc}%'。`}</p>
    <p>{`注：如若示例4的模糊查询遇到解析失败，请尝试按以下特定数据库语法拼写对应SQL： `}</p>
    <p>{`MySQL语法：select * from table where id like concat('%',\${abc},'%') `}</p>
    <p>{`Oracle语法：select * from table where id like '%'||\${abc}||'%'`}</p>
  </div>
);

export const fieldUnitTips = (
  <div>
    <div>通过该参数可以调整“字段显示样式”的默认样式，支持：</div>
    <div>①调整数字型、金额型、百分比样式的小数点位数（输入小数点位数，如4，空则默认为2）;</div>
    <div>
      ②调整金额型样式的货币符号（输入货币符号，如CNY、$，空则默认为¥），若同时设置小数点位数和货币符号，中间需要用英文逗号隔开，且需要按照小数点位数、货币符号的顺序书写;
    </div>
    <div>③调整日期型样式的日期格式（输入日期格式，如yyyyMMDD，空则默认为yyyy-MM-DD）;</div>
    <div>④调整时间型样式的时间格式（输入时间格式，如yyyyMMDD HH:mm:ss，空则默认为yyyy-MM-DD HH:mm:ss）;</div>
  </div>
);

export const fieldDisplayTips = (
  <div>
    指该字段是否要在表格查询结果列中显示，即使不在“列表中显示”，后端也会将该字段返回到前端，前端可灵活使用该值，如通常使用
    {'{id}'}的方式，获取字段名为“id”的列值，配置在超链接中使用。
  </div>
);

export const fieldSelectTips = (
  <div>
    指该字段是否要作为显性的过滤条件，显示在表格的查询条件区域。不管该字段是否在查询条件区域显示，只要给该字段赋值了查询内容，均可通过其进行数据过滤。当作为隐性的过虑条件，即不在查询条件区域显示时，可通过“查询默认值”和URL传参（优先级高于查询默认值）两种方式对其赋值，具体可参照“查询默认值”中的使用说明。
  </div>
);

export const selectModeTips = (
  <>
    <div>结合“字段显示样式”，不同的查询模式，在查询条件中显示的组件以及对查询内容的解析方式不一样</div>
    <div>
      &emsp;&emsp;精确查询：会根据“字段显示样式”的类型，在查询条件中显示为文本/数字输入框或日期/时间选择框，对输入或选择的内容进行精确查询；
    </div>
    <div>
      &emsp;&emsp;模糊查询：会根据“字段显示样式”的类型，在查询条件中显示为文本/数字输入框或日期/时间选择框，对输入或选择的内容进行模糊查询；
    </div>
    <div>
      &emsp;&emsp;包含查询：一种特殊的查询模式，在查询条件中始终显示为文本输入框，具体查询逻辑为：通过特殊字符“|”对输入框内容切割后进行多值精确查询，若内容中无“|”，则直接对输入框内容进行精确查询；
    </div>
    <div>
      &emsp;&emsp;范围查询：会根据“字段显示样式”的类型，在查询条件中显示为数字范围输入框或日期/时间范围选择框，查询逻辑支持在属性配置中设置，支持【大于等于到小于等于的范围】或【大于等于到小于的范围】或【大于到小于等于的范围】或【大于到小于的范围】四种形式。默认为【大于等于到小于等于的范围】；
    </div>
    <div>&emsp;&emsp;下拉单选：在查询条件中显示为下拉单选框，根据所选项进行单值精确查询；</div>
    <div>&emsp;&emsp;下拉多选：在查询条件中显示为下拉多选框，根据所选项进行多值精确查询；</div>
    <div>&emsp;&emsp;树形单选：在查询条件中显示为单选树形选择框，根据所选项进行单值精确查询；</div>
    <div>&emsp;&emsp;树形多选：在查询条件中显示为多选树形选择框，根据所选项进行多值精确查询；</div>
    <div>
      &emsp;&emsp;级联单选：在查询条件中显示为单选级联选择框，根据所选项进行单值精确查询，可以支持同时查询多个字段，具体配置方式见属性配置中的说明；
    </div>
    <div>
      &emsp;&emsp;级联多选：在查询条件中显示为多选级联选择框，根据所选项进行多值精确查询，可以支持同时查询多个字段，具体配置方式见属性配置中的说明；
    </div>
  </>
);

export const ColumnConfigTips = (
  <>
    <div>
      通过JSON配置表格列和查询条件的属性，支持string/boolean/number等简单类型的列属性和查询条件组件属性，查询条件属性写在fieldProps中，模板如下
    </div>
    <pre>
      {`{
      "align": "right",
      "tooltip": "一段icon提示内容",
      "title": "title",
      "width": 400,
      "fixed": true,
      "form": {
        rules: [
          {"required":true,"message":"此项为必填项"}
        ]
      },
      "fieldProps": {
        "placeholder": "请输入/请选择",
        "showSearch": true,
        "showCheckedStrategy": "SHOW_PARENT"
        },
        "isCascader": "parent_id#1",
        "formItemProps":{
          "rules":[{"required":true,"message":"此项为必填项"}]
        },
        "dataDeduplicated":"top_node_id",
        "rangeSelected":">,<",
        "showInLeftBar": {
          "reloadOnChange": true 
        }
    }`}
    </pre>
    <div>
      <p>
        注1：若一个查询条件支持同时查多个字段，则需要在多个字段中分别配置 "isCascader": "parent_id#1"，"isCascader":
        "parent_id#2"，"isCascader":
        "parent_id#3"。其中"parent_id"为级联中第一层级的字段，"#1"为第一层级，"#2"为第二层级，"#3"为第三层级。
      </p>
      <p>
        注2：若一个查询条件需要设置为必填项，则写入
        {`{"formItemProps":{"rules":[{"required":true,"message":"此项为必填项"}]}}`}，并在表格配置-表格属性配置中写入
        {`{"form":{"ignoreRules":false}}`} 。
      </p>
      <p>
        注3：支持范围查询条件的处理方式配置，"rangeSelected":"&gt;=,&lt;="或 "rangeSelected":"&gt;,&lt;="
        或"rangeSelected":"&gt;=,&lt;" 或
        "rangeSelected":"&gt;,&lt;"，分别代表范围取【大于等于到小于等于的范围】或【大于等于到小于的范围】或【大于到小于等于的范围】或【大于到小于的范围】四种形式。若不进行任何配置，则默认取【大于等于到小于等于的范围】的查询形式。
      </p>
      <p>
        注4：针对树形数据，若配置字段需要根据某一字段进行去重合计，则写入{`{ "dataDeduplicated":"字段"}`}
        ，则该字段会依据所配置字段进行相同数据去重的合计。
      </p>
      <p>
        注5：针对配置了条件中显示，且查询模式为树形单选、树形多选、下拉单选、下拉多选其一的字段。若需要配置其展示在动态页面左侧，则写入
        {`{"showInLeftBar": {}}`}
        ，如果需要设置左侧筛选条件选中或取消选中后，是否立即刷新列表，可以添加 "reloadOnChange: boolean"
        设置项。并支持左侧面板宽度的设置，在表格配置-表格属性配置中写入参数 LeftBarWidth 控制，默认宽度为260px。
      </p>
    </div>
  </>
);

export const TableApiConfigTips = (
  <>
    <div>通过JSON全局配置表格属性，支持string/boolean/number等简单类型的属性，模板如下：</div>
    <pre>
      {`{
        "size": "small",
        "showHeader": false,
        "form":{
        "ignoreRules":false
        },
        "options": {
          "density": true,
          "fullScreen": true,
          "reload": true,
          "setting": true
        },
        "columnsState": {
          "persistenceType": "localStorage",
          "persistenceKey": "dynamicPage292820230324113248"
        },
        "totalBasis":"#-1"
      }`}
    </pre>
    <p>注1：persistenceKey属性值是自定义的，需要全局唯一，建议使用动态页面的ID+时间戳。</p>
    <p>
      注2：针对树形数据，支持根据不同层级控制合计值， 通过配置 "totalBasis":"#1" 或 "totalBasis":"#2" 或
      "totalBasis":"#3" ，分别代表合计第一层级、第二层级、第三层级的数据。若合计最内层级的数据，则配置
      "totalBasis":"#-1"。若不进行任何配置，则默认为统计所有节点数据的合计值。并且只显示在明细配置中勾选了“合计”的字段合计值。
    </p>
  </>
);

export const ShowTableStyleTips = (
  <>
    <div>1、树形数据：若配置树形数据，则需要在SQL中添加id和parent_id 作为树形数据的标识。</div>
    <div>2、可展开：选择某一组件作为可展开面板的组件。</div>
  </>
);

export const defaultValueTips = (
  <div>
    <div>
      不管该字段是否在查询条件中显示，均可通过其进行数据过滤。数据过滤时，可以通过查询默认值和URL传参（优先级高于查询默认值）的方式，对过滤条件进行赋值，其中查询默认值支持以下四类方式：
    </div>
    <strong>一、常规默认值：</strong>
    <div>&emsp;&emsp;1、非字典类型：直接输入数值、字符串等固定值，包含查询和范围查询，可以使用“|”连接多个查询值；</div>
    <div>&emsp;&emsp;2、字典类型：输入字典项的字典编码值或SQL、JSON、API类型字典的value值，多个值以“|”连接；</div>
    <strong>二、表达式：</strong>

    <div>
      &emsp;&emsp;1、特殊日期、时间表达式：specialDate(calendartype,expression,format,offset,date)，该表达式会以date为基准，结合calendartype参数和expression参数，取
      {'<或<=date参数的最近一个自然日/工作日/交易日'}，同时可通过offset参数对取值进行偏移。具体参数说明如下：
    </div>
    <div>
      &emsp;&emsp;date：基准日期/时间，支持常用格式的日期/时间字符串，常用格式包括yyyyMMDD、yyyy-MM-DD、yyyy-MM-DD
      HH:mm:ss等。该参数允许为空，为空则默认赋值当前系统时间；
    </div>
    <div>
      &emsp;&emsp;calendartype：日历类型，1表示该表达式按自然日取值，2表示该表达式按工作日取值，3表示该表达式按交易日取值。该参数允许为空，为空则默认按交易日取值；
    </div>
    <div>
      &emsp;&emsp;expression：比较符号，支持{'<和<=，<表示该表达式按小于date取值，<=表示该表达式按小于等于date取值'}
      。该参数允许为空，为空则默认按小于date取值；
    </div>
    <div>
      &emsp;&emsp;format：格式化规则，支持按yyyy（年）、MM（月）、DD（日）、HH（时）、mm（分）、ss（秒）的单值或多值组合对表达式取值进行格式化。该参数允许为空，为空则默认格式化为：yyyy-MM-DD；
    </div>
    <div>
      &emsp;&emsp;offset：日期/时间偏移量，可以是正数（向未来偏移）、0（不偏移）、负数（向历史偏移），如果format为单值（yyyy、MM、DD、HH、mm、ss），则按单值进行偏移计算，如果format为多值组合，则按最小单位进行偏移计算，当以DD（日）为最小单位进行偏移时，会结合calendar参数，按自然日/工作日/交易日对取值进行偏移。该参数允许为空，为空则默认不偏移；
    </div>
    <div>
      &emsp;&emsp;该表达式支持不同个数的传参，以覆盖对应参数的默认值，可从左往右依次增加传参个数，如specialDate()表示取小于今天的最近一个交易日，即上一交易日；specialDate(1)表示取小于今天的最近一个自然日，即昨天；
      specialDate(3,'&lt;=')表示取小于等于今天的最近一个交易日期，包含今天，即如果今天是交易日，则会取今天。
    </div>
    <div>&emsp;&emsp;注:书写表达式时，参数类型除数字和布尔类型外的类型都需要要加英文单引号"。</div>

    <div>&emsp;&emsp;2、日期、时间表达式（即将过期的表达式）：dateStr(date, format, offset)</div>
    <div>&emsp;&emsp;date：时间字符串，格式必须为：yyyy-MM-DD HH:mm:ss，允许为空，为空则取系统当前时间；</div>
    <div>
      &emsp;&emsp;format：格式化规则，支持yyyy、MM、DD、HH、mm、ss的任意单值或多值组合，允许为空，为空则默认格式为：yyyy-MM-DD
      HH:mm:ss，如果设置了date参数值，则该参数不允许为空；
    </div>
    <div>
      &emsp;&emsp;offset：日期、时间偏移量，可以是正数（向未来偏移）、0（不偏移）、负数（向历史偏移），如果format为单值（yyyy、MM、DD、HH、mm、ss），则会对单值（年/月/日/时/分/秒）进行偏移计算，如果format是多值组合，则按最小单位进行偏移计算。允许为空，为空则默认不偏移，如果设置了date参数值，则该参数不允许为空；
    </div>
    <div>&emsp;&emsp;3、字符串拼接：concat(str1,str2,…)，将多个字符串str1、str2、…、strN拼接起来。</div>
    <div>
      &emsp;&emsp;4、字符串截取：substring(str,beginIndex,endIndex)，str待截取的字符串，beginIndex开始索引，以0为开始，包括当前位置，endIndex结束索引，不包括当前位置，索引支持负数，-1表示最后一个字符。
    </div>
    <div>
      <div>
        &emsp;&emsp;5、条件判断表达式：switch(expression,value1,result1,[default or value2,result2],…,[default or
        valueN,resultN])，该表达式将expression参数值从左至右依次与参数value1…valueN进行匹配，若存在匹配值，则返回第一个匹配值对应的result参数值，若不存在匹配值，则返回default参数值。具体参数说明如下：
      </div>
      <div>
        &emsp;&emsp;expression：待匹配的值或逻辑表达式{'（如"17>=15"）'}
        ，若为逻辑表达式，则根据其判断结果true/false去进行匹配。该参数不允许为空。
      </div>
      <div>&emsp;&emsp;value1,…,valueN：匹配值，即与expression进行匹配的值。该参数不允许为空。</div>
      <div>&emsp;&emsp;result1,…,resultN：返回值，即存在匹配值时返回的对应值。该参数不允许为空。</div>
      <div>
        &emsp;&emsp;default:
        默认返回值，即不存在匹配值时返回的值，位于条件判断表达式中最后的参数位置。该参数允许为空，为空则默认返回空字符串。
      </div>
    </div>
    <div>
      <strong>注：以上表达式中，除单引号（‘’）中的内容，其他地方不允许出现空格，否则会解析失败。</strong>
    </div>
    <strong>三、系统变量：</strong>
    <div>
      &emsp;&emsp;目前支持的系统变量包括当前登录人ID：#{'{sysUserId}'}
      、当前登录人所属部门ID列表（不包含子部门）： #{'{sysUserDepartment}'}
      、当前登录人所属部门ID列表（包含所有子部门）：#{'{sysUserDepartmentWithSub}'}、当前登录人属性角色ID列表：#
      {'{sysUserRole}'}
      、当前登录人姓名：#{'{sysUserName}'}、系统日期：#{'{sysDate}'}、系统时间：#{'{sysDateTime}'}）。
    </div>
    <strong>四、范围默认值：</strong>
    <div>&emsp;&emsp;支持对日期、时间和数值类的范围查询，设置范围的默认值，中间用“|”链接。</div>
    <div>&emsp;&emsp;示例1、数值型：</div>
    <div>&emsp;&emsp;&emsp;&emsp;支持固定值范围，如10|100，表示查询大于等于10到小于等于100之间的数据；</div>
    <div>&emsp;&emsp;示例2、日期型：</div>
    <div>&emsp;&emsp;&emsp;&emsp;支持固定值范围，如2022-07-01|2022-07-25；</div>
    <div>&emsp;&emsp;&emsp;&emsp;支持表达式范围，如查询本月1号到今天，可综合使用多种表达式：</div>
    <div>
      &emsp;&emsp;&emsp;&emsp;concat(dateStr(&apos;yyyy-MM&apos;),&apos;-01&apos;)|dateStr(&apos;yyyy-MM-DD&apos;)
    </div>
    <div>&emsp;&emsp;&emsp;&emsp;或</div>
    <div>
      &emsp;&emsp;&emsp;&emsp;concat(substring(dateStr(&apos;yyyy-MM-DD&apos;),0,8),&apos;01&apos;)|dateStr(&apos;yyyy-MM-DD&apos;)；
    </div>
    {/* <strong>注：以上表达式中，除单引号（‘’）中的内容，其他地方不允许出现空格，否则会解析失败。</strong> */}
  </div>
);

export const fieldHrefTips = (
  <>
    <p>支持以下四种形式的超链接：</p>
    <p>1.网址，以http://或https://开头域名或IP地址；</p>
    <p>2.路由，如某个企业展台的路由：/search/common/10086；</p>
    <p>3.组件，如某个React组件：test.tsx，会以弹窗形式打开；</p>
    <p>
      4.动态页面，以@开头的一组参数，如@dynamicId=100&dynamicTitle=动态页面弹窗，会以弹窗形式打开，dynamicId是打开弹窗的动态页面的ID，dynamicTitle是打开弹窗的标题，非必填，默认取对应动态页面的名称。如需传递其他参数，用&进行拼接。另外，打开弹窗的动态页面的自适应高度，宽度可通过添加参数width控制，支持按照定值或百分比设置。
    </p>
    <br />
    <br />
    <p>并支持通过以下几种方式，动态设置超链接地址：</p>
    <p>
      1.支持以{'{字段名}'}方式引用某个字段值，如根据字段id的值跳转到不同企业展台，可填写路由地址：/search/common/
      {'{id}'}；
    </p>
    <p>2.支持以{'{url参数名}'}方式引用当前页面路由中的某个url参数值；</p>
    <p>
      3.支持通过 nvl 函数对字段值或url参数值做空值转换，如配置 /abc/{'{id:nvl(null)}'}/{'{id:nvl(0)}'}，则当字段数据中的
      id 值为 null 或 "" 时，超链接地址会转换为 /abc/null/0；
    </p>
    <p>
      4.支持使用表达式和系统变量，具体可参照“查询默认值”中的使用说明。此处在使用表达式时，必须通过${'{表达式}'}
      的方式引用，以定位表达式的起始位置，多个表达式嵌套使用时，只需要将最外层的表达式放入$中，如/test/testdata?createTime=$
      {"{concat(substring(dateStr('yyyy-MM-DD'),0,8),'01')}"}。
    </p>
    <p>
      5. 支持 javascript 语句，以 {`{{expression}}`} 的方式编写表达式，表达式返回值为字符串，如
      <pre>{`{{
    function() {
            if (id && Number(id) > 0) {
                    switch(type) {
                            case 1:
                                    return "/a";
                            case 2:
                                    return "/b";
                            case 3: 
                                    return "/c";
                            case 9:
                                    return "/d";
                    }
            } else {
                    return null;
            }        
    }()
  }}
`}</pre>
    </p>
  </>
);

export const configDefaultValueTips = (
  <div>
    <div>
      <strong>
        可以通过默认值和URL传参（优先级高于参数默认值）的方式，对SQL语句中的参数进行赋值，其中参数默认值支持以下三类方式：
      </strong>
    </div>
    <strong>一、常规默认值：</strong>
    <div>&emsp;&emsp;直接输入数值、字符串等固定值。</div>
    <strong>二、表达式：</strong>
    <div>
      &emsp;&emsp;1、特殊日期、时间表达式：specialDate(calendartype,expression,format,offset,date)，该表达式会以date为基准，结合calendartype参数和expression参数，取
      {'<或<=date参数的最近一个自然日/工作日/交易日'}，同时可通过offset参数对取值进行偏移。具体参数说明如下：
    </div>
    <div>
      &emsp;&emsp;date：基准日期/时间，支持常用格式的日期/时间字符串，常用格式包括yyyyMMDD、yyyy-MM-DD、yyyy-MM-DD
      HH:mm:ss等。该参数允许为空，为空则默认赋值当前系统时间；
    </div>
    <div>
      &emsp;&emsp;calendartype：日历类型，1表示该表达式按自然日取值，2表示该表达式按工作日取值，3表示该表达式按交易日取值。该参数允许为空，为空则默认按交易日取值；
    </div>
    <div>
      &emsp;&emsp;expression：比较符号，支持{'<和<=，<表示该表达式按小于date取值，<=表示该表达式按小于等于date取值'}
      。该参数允许为空，为空则默认按小于date取值；
    </div>
    <div>
      &emsp;&emsp;format：格式化规则，支持按yyyy（年）、MM（月）、DD（日）、HH（时）、mm（分）、ss（秒）的单值或多值组合对表达式取值进行格式化。该参数允许为空，为空则默认格式化为：yyyy-MM-DD；
    </div>
    <div>
      &emsp;&emsp;offset：日期/时间偏移量，可以是正数（向未来偏移）、0（不偏移）、负数（向历史偏移），如果format为单值（yyyy、MM、DD、HH、mm、ss），则按单值进行偏移计算，如果format为多值组合，则按最小单位进行偏移计算，当以DD（日）为最小单位进行偏移时，会结合calendar参数，按自然日/工作日/交易日对取值进行偏移。该参数允许为空，为空则默认不偏移；
    </div>
    <div>
      &emsp;&emsp;该表达式支持不同个数的传参，以覆盖对应参数的默认值，可从左往右依次增加传参个数，如specialDate()表示取小于今天的最近一个交易日，即上一交易日；specialDate(1)表示取小于今天的最近一个自然日，即昨天；
      specialDate(3,'&lt;=')表示取小于等于今天的最近一个交易日期，包含今天，即如果今天是交易日，则会取今天。
    </div>
    <div>&emsp;&emsp;注:书写表达式时，参数类型除数字和布尔类型外的类型都需要要加英文单引号"。</div>

    <div>&emsp;&emsp;2、日期、时间表达式（即将过期的表达式）：dateStr(date, format, offset)</div>
    <div>
      &emsp;&emsp;date：时间字符串，格式必须为：yyyy-MM-DD HH:mm:ss，如2022-07-25
      15:51:51，允许为空，为空则取系统当前时间；
    </div>
    <div>
      &emsp;&emsp;format：格式化规则，默认格式为：yyyy-MM-DD
      HH:mm:ss，允许yyyy、MM、DD、HH、mm、ss的任意单值或多个组合，如果设置了date参数的值，该参数不允许为空；
    </div>
    <div>
      &emsp;&emsp;offset：日期和时间的偏移量，可以为正数（向后偏移）、0（不偏移）、负数（向前偏移），如果format为单值(yyyy、MM、DD、HH、mm、ss)，只对单值(年/月/日/时/分/秒)进行偏移计算，如果format是混合格式，则按最小单位进行偏移计算。
      如果设置了date参数的值，该参数不允许为空。
    </div>
    <div>&emsp;&emsp;3、字符串拼接：concat(str1,str2,……)；</div>
    <div>
      &emsp;&emsp;4、字符串截取：substring(str,beginIndex,endIndex)，str待截取的字符串，beginIndex开始索引（以0为开始,包括当前位置）,endIndex结束索引（不包括当前位置），索引支持负数，-1表示最后一个字符。
    </div>
    <div>
      <div>
        &emsp;&emsp;5、条件判断表达式：switch(expression,value1,result1,[default or value2,result2],…,[default or
        valueN,resultN])，该表达式将expression参数值从左至右依次与参数value1…valueN进行匹配，若存在匹配值，则返回第一个匹配值对应的result参数值，若不存在匹配值，则返回default参数值。具体参数说明如下：
      </div>
      <div>
        &emsp;&emsp;expression：待匹配的值或逻辑表达式{'（如"17>=15"）'}
        ，若为逻辑表达式，则根据其判断结果true/false去进行匹配。该参数不允许为空。
      </div>
      <div>&emsp;&emsp;value1,…,valueN：匹配值，即与expression进行匹配的值。该参数不允许为空。</div>
      <div>&emsp;&emsp;result1,…,resultN：返回值，即存在匹配值时返回的对应值。该参数不允许为空。</div>
      <div>
        &emsp;&emsp;default:
        默认返回值，即不存在匹配值时返回的值，位于条件判断表达式中最后的参数位置。该参数允许为空，为空则默认返回空字符串。
      </div>
    </div>
    <strong>三、系统变量：</strong>
    <p>
      目前支持的系统变量包括：
      <br />
      {`当前登录人ID：#{sysUserId}、当前登录人所属部门ID列表（不包含子部门）： #{sysUserDepartment}、
      当前登录人所属部门ID列表（包含所有子部门）：#{sysUserDepartmentWithSub}、当前登录人属性角色ID列表：#{sysUserRole}、      当前登录人姓名：#{sysUserName}、
      系统日期：#{sysDate}、系统时间：#{sysDateTime} 。
      同时支持使用【运维管理-通用字典配置】中字典类型编码为authority_data_type的所有字典作为动态的系统变量。`}
    </p>
    <strong>注：以上表达式中，除单引号（‘’）中的内容，其他地方不允许出现空格，否则会解析失败。</strong>
  </div>
);

export const fieldRowTitle = (
  <div>
    <div>
      若不选择，则不进行分组；若选择“合并显示”，则对相同数据合并行显示一行数据；若选择“不合并显示”，则分别展示多行数据，但同类数据要各自分为一组。当有多个字段分别配置了行分组，则按照配置时字段的顺序，以上一个设置了行分组的字段列的分组结果为基础，再进行二次分组。设置了行分组的字段将作为聚合依据的待选项。
    </div>
    <div style={{ color: 'red' }}>
      同时设置列分组和行分组的场景下，需要将列分组标题相同的字段调整顺序放在一起，再设置行分组。
    </div>
  </div>
);

export const fieldAggregationTitle = (
  <div>
    请在设置聚合依据前，确定字段的顺序。按照字段的顺序，后者可以选择前者或自身作为其聚合依据，但前者不能选择后者作为其聚合依据。此时，若拖拽字段排序，则已配置的聚合依据将被清空。
  </div>
);

export const fieldTotalTitle = <div>针对树形数据，支持根据不同层级控制合计值，在表格属性配置中进行设置</div>;

export const fieldCreateEditTips = '配置允许新建/编辑字段数据';

export const fieldStyleTips = '配置允许新建/编辑字段录入的组件样式';
