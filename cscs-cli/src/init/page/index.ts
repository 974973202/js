import { log, makeInput, makeList, printErrorLog } from "../../utils";
import { pageData } from "../request";
import { optType, pageTemplateType } from "../type";



// 通过API获取页面模板
async function getPageFromAPI(): Promise<pageTemplateType[]> {
  try {
    const data = pageData;
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
 * 获取页面名称
 */
 async function getPageName(name?: string) {
  let addName;
  if (name) {
    addName = name; // -tp --template  xx
  } else {
    addName = await makeInput({
      message: '请输入页面名称',
      defaultValue: '',
      validate(v: string) {
        const reg = /^[A-Za-z]+$/;
        if (!reg.test(v)) {
          return '页面名称必须为英文字母';
        }
        if (v.length > 0) {
          return true;
        }
        return '页面名称必须输入';
        
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
 async function getPageSelected(list: pageTemplateType[], opts?: optType) {
  const { page } = opts ?? {};
  let selectedPage; // 页面模板
  if (page) {
      selectedPage = list.find(tp => tp.value === page);
    if (!selectedPage) {
      throw new Error(`页面模板 ${page} 不存在！`);
    }
  } else {
    const addPage = await makeList({
      choices: list,
      message: '请选择页面模板',
    })
    selectedPage = list.find(_ => _.value === addPage);
  }
  log.verbose('selectedPage', selectedPage as any);
  return selectedPage;
}

export async function getPageTemplate(addType: string, name?: string, opts?: optType) {
  const ADD_PAGE = await getPageFromAPI();

  let addName = await getPageName(name); // 页面名称
  let selectedPage = await getPageSelected(ADD_PAGE, opts); // 页面模板

  // 先使用本地页面模板
  // const targetPath = makeTargetPath(addType);
  return {
    type: addType,
    name: addName,
    template: selectedPage,
    // targetPath,
  };
}