import {createRouter, createWebHashHistory} from '@ionic/vue-router';
import PrinterList from '@/views/PrinterList.vue';
import AboutPage from '@/views/AboutPage.vue';
import {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/lista-de-impresoras', // Redirecciona a la ruta /home
    },
    {
        path: '/lista-de-impresoras',
        name: 'Home',
        component: PrinterList,
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;