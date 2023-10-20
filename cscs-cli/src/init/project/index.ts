import { log, makeInput, makeList, getTagsAllList, printErrorLog } from "../../utils";
import { homedir } from 'node:os';
import path from 'node:path';
import { TEMP_HOME } from "../config";
import { projectData } from '../request'
import { optType, projectTemplateType } from "../type";

// 获取项目名称
function getAddName() {
  let message = '请输入项目名称'
  return makeInput({
    message: message,
    defaultValue: '',
    validate(v: string) {
      const reg = /^[A-Za-z]+$/;
      if (!reg.test(v)) {
        return '项目名称必须为英文字母';
      }
      if (v.length > 0) {
        return true;
      }
      return '项目名称必须输入';
      
    },
  });
}

// 选择tags
function getTagsType(TAGS_LIST: string) {
  return makeList({
    choices: TAGS_LIST,
    message: '请选择tag号',
    defaultValue: TAGS_LIST[0],
  });
}

// 安装缓存目录 用于文件拷
function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`);
}

/** 通过API获取项目模板 */
async function getTemplateFromAPI(): Promise<projectTemplateType[]> {
    try {
      const data = projectData;
      log.verbose('template', data as any);
      if(Array.isArray(data) && data.length > 0) {
        return data;
      } else {
        throw new Error('项目模板不存在！');
      }
    } catch (e) {
      printErrorLog(e, 'error');
      return [];
    }
  }


export async function getProjectTemplate(type: string, name?: string, opts?: optType) {
    // 获取项目模板
    const ADD_TEMPLATE = await getTemplateFromAPI();
  
    // 项目名称
    let addName; // --project  xx
    if (name) {
      addName = name; 
    } else {
      addName = await getAddName();
    }
    log.verbose('addName', addName);
  
    // 项目模板
    const { project = null } = opts ?? {};
    let selectedTemplate; // 项目模板信息
    if (project) {
      selectedTemplate = ADD_TEMPLATE.find(tp => tp.value === project);
      if (!selectedTemplate) {
        throw new Error(`项目模板 ${project} 不存在！`);
      }
    } else {
      const addTemplate = await makeList({
        choices: ADD_TEMPLATE,
        message: '请选择项目模板',
      });
      selectedTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate);
    }
    log.verbose('selectedTemplate', selectedTemplate as any);
    if(!selectedTemplate) throw new Error('页面模板不存在！')
  
    // 获取tag号
    const tagsList = await getTagsAllList(selectedTemplate?.projectId as string);
    log.verbose('tagsList', tagsList);
    selectedTemplate.tags = await getTagsType(tagsList);
    // 生成缓存目录
    const targetPath = makeTargetPath();
    return {
      type: type,
      name: addName,
      template: selectedTemplate,
      targetPath,
    };
  }