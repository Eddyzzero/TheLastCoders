
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login-choice",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login-choice"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/skills"
  },
  {
    "renderMode": 2,
    "route": "/users"
  },
  {
    "renderMode": 1,
    "route": "/user-profile/*"
  },
  {
    "renderMode": 2,
    "route": "/admin/users"
  },
  {
    "renderMode": 2,
    "route": "/home"
  },
  {
    "renderMode": 1,
    "route": "/home/add"
  },
  {
    "renderMode": 1,
    "route": "/home/*"
  },
  {
    "renderMode": 1,
    "route": "/link/*"
  },
  {
    "renderMode": 2,
    "route": "/policy"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login-choice",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 33107, hash: '7719de6fe824af6b455f3e43fad5417ad8edf72752de34d8ed36d918e52412fd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 13534, hash: '0ef2963b642e0bc443ebea40d0cf8f525a86745b7b96b28346d0e2e719ea7959', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login-choice/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/login-choice_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'admin/users/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/admin_users_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'policy/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/policy_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'users/index.html': {size: 37079, hash: '127521e5ca91dc23240c0a3d00818ca65e4f4e057bfe23e0aba71289b15fc067', text: () => import('./assets-chunks/users_index_html.mjs').then(m => m.default)},
    'styles-7GPMBVEM.css': {size: 67842, hash: 'nbHj4RzF7Dw', text: () => import('./assets-chunks/styles-7GPMBVEM_css.mjs').then(m => m.default)}
  },
};
