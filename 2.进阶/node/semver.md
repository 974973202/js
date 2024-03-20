### 使用semver来判断某个版本号是否在范围1.0.0 - 1.2.0内，可以使用以下代码：
```js
const semver = require('semver');

const version = '1.1.0';
const range = '1.0.0 - 1.2.0';

if (semver.satisfies(version, range)) {
  console.log(`${version} is in the range ${range}`);
} else {
  console.log(`${version} is not in the range ${range}`);
}
```