import type { Command } from 'commander';
import Cmd from '../command/index.js';

import { getProjectTemplate } from './project';
import downloadTemplate from './project/downloadTemplate.js';
import copyProjectTemplate from './project/copyProjectTemplate.js';

import { getPageTemplate } from './page';
import copyPageTemplate from './page/copyPageTemplate.js'

import { getFileTemplate } from './file'
import copyFileTemplate from './file/copyFileTemplate.js';

import { log, makeList } from '../utils/index.js';
import { ADD_TYPE, ADD_TYPE_FILE, ADD_TYPE_PAGE, ADD_TYPE_PROJECT } from './config.js';
import { infoTemplateType, optType } from './type.js';


/**
 * 根据项目类型 创建项目信息
 * @param {string} type 项目类型
 * @param {string} name 名称
 * @param opts 选项
 */
async function getSelectInfo(type: string, name?: string, opts?: optType): Promise<infoTemplateType<any>> {
  switch (type) {
    case ADD_TYPE_PROJECT:
      return getProjectTemplate(type, name, opts)
    case ADD_TYPE_PAGE:
      return getPageTemplate(type, name, opts)
    case ADD_TYPE_FILE:
      return getFileTemplate(type, name, opts)
    default:
      throw new Error(`创建的项目类型 ${type} 不支持`)
  }
}

/**
 * 获取项目类型
 * @returns 
 */
function getAddType() {
  return makeList({
    choices: ADD_TYPE,
    message: '请选择初始化类型',
    defaultValue: ADD_TYPE_PROJECT,
  });
}

/**
 * cscs init
 */
class InitCommand extends Cmd {

  get command() {
    return 'init [name]';
  }

  get description() {
    return 'cscs init 创建 项目/页面/文件';
  }

  get options() {
    return [
      ['-f, --force', '是否强制更新', false],
      ['-t, --type <type>', '项目类型(值：project/page/file)'],
      ['--project <project>', '项目名称'],
      ['--page <page>', '页面名称'],
      ['--file <file>', '文件名称'],
    ];
  }

  async action([name, opts]: [string, optType]) {
    log.verbose('init', name, opts);
    // 1.选择项目模板，生成项目信息
    let type; // 创建项目类型
    if (opts?.type) {
      type = opts?.type;
    } else {
      type = await getAddType();
    }
    log.verbose('type', type);
    const selectedTemplate = await getSelectInfo(type, name, opts);
    log.verbose('project', selectedTemplate as any);
    
    if (type === ADD_TYPE_PROJECT) { // 项目
      // 2.下载项目模板至缓存目录
      await downloadTemplate(selectedTemplate, opts);
      // 3.安装项目模板至项目目录
      await copyProjectTemplate(selectedTemplate, opts);
    } else if (type === ADD_TYPE_PAGE) { // 页面
      await copyPageTemplate(selectedTemplate, opts);
    } else if (type === ADD_TYPE_FILE) { // 文件
      await copyFileTemplate(selectedTemplate, opts);
    }
  }
}

function Init(instance: Command) {
  return new InitCommand(instance);
}

export default Init;
