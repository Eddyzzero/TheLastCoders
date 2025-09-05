
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/TheLastCoders/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/TheLastCoders/login-choice",
    "route": "/TheLastCoders"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/login-choice"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/login"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/register"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/skills"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/users"
  },
  {
    "renderMode": 1,
    "route": "/TheLastCoders/user-profile/*"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/admin/users"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/home"
  },
  {
    "renderMode": 1,
    "route": "/TheLastCoders/home/add"
  },
  {
    "renderMode": 1,
    "route": "/TheLastCoders/home/*"
  },
  {
    "renderMode": 1,
    "route": "/TheLastCoders/link/*"
  },
  {
    "renderMode": 2,
    "route": "/TheLastCoders/policy"
  },
  {
    "renderMode": 2,
    "redirectTo": "/TheLastCoders/login-choice",
    "route": "/TheLastCoders/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 33136, hash: 'b5a0c15443afdce613e3d3dd2901b6959fe99514a8b257d42ca1d8a47376a2a2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 13563, hash: 'e4e848e04db2bf49ef539ae211959718884f72aa48652e95e1d48ad7e3893490', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'admin/users/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/admin_users_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'policy/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/policy_index_html.mjs').then(m => m.default)},
    'login-choice/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/login-choice_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 37137, hash: '6aae6a117814e61911713f3ede7863e53c5e6f559367e7df3e7842a95e147827', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'styles-PDK7XVGA.css': {size: 67894, hash: 'bsmK0cB7ins', text: () => import('./assets-chunks/styles-PDK7XVGA_css.mjs').then(m => m.default)}
  },
};
