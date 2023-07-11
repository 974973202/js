import {
  defaultRequestInterceptor,
  defaultResponseInterceptor,
  getInitialState as _getInitialState,
  qiankunConfig,
  startup,
} from '@/shared';
import { configure } from 'mobx';
import request from 'umi-request';

import routes from '../config/routes';

export const getInitialState = async () => _getInitialState();
export const qiankun = qiankunConfig;

request.interceptors.request.use(defaultRequestInterceptor('/api'), { global: false });
request.interceptors.response.use(defaultResponseInterceptor);

// 配置mobx不使用proxy
configure({ useProxies: 'never', enforceActions: 'never' });

startup({ routes: routes });
