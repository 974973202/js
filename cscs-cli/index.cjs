
const code = `import { test } from '../../xxx'
import tttt from '7767';
import test2 from './../../utils/ooo';
import { test1 } from '../../shared/d'
export default () => {}`;

const regex = /import\s+[\w{},\s]+from\s+['"](.+?)['"]/g;

// 匹配到约定的路径停止匹配
let newCode = code.replace(regex, (match, importStatement, importPath) => {
    const matchStatus = ["utils", "shared"].some((item) => importStatement.includes(item))
    if (matchStatus) {
        return match.replace(importStatement, '@9999')
    }
    return match;
});


console.log(newCode, 'newCode');