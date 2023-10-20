import { fileTemplateType, pageTemplateType, projectTemplateType } from "./type"

export const projectData: projectTemplateType[] = [
  {
    id: 1,
    name: '大b端项目',
    npmName: 'cluster-front',
    value: 'cluster-front',
    projectName: 'front',
    projectId: '2064',
    tags: '1.0.0',
    repositoryUrl: 'http://gitlab.chinacsci.com/cluster/front.git'
  }
]

export const pageData: pageTemplateType[] = [
  {
    id: 1,
    name: '表格查询页',
    value: 'table',
    pageName: 'table',
  },
  {
    id: 2,
    name: '可编辑表格页',
    value: 'editable',
    pageName: 'editable',
  },
  {
    id: 3,
    name: '多tabs表格页',
    value: 'tabstable',
    pageName: 'tabstable',
  },
  {
    id: 4,
    name: '左右布局页',
    value: 'fold-columns',
    pageName: 'fold-columns',
  },
]

export const fileData: fileTemplateType[] = [
  {
    id: 1,
    name: 'layout card布局页',
    value: 'layout',
    pageName: 'layout',
  },
  {
    id: 2,
    name: '上step下card布局页',
    value: 'step-card',
    pageName: 'step-card',
  },
]