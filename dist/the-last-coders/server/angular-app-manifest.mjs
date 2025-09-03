
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
    'index.csr.html': {size: 33136, hash: '78c3d6fc9776ab2e64eb5bbda6be15f2b9a7382a440fbf2de46168d4d6950e7c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 13563, hash: 'd4b995ca1f3c3e76547d4293f61896ec78da6bf476530e72a67ba4a03b1605b9', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'admin/users/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/admin_users_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'policy/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/policy_index_html.mjs').then(m => m.default)},
    'login-choice/index.html': {size: 37136, hash: '33071f2b4eeb3f8d8ef20811e346cfdeacf4266d753b96b7012faa601a8a4c8b', text: () => import('./assets-chunks/login-choice_index_html.mjs').then(m => m.default)},
    'styles-3NR2FY2Y.css': {size: 74558, hash: 'nAvbJI1v1rI', text: () => import('./assets-chunks/styles-3NR2FY2Y_css.mjs').then(m => m.default)}
  },
};
