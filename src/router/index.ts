import {createRouter, createWebHashHistory} from '@ionic/vue-router';
import PrinterListPage from '@/views/PrinterListPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import {RouteRecordRaw} from "vue-router";
import AddPrinterPage from "@/views/AddPrinterPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/printers', // Redirecciona a la ruta /home
    },
    {
        path: '/printers',
        name: 'Impresoras',
        component: PrinterListPage,
    },
    {
        path: '/add-printer',
        name: 'Añadir impresora',
        component: AddPrinterPage,
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