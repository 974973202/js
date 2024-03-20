## yargs
- https://juejin.cn/post/7067338718251745317  


```js
// @lerna/core
import dedent from "dedent";
import log from "npmlog";
import os from "os";
import yargs from "yargs/yargs";

/**
 * A factory that returns a yargs() instance configured with everything except commands.
 * Chain .parse() from this method to invoke.
 *
 * @param {Array = []} argv
 * @param {String = process.cwd()} cwd
 */
export function lernaCLI(argv?: any, cwd?: any) {
  const cli = yargs(argv, cwd);

  return globalOptions(cli)
  // 定义使用方法：.usage("Usage: $0 <command> [options]")
    .usage("Usage: $0 <command> [options]")
    // 定义至少需要接收一个参数
    .demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
    // 定义如果命令或者参数输入错误提示最相近的命令
    .recommendCommands()
    // 定义如果输入的命令没有，则提示未识别的参数：.strict()
    // ERR! lerna 是指 ls?
    .strict()
    .fail((msg: any, err: any) => {
      // certain yargs validations throw strings :P
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== "ValidationError" && !actual.pkg) {
        // the recommendCommands() message is too terse
        if (/Did you mean/.test(actual.message)) {
          // TODO: refactor to address type issues
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          log.error("lerna", `Unknown command "${cli.parsed.argv._[0]}"`);
        }

        log.error("lerna", actual.message);
      }

      // exit non-zero so the CLI can be usefully chained
      cli.exit(actual.exitCode > 0 ? actual.exitCode : 1, actual);
    })
    .alias("h", "help")
    .alias("v", "version")
    // wrap定义了命令内容的宽度为终端的整个宽度  epilogue定义了命令输入内容结尾显示的内容
    .wrap(cli.terminalWidth()).epilogue(dedent`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.
      For more information, check out the docs at https://lerna.js.org/docs/introduction
    `);
}

function globalOptions(argv: any) {
  // 注册全局命令
  const opts = {
    loglevel: {
      defaultDescription: "info",
      describe: "What level of logs to report.",
      type: "string",
    },
    concurrency: {
      defaultDescription: os.cpus().length,
      describe: "How many processes to use when lerna parallelizes tasks.",
      type: "number",
      requiresArg: true,
    },
    "reject-cycles": {
      describe: "Fail if a cycle is detected among dependencies.",
      type: "boolean",
    },
    "no-progress": {
      describe: "Disable progress bars. (Always off in CI)",
      type: "boolean",
    },
    progress: {
      // proxy for --no-progress
      hidden: true,
      type: "boolean",
    },
    "no-sort": {
      describe: "Do not sort packages topologically (dependencies before dependents).",
      type: "boolean",
    },
    sort: {
      // proxy for --no-sort
      hidden: true,
      type: "boolean",
    },
    "max-buffer": {
      describe: "Set max-buffer (in bytes) for subcommand execution",
      type: "number",
      requiresArg: true,
    },
  };

  // group options under "Global Options:" header
  const globalKeys = Object.keys(opts).concat(["help", "version"]);

  return argv.options(opts).group(globalKeys, "Global Options:").option("ci", {
    hidden: true,
    type: "boolean",
  });
}

```

```js
import { lernaCLI } from "@lerna/core";
import * as addCmd from "@lerna/commands/add/command";

lernaCLI()
    .command(addCmd) // 提供子命令
```