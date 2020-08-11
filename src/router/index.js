import Vue from 'vue'
import VueRouter from 'vue-router'
import Criteria from "@/views/Criteria";
import Login from "@/views/Login";
import Award from "@/views/Award";
import Store from '@/store/index';
import Admin from "@/views/Admin";
import Houses from "@/views/Houses";
import Dashboard from "@/views/Dashboard";
import PageNotFound from "@/views/PageNotFound";
import Record from "@/views/Record";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/houses/:houseId',
        name: 'Houses',
        component: Houses
    },
    {
        path: '/criteria',
        name: 'Criteria',
        component: Criteria
    },
    {
        path: '/records',
        name: 'Record',
        component: Record
    },
    {
        path: '/award',
        name: 'Award',
        component: Award,
        beforeEnter(to, from, next) {
            if (Store.state.database.auth) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        beforeEnter(to, from, next) {
            if (Store.getters.authStatus.perm === 'Admin') {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        beforeEnter(to, from, next) {
            if (Store.state.database.auth) {
                next('/');
            } else {
                next();
            }
        }
    },
    {
        path: '/*',
        name: 'PageNotFound',
        component: PageNotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
