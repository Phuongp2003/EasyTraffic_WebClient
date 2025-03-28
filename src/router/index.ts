import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '../layouts/BlankLayout.vue'
import HomeView from '../views/HomeView.vue'
import { authMiddleware } from '../middleware/auth'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        layout: BlankLayout,
      },
    },
    {
      path: '/',
      children: [
        {
          path: '',
          component: HomeView,
        },
        {
          path: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: 'analytics',
          component: HomeView,
        },
        {
          path: 'articles',
          children: [
            {
              path: 'tags',
              name: 'tags',
              component: () => import('../views/TagsView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'news-events',
              component: () => import('../views/articles/NewsEventsView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: ':category/create',
              component: () => import('../views/articles/ArticleEditView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: ':category/edit/:slug',
              component: () => import('../views/articles/ArticleEditView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('../views/RolesView.vue'),
        },
        {
          path: 'users',
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: '',
              component: () => import('../views/TeamListView.vue'), // Fixed import path
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'create',
              name: 'user-create',
              component: () => import('../views/UserCreateView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
        // Catch unmatched routes
        {
          path: ':pathMatch(.*)*',
          component: HomeView,
        },
      ],
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async (to, from, next) => {
        const { logout } = useAuth()
        await logout()
        next('/login')
      },
      redirect: '/login',
    },
  ],
})

// Add global auth middleware
router.beforeEach((to, from, next) => {
  if (from.path === '/login' && to.path === '/login') {
    return next(false)
  }
  return authMiddleware(to, from, next)
})

export default router
