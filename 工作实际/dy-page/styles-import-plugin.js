/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const stylesImportPlugin = {
  name: 'loadStyles',
  setup(build) {
    build.onLoad({ filter: /.tsx/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');
      if (/\.less/.test(contents)) {
        contents = contents.replace(/\.less(["'])/g, '.less?modules$1');
      }
      return {
        contents,
        loader: 'tsx',
      };
    });
  },
};

exports.stylesImportPlugin = stylesImportPlugin;
