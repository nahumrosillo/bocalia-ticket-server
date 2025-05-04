<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Añadir impresora</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>

        <ion-item>
          <ion-input label="Nombre" v-model="name" type="text"
                     placeholder="Ejemplo: Impresora de la cocina"></ion-input>
        </ion-item>

        <ion-item>
          <ion-select label="Tipo de impresora" v-model="printerType"
                      @ionChange="$event => printerType = $event.detail.value">
            <ion-select-option value="webusb">Cable USB</ion-select-option>
            <ion-select-option value="webbluetooth">Bluetooth</ion-select-option>
            <ion-select-option value="network">Red</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="printerType === 'network'">
          <ion-input label="IP" v-model="ip" type="text" placeholder="Ejemplo: 192.168.1.100"></ion-input>
        </ion-item>

        <ion-item v-if="printerType === 'network'">
          <ion-input label="Puerto" v-model="port" type="number" placeholder="Ejemplo: 9100"></ion-input>
        </ion-item>
      </ion-list>

      <ion-button expand="block" @click="handleSubmit">Guardar impresora</ion-button>

      <ion-item>
        <ion-label>{{ status }}</ion-label>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {inject, onUnmounted, ref, watch, watchEffect} from 'vue';
import {useRouter} from 'vue-router';
import Printer from "@/models/Printer";
import IStorage from "@/plugins/storage-manager/IStorage";


const printerType = ref('webusb');
const name = ref('');
const ip = ref('192.168.1.100');
const port = ref(9100);

const status = ref('');
const router = useRouter();

const storeManager = inject('StoreManager') as IStorage;


const init = async () => {

}


init();
watchEffect(() => {
  const unwatch = watch(router.currentRoute, () => init());
  onUnmounted(() => {
    unwatch();
  });
});

async function handleSubmit() {
  const newPrinter = new Printer(printerType.value, name.value, ip.value, port.value);
  const allPrinters = await storeManager.getConfig('printers') || [];
  await storeManager.setConfig('printers', [...allPrinters, newPrinter]);

  status.value = 'Impresora guardada';
  router.back();
}


</script>

<style scoped>
</style>