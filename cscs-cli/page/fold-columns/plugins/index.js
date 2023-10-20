export default async function(api) {
  const leftType = await api.makeList({
    choices: [{
      name: '树形数据', value: 'treeData',
    }, {
      name: '列表数据', value: 'listData',
    }],
    message: '请选择左侧数据格式',
  });
  const {
    value,
    includeComponentsFiles,
  } = await api.InquirerListObj({
    choices: [{
      name: '高级表格', value: 'ATable', includeComponentsFiles: ['ATable.tsx']
    }, {
      name: '可编辑表格', value: 'ETable', includeComponentsFiles: ['ETable.tsx']
    }, {
      name: '全可编辑表格', value: 'AllEtable', includeComponentsFiles: ['AllEtable.tsx']
    }],
    message: '请选择右侧表格类型',
  });

  return {
    leftType,
    rightType: value,
    includeComponentsFiles: includeComponentsFiles,
  }
}