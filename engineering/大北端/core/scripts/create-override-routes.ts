import * as fs from 'fs';
import recursive from 'recursive-readdir';

export function createOverrideRoutes() {
  recursive('src/pages', function (err, files) {
    const directories = files
      .filter((file) => file.match(/\.tsx$/))
      .map((i) =>
        i
          .replace(/\\/g, '/')
          .replace(/\/index\.tsx$/, '')
          .replace(/src\/pages/, ''),
      );

    const list = directories.map((i) => `'${i}'`).join(',');

    fs.writeFileSync(
      'src/.core/utils/override-routes.ts',
      `const overrideRoutes = [${list}];export default overrideRoutes;`,
    );
  });
}
