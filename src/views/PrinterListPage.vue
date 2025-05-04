<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Servidor de tickets</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Servidor de tickets</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item v-for="(printer, index) in printers" @click="showActionSheet(printer)" :key="index" :index="index" :color="printer.isDefault ? 'success' : ''" >
        <ion-label>{{ printer.toString() }}</ion-label>
      </ion-item>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="$router.push('/add-printer')">
          <ion-icon :src="icon"></ion-icon>
        </ion-fab-button>
      </ion-fab>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  actionSheetController,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

import icon from '@/assets/add-outline.svg';
import {inject, onUnmounted, ref, watch, watchEffect} from "vue";
import IStorage from "@/plugins/storage-manager/IStorage";
import Printer from "@/models/Printer";
import router from "@/router";


const storeManager = inject('StoreManager') as IStorage;
const printers = ref<Printer[]>([]);

const init = async () => {
  const printersTmp = await storeManager.getConfig('printers') || [];
  printers.value = printersTmp.map(p => Printer.fromJson(p)).sort((a, b) => a.position - b.position);
}


init();
watchEffect(() => {
  const unwatch = watch(router.currentRoute, () => init());
  onUnmounted(() => {
    unwatch();
  });
});

const showActionSheet = async (printer: Printer) => {
  const actionSheet = await actionSheetController.create({
    header: 'Opciones',
    buttons: [
      {
        text: 'Probar conexión',
        handler: async () => {
          window.electronAPI.testPrinter(printer.toJson());
        }
      },
      {
        text: 'Editar impresora',
        handler: async () => {
          router.push({
            path: '/add-printer',
            query: {printer: JSON.stringify(printer.toJson())}
          });
        }
      },
      {
        text: 'Borrar',
        role: 'destructive',
        handler: async () => {
          const index = printers.value.findIndex(p => p.name === printer.name);
          printers.value.splice(index, 1);
          const jsonPrinters = printers.value.map(p => p.toJson());
          await storeManager.setConfig('printers', jsonPrinters);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
  });
  await actionSheet.present();
};

</script>

<style scoped>
</style>