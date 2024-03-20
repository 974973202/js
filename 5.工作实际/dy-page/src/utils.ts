/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-07-27 09:23:38
 * @LastEditors: wujing wujing@chinacscs.com
 * @LastEditTime: 2023-10-27 09:10:55
 * @FilePath: \amt-frontend\packages\dynamic-page\src\utils.ts
 * @Description:
 *
 */
/**
 * 获取url参数
 * @returns url参数
 */
export function getSearchParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params: any = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

const TOKEN_KEY = '_token';

/**
 * 获取token
 * @returns token
 */
export function getToken() {
  const tokenStr = localStorage.getItem(TOKEN_KEY);
  return tokenStr ? JSON.parse(tokenStr) : null;
}

/**
 * Blob格式下载
 * @param name string
 * @param blob Blob
 * @param ext string 后缀名
 */
export function downloadBlob(name: string, blob: Blob, ext?: string) {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = decodeURI(name) + (ext ? '.' + ext : '');
  link.style.display = 'none';
  let event;
  try {
    event = new MouseEvent('click');
  } catch {
    event = document.createEvent('MouseEvent');
    (event as MouseEvent).initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  link.dispatchEvent(event);
}

interface RouteConfig {
  name?: string;
  path: string;
  title?: string;
  component: string;
  wrapper?: string;
  redirect?: string;
  routes?: RouteConfig[];
  [key: string]: any;
}

// 过滤掉旧版本的路由
export function filterStaleDynamicPageRoutes(routes: RouteConfig[]) {
  const staleRouteComponents = new Set([
    '@/.components/pages/framework/sys-config/dynamic-page-manage',
    '@/.components/pages/framework/sys-config/dynamic-page-manage/index-table',
    '@/.components/pages/framework/sys-config/dynamic-page-manage/online-table',
    '@/.components/pages/framework/sys-config/dynamic-page-group',
    '@/.components/pages/framework/sys-config/dynamic-page-group/index-table',
    '@/.components/pages/framework/sys-config/dynamic-page-group/group-table',
  ]);
  return routes.filter((route) => {
    return !staleRouteComponents.has(route?.component);
  });
}

export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

export function b64EncodeUnicode(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([\dA-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode(Number.parseInt('0x' + p1, 16));
    }),
  );
}
