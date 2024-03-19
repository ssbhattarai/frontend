const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: "Home",
        meta: { requiresAuth: true },
      },
      {
        path: '/users',
        component: () => import('pages/UsersPage.vue'),
        name: "User",
        meta: { requiresAuth: true },
      },
      {
        path: '/permissions',
        component: () => import('pages/PermissionsPage.vue'),
        name: "Permission",
        meta: { requiresAuth: true },
      },
      {
        path: '/roles',
        component: () => import('pages/RolesPage.vue'),
        name: "Role",
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/admin/login',
    component: () => import('pages/LoginPage.vue'),
    name: "Login",
    meta: { requiresAuth: false },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: "Notfound",
    meta: { requiresAuth: false  },
  }
]

export default routes
