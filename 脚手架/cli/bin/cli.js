#!/usr/bin/env node

import importLocal from 'import-local';
import { log } from '../utils/index.js';
import { filename, dirname } from 'dirname-filename-esm';
import entry from '../lib/index.js';
import figlet from 'figlet';
import lolcat from 'lolcatjs'

const text = figlet.textSync("liangzx", {
  // font: "Doom",
  // font: "Univers",
  // font: "Sub-Zero",
  font: "alligator",
  // font: "banner4",
  horizontalLayout: "default",
  verticalLayout: "default",
  whitespaceBreak: true,
  width: 100,
})

lolcat.fromString(text)

const __filename = filename(import.meta); // 当前执行文件 C:\Users\liangzx\Desktop\cli-study\bin\cli.js

if (importLocal(__filename)) {
  log.info('cli', '使用本次本地版本');
} else {
  entry(process.argv.slice(2));
}
