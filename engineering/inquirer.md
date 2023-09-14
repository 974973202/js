### inquirer.prompt() 语法分析
> inquirer.prompt 里的数组可以定义问题，每个数组元素是一个对象，一个数组元素代表一个问题
- type: (String)提示的类型，默认input,可选值有: input, number, confirm, list, rawlist, expand, checkbox, password, editor
- message: (String Function) 问题的描述
- name: (String) 在 answers 对象里的 key
- choices: (Array | Function) 选顶
- default:(String | Number | Boolean | Array | Function) 用户没有回答时的默认值
- filter: (Function) 对用户的回答进行转换，返回转换过的结果给 answers
- when: (Function, Boolean) 根据前面用户回答的答案来判断要不要显示当前问题
- validate: (Function) 对用户的回答进行校验
- transformer:对用户回答的显示效果进行外理(如;修改回答的字体或背景颜色)，但不会影响最终的答案的内容
- pageSize: 修改某些type类型下的渲染行数
- prefix: 修改message默认前缀
- suffix: 修改message默认后缀
- loop: (Boolean) 启用列表循环。默认值：true