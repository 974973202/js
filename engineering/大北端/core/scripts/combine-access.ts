import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export function combineAccess() {
  const accessPath = path.join(process.cwd(), 'src/.components/access');
  const accessFiles = fs.readdirSync(accessPath);
  const importStatements = [];
  const contents = [];
  for (const fileName of accessFiles) {
    if (fileName.match(/\.access\.ts$/)) {
      let name = fileName.split('.')[0];
      name = _.camelCase(name);
      importStatements.push({
        name,
        code: `import ${name} from './${path.parse(fileName).name}'` + '\n',
      });
    }
  }
  contents.push(...importStatements.map((i) => i.code));
  const spreads = importStatements.map((i) => `...${i.name}`).join(',');
  contents.push(`export default [${spreads}]`);

  fs.writeFileSync(path.join(accessPath, 'index.ts'), contents.join(''));
}
