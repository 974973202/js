/* eslint-disable @typescript-eslint/no-require-imports */
const { dest, src, series, watch } = require('gulp');
const del = require('del');
const { createGulpEsbuild } = require('gulp-esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { stylesImportPlugin } = require('./styles-import-plugin');
const { exec } = require('child_process');
const path = require('path');

const distDir = 'es';
const tsFileGlobs = ['src/**/*.ts', 'src/**/*.tsx'];
const otherFilesGlobs = ['src/**/*.json', 'src/**/*.md'];
const styleFileGlobs = ['src/**/*.less'];
const installFileGlobs = ['install/**/*'];

const gulpESBuild = createGulpEsbuild({
  piping: true,
});

const gulpESBuildIncremental = createGulpEsbuild({
  incremental: true,
});

const esBuildOptions = {
  outbase: 'src/',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  tsconfig: 'tsconfig.json',
  plugins: [nodeExternalsPlugin(), stylesImportPlugin],
};

const clean = function () {
  return del([distDir + '/*']);
};

const buildModuleESBuild = function () {
  return src(tsFileGlobs).pipe(gulpESBuild(esBuildOptions)).pipe(dest(distDir));
};

const buildModuleESBuildIncremental = function () {
  return src(tsFileGlobs).pipe(gulpESBuildIncremental(esBuildOptions)).pipe(dest(distDir));
};

const copyStyles = function () {
  return src(styleFileGlobs).pipe(dest(distDir));
};

// 如果有其它文件请添加
const copyOtherFiles = function () {
  return src(otherFilesGlobs, { base: 'src' }).pipe(dest(distDir));
};

const publishAndUpdate = function (cb) {
  exec('yalc push --private', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);

    if (stdout) {
      const messages = stdout.split('\n');
      const projects = messages
        .filter((i) => i.match(/^Package\s/))
        .map((i) =>
          i
            .split('==>')[1]
            .replace(/\s/g, '')
            .replace(/[/\\]node_modules.+/g, ''),
        );

      for (const projectPath of projects) {
        const installScriptPath = path.join(projectPath, 'node_modules/@cscs-fe/dynamic-page/install/install.js');
        // 抹掉INIT_CWD，install指定projectPath为cwd
        exec(`cd ${projectPath} & node ${installScriptPath}`, { env: { INIT_CWD: '' } }, (error, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);
        });
      }
    }
    if (error !== null) {
      console.log(`exec error: ${error}`);
    } else {
      cb();
    }
  });
};

// 全量编译
const build = series([clean, buildModuleESBuild, copyStyles, copyOtherFiles]);

// 监听文件变化增量编译，重新编译并发布
const buildWatch = function () {
  watch(tsFileGlobs, {}, series([buildModuleESBuildIncremental, publishAndUpdate]));
  watch(styleFileGlobs, {}, series([copyStyles, publishAndUpdate]));
  watch(otherFilesGlobs, {}, series([copyOtherFiles, publishAndUpdate]));
  watch(installFileGlobs, {}, series([publishAndUpdate]));
};

exports.build = build;
exports.watch = series([build, publishAndUpdate, buildWatch]);
