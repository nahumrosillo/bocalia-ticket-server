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


      <ion-item v-for="printer in printers" href="#" :key="printer.name">
        <ion-label>{{ printer.toString() }}</ion-label>
      </ion-item>

      <ion-button @click="$router.push('/about')">IR A About</ion-button>


      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon :src="icon"></ion-icon>
        </ion-fab-button>
      </ion-fab>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
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
import {inject, ref} from "vue";
import IStorage from "@/plugins/storage-manager/IStorage";
import Printer from "@/models/Printer";

const storeManager = inject('StoreManager') as IStorage;
const printers = ref<Printer[]>([]);

const init = async () => {


  await storeManager.setConfig('printers', [
    Printer.fromJson({name: 'Impresora 1', ip: '192.168.1.100', port: 9100}),
    Printer.fromJson({name: 'Impresora 2', ip: '192.168.1.101', port: 9100}),
    Printer.fromJson({name: 'Impresora 3', ip: '192.168.1.102', port: 9100}),
  ]);

  const printersTmp = await storeManager.getConfig('printers') || [];
  printers.value = printersTmp.map(p => Printer.fromJson(p));
}


init();

</script>

<style scoped>

</style>