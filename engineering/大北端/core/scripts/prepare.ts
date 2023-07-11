import { combineRoutes } from './combine-routes';
import { combineAccess } from './combine-access';
import { createAppFile } from './create-app';
import { createOverrideRoutes } from './create-override-routes';
import { createAccessFile } from './create-access';
import { copyPublic } from './copy-public';

combineRoutes(); // 合并路由
combineAccess(); // 合并权限
createAppFile(); // 写入 app.tsx
createOverrideRoutes(); // 根据src/page目录生成路由
createAccessFile(); // 写入权限文件
copyPublic(); // copy 静态文件
