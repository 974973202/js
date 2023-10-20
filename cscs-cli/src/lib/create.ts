import path from 'node:path';
import { Command, program } from 'commander';
import { dirname } from 'dirname-filename-esm';
import fse from 'fs-extra';
import { log } from '../utils/index.js';
import semver from 'semver';
import chalk from 'chalk';
import { getNpmSemverVersion } from '../utils/get-npm-info';
import leven from 'leven'


const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, '../package.json');

const pkg = fse.readJsonSync(pkgPath);

const LOWEST_NODE_VERSION = pkg.engines.node

function checkNodeVersion() {
  log.info('node version', process.version);
  if (!semver.satisfies(process.version, LOWEST_NODE_VERSION, { includePrerelease: true })) {
    throw new Error(chalk.red(`cli 需要安装 ${LOWEST_NODE_VERSION} 以上版本的 Node.js`));
  }
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName, 'http://repo.chinacscs.com:8081/repository/npm_internal/');
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn('cli', `当前版本：${currentVersion}，最新版本：${lastVersion}
请手动更新 ${npmName}，更新命令： npm install ${npmName} -g`)
  }
}

// 猜测用户意图
function suggestCommands(unknownCommand: string) {
  const availableCommands = program.commands.map((cmd: any) => cmd._name);

  let suggestion: any;

  availableCommands.forEach(cmd => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    log.info('', chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
    // console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  } else {
    log.error('未知的命令：', unknownCommand)
  }
}

async function preAction() {
  // 检查Node版本
  checkNodeVersion();
  // 检查脚手架是否有更新版本
  await checkGlobalUpdate()
}

function createCLI(): Command {
  log.info('version', pkg.version);
  // name 和 usage 方法分别配置 cli 名称和 --help 第一行提示
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook('preAction', preAction);

  program.on('option:debug', function() {
    console.log(program.opts());
    if (program.opts().debug) {
      log.verbose('debug', 'launch debug mode');
    }
  });

  // 未知相似命令智能提示
  program.arguments('<command>').action(cmd => {
    suggestCommands(cmd);
  });

  // program.on('command:*', function(cmd) {
  //   // log.error('未知的命令：', cmd[0]);
  //   suggestCommands(cmd);
  // });
  return program;
}

export default createCLI