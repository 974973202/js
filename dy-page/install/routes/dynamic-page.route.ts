export default [
  {
    path: '/config/dynamic_page',
    title: '动态页面管理',
    component: '@/.components/pages/dynamic-page/dynamic-page-manage',
    accessCode: 'menu:config:dynamic_page',
  },
  {
    path: '/config/dynamic_page/index/:id',
    title: '动态页面管理',
    component: '@/.components/pages/dynamic-page/dynamic-page-manage/index-table',
  },
  {
    path: '/config/dynamic_page/detail/:id',
    title: '动态页面管理',
    component: '@/.components/pages/dynamic-page/dynamic-page-manage/online-table',
  },
  {
    path: '/config/dynamic_group',
    title: '动态页面组合',
    component: '@/.components/pages/dynamic-page/dynamic-page-group',
    accessCode: 'menu:config:dynamic_group',
  },
  {
    path: '/config/dynamic_group/index/:id',
    title: '动态页面组合',
    component: '@/.components/pages/dynamic-page/dynamic-page-group/index-table',
  },
  {
    path: '/config/dynamic_group/detail/:id',
    title: '动态页面组合',
    component: '@/.components/pages/dynamic-page/dynamic-page-group/group-table',
  },
];
