import { log, makeInput, makeList, printErrorLog } from "../../utils";
import { fileData } from "../request";
import { fileTemplateType, optType } from "../type";



// 通过API获取文件模板
async function getFileFromAPI(): Promise<fileTemplateType[]> {
  try {
    const data = fileData
    log.verbose('page', data as any);
    if(Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      throw new Error('页面模板不存在！');
    }
  } catch (e) {
    printErrorLog(e, 'error');
    return [];
  }
}

/**
 * 获取文件名称
 */
async function getFileName(name?: string) {
  let addName;
  if (name) {
    addName = name; // -tp --template  xx
  } else {
    addName = await makeInput({
      message: '请输入文件名',
      defaultValue: '',
      validate(v: string) {
        const reg = /^[A-Za-z]+$/;
        if (!reg.test(v)) {
          return '文件名称必须为英文字母';
        }
        if (v.length > 0) {
          return true;
        }
        return '文件名称必须输入';
        
      },
    });
  }
  log.verbose('addName', addName);
  return addName;
}

/**
 * 获取文件模板
 * @param list 
 * @param opts 
 */
async function getFileSelected(list: fileTemplateType[], opts?: optType) {
  const { file } = opts ?? {};
  let selectedFile; // 文件模板
  if (file) {
      selectedFile = list.find(tp => tp.value === file);
    if (!selectedFile) {
      throw new Error(`页面模板 ${file} 不存在！`);
    }
  } else {
    const addPage = await makeList({
      choices: list,
      message: '请选择文件模板',
    })
    selectedFile = list.find(_ => _.value === addPage);
  }
  log.verbose('selectedFile', selectedFile as any);
  return selectedFile;
}

export async function getFileTemplate(addType: string, name?: string, opts?: optType) {
    const ADD_File = await getFileFromAPI();

    const addName = await getFileName(name); // 文件名称

    const selectedFile = await getFileSelected(ADD_File, opts); // 文件模板
  
    return {
      type: addType,
      name: addName,
      template: selectedFile,
    };
}