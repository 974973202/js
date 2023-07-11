import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export function combineRoutes() {
  const routesPath = path.join(process.cwd(), 'src/.components/routes');
  const routeFiles = fs.readdirSync(routesPath);
  const importStatements = [];
  const contents = [];
  for (const fileName of routeFiles) {
    if (fileName.match(/route.ts$/)) {
      let name = fileName.split('.')[0];
      if (name !== 'route') {
        name = _.camelCase(name);
        importStatements.push({
          name,
          code: `import ${name} from './${path.parse(fileName).name}'` + '\n',
        });
      } else {
        console.error(`Invalid name of route config file! file: ${fileName}`);
      }
    }
  }
  contents.push(...importStatements.map((i) => i.code));

  const spreads = importStatements.map((i) => `...${i.name}`).join(',');

  contents.push(`export default [${spreads}]`);

  fs.writeFileSync(path.join(routesPath, 'index.ts'), contents.join(''));
}
