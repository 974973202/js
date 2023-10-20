import log from 'npmlog';
import isDebug from './isDebug.js';

/**
 * npmlog包的level属性是用来设置日志的级别的。级别分为以下几种：
 * 1. silly：最低级别的日志，用于输出详细的调试信息。
 * 2. verbose：用于输出详细的信息，但比silly级别要高。
 * 3. info：用于输出一般的信息，比verbose级别要高。
 * 4. http：用于输出HTTP请求相关的信息。
 * 5. warn：用于输出警告信息，表示可能存在问题。
 * 6. error：用于输出错误信息，表示出现了错误。
 * 7. silent：最高级别的日志，用于关闭所有日志输出。
 * 通过设置level属性，可以控制输出哪个级别的日志信息。
 * 默认情况下，level属性的值为info，即只输出info级别及以上的日志。
 * 可以通过修改level属性的值来调整日志的输出级别。
 */
if (isDebug()) {
  log.level = 'verbose';
} else {
  log.level = 'info';
}

log.heading = 'cscs';
log.addLevel('success', 2000, { fg: 'green', bold: true });

export default log;
