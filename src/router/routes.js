const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: "Home"
      },
      {
        path: '/users',
        component: () => import('pages/UsersPage.vue'),
        name: "User"
      },
    ],
  },

  {
    path: '/admin/login',
    component: () => import('pages/LoginPage.vue'),
    name: "Login"
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
