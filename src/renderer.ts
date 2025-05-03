import {createApp} from 'vue';
import {IonicVue} from '@ionic/vue';
import App from './App.vue';
import router from './router';

// Importa los estilos de Ionic
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import StorageManager from "@/plugins/storage-manager/StorageManager";


const app = createApp(App);

app.use(IonicVue);
app.use(router);
app.use(StorageManager)
router.isReady().then(() => {
    app.mount('#app');
});