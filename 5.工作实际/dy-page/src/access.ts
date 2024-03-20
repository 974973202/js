/*
 * @Author: wujing wujing@chinacscs.com
 * @Date: 2023-07-26 17:22:41
 * @LastEditors: xull xull@chinacscs.com
 * @LastEditTime: 2023-10-11 14:39:46
 * @FilePath: \frontend\packages\dynamic-page\src\access.ts
 * @Description:
 *
 */

export default function dynamicPageAccess(currentUser: any, canAccess: any) {
  return {
    canAddPageConfig: canAccess(currentUser, 'btn:config:page_show:add'),
    canEditPageConfig: canAccess(currentUser, 'btn:config:page_show:edit'),
    canDeletePageConfig: canAccess(currentUser, 'btn:config:page_show:delete'),
    canImportPageConfig: canAccess(currentUser, 'btn:config:page_show:import'),
    canExportPageConfig: canAccess(currentUser, 'btn:config:page_show:export'),

    canAddPageFormConfig: canAccess(currentUser, 'btn:config:page_operation:add'),
    canEditPageFormConfig: canAccess(currentUser, 'btn:config:page_operation:edit'),
    canDeletePageFormConfig: canAccess(currentUser, 'btn:config:page_operation:delete'),
    canImportPageFormConfig: canAccess(currentUser, 'btn:config:page_operation:import'),
    canExportPageFormConfig: canAccess(currentUser, 'btn:config:page_operation:export'),

    canAddDynamicSql: canAccess(currentUser, 'btn:config:dynamic_page:operation'),
    canAddDynamicGroup: canAccess(currentUser, 'btn:config:dynamic_group:operation'),

    canOptionsDynamicImport: canAccess(currentUser, 'btn:config:dynamic_import:operation'), // 动态导入管理操作
  };
}

export type DynamicPageAccessType = ReturnType<typeof dynamicPageAccess>;
