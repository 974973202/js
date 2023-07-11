import * as fs from 'fs';
import * as path from 'path';

const customFilePath = 'src/app.custom.tsx';

export function createAppFile() {
  const exist = fs.existsSync(customFilePath);
  let content = '';
  if (exist) {
    content = fs.readFileSync(customFilePath, { encoding: 'utf-8' });
  } else {
    content = fs.readFileSync(path.join(__dirname, 'templates/app.tsx'), { encoding: 'utf-8' });
  }
  fs.writeFileSync('src/app.tsx', content);
}
