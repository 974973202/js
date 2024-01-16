/**
 * 代替try catch错误处理的简单封装
 * @param { Promise } promise - 请求函数
 * @param { Object= } errorExt - 传递给error对象的附加信息
 * @return { Promise }
 * @description const [err, data] = await to(getList(params));
 * if (err) return;
 */
export function to<T = Record<string, unknown>, U = Error>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
): Promise<[U, T] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, any]>((error: U) => {
      if (errorExt) {
        // eslint-disable-next-line prefer-object-spread
        const parsedError = Object.assign({}, error, errorExt);
        return [parsedError, {}];
      }

      return [error, {}];
    });
}

export default to;
