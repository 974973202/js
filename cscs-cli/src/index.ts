import importLocal from 'import-local';
import { log } from './utils/index.js';
import { filename } from 'dirname-filename-esm';
import entry from './lib/index.js';
import figlet from 'figlet';
import lolcat from 'lolcatjs'

const text = figlet.textSync("CSCS", {
  font: "Alligator",
  horizontalLayout: "default",
  verticalLayout: "default",
  whitespaceBreak: true,
  width: 100,
})

lolcat.fromString(text)

const __filename = filename(import.meta);

if (importLocal(__filename)) {
  log.info('cscs-cli', '本地base');
} else {
  entry();
}
