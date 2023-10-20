import log from './log.js';
import isDebug from './isDebug.js';
import { makeList, makeInput, InquirerListObj } from './inquirer.js';
import { getTagsAllList } from './npm.js';

export function printErrorLog(e: any, type: string) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

export {
  log,
  isDebug,
  makeList,
  makeInput,
  getTagsAllList,
  InquirerListObj,
};
