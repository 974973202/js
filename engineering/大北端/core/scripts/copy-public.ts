import * as fs from 'fs';
import * as path from 'path';
import cpy from 'cpy';

export async function copyPublic() {
  if (fs.existsSync('src/.components/public')) {
    await cpy('public/*/**', path.resolve('./'), { cwd: path.resolve('src/.components/'), parents: true });
  }
  if (fs.existsSync('public-custom')) {
    await cpy('./*/**', path.resolve('./public'), { cwd: path.resolve('public-custom'), parents: true });
  }
}
