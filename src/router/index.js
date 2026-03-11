import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/',
            name: 'home',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/employees',
            name: 'employees',
            component: () => import('../views/Employees.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/attendance',
            name: 'attendance',
            component: () => import('../views/Attendance.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/leave',
            name: 'leave',
            component: () => import('../views/Leave.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/overtime',
            name: 'overtime',
            component: () => import('../views/Overtime.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/payroll',
            name: 'payroll',
            component: () => import('../views/Payroll.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/performance',
            name: 'performance',
            component: () => import('../views/Performance.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/reviews',
            name: 'reviews',
            component: () => import('../views/Reviews.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/recruitment',
            name: 'recruitment',
            component: () => import('../views/Recruitment.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/user-management',
            name: 'user-management',
            component: () => import('../views/UserManagement.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router
