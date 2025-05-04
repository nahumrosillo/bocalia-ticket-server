<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEditMode ? 'Modificar Impresora' : 'Nueva Impresora' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="handleSubmit">
        <ion-list>
          <ion-item>
            <ion-input label="Nombre" v-model="name" type="text" required
                       placeholder="Ejemplo: Impresora de la cocina"></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label="Posición" v-model="position" type="number" required
                       :disabled="isEditMode"
                       placeholder="Ejemplo: 1"></ion-input>
          </ion-item>


          <ion-item>
            <ion-select label="Conexión" v-model="conectionType" required
                        cancelText="Cancelar"
                        okText="Aceptar"
                        @ionChange="$event => conectionType = $event.detail.value">
              <ion-select-option value="webusb">Cable USB</ion-select-option>
              <ion-select-option value="webbluetooth">Bluetooth</ion-select-option>
              <ion-select-option value="network">Cable de red</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item v-if="conectionType === 'network'">
            <ion-input label="IP" v-model="ip" type="text" placeholder="Ejemplo: 192.168.1.100"></ion-input>
          </ion-item>

          <ion-item v-if="conectionType === 'network'">
            <ion-input label="Puerto" v-model="port" type="number" placeholder="Ejemplo: 9100"></ion-input>
          </ion-item>

          <ion-item>
            <ion-select label="Modelo de impresora" v-model="printerModel"
                        cancelText="Cancelar"
                        okText="Aceptar">
              <ion-select-option v-for="model in ReceiptPrinterEncoder.printerModels" :key="model.id" :value="model.id">
                {{
                  model.name
                }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-toggle v-model="isDefault">Usar como impresora predeterminada</ion-toggle>
          </ion-item>

          <ion-item>
            <ion-select label="Lenguaje" v-model="language" @ionChange="$event => language = $event.detail.value"
                        required
                        cancelText="Cancelar"
                        okText="Aceptar">
              <ion-select-option value="esc-pos">esc-pos</ion-select-option>
              <ion-select-option value="star-line">star-line</ion-select-option>
              <ion-select-option value="star-prnt">star-prnt</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <ion-button expand="block" type="submit">Guardar impresora</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  IonToggle
} from '@ionic/vue';
import {inject, onUnmounted, ref, watch, watchEffect} from 'vue';
import {useRouter} from 'vue-router';
import Printer from "@/models/Printer";
import IStorage from "@/plugins/storage-manager/IStorage";
import ReceiptPrinterEncoder from '@/external-dependencies/receipt-printer-encoder.esm.js';


let isEditMode = false;
const route = useRouter().currentRoute.value;
const printerJson = route.query.printer ? JSON.parse(route.query.printer as string) : null;

const conectionType = ref(printerJson?.type || 'webusb');
const name = ref(printerJson?.name || '');
const position = ref(printerJson?.position || 1);
const ip = ref(printerJson?.ip || '192.168.1.100');
const port = ref(printerJson?.port || 9100);

const printerModel = ref(printerJson?.model || null);
const language = ref(printerJson?.language || 'esc-pos');
const isDefault = ref(printerJson?.isDefault || false);

const router = useRouter();

const storeManager = inject('StoreManager') as IStorage;


const init = async () => {
  const printerJson = route.query.printer ? JSON.parse(route.query.printer as string) : null;
  if (printerJson) {
    isEditMode = true;

    conectionType.value = printerJson.type;
    name.value = printerJson.name;
    position.value = printerJson.position;
    port.value = printerJson.port;
    printerModel.value = printerJson.model;
    language.value = printerJson.language;
  }
}


init();
watchEffect(() => {
  const unwatch = watch(router.currentRoute, () => init());
  onUnmounted(() => {
    unwatch();
  });
});

async function handleSubmit() {

  let allPrinters = await storeManager.getConfig('printers') || [];
  if (isEditMode) {
    allPrinters = allPrinters.filter(p => p.position !== position.value);
  }

  if (isDefault.value === true) {
    allPrinters = allPrinters.map(printer => ({
      ...printer,
      isDefault: false
    }));
  }


  const newPrinter = new Printer(position.value, conectionType.value, name.value, ip.value, port.value, printerModel.value, language.value, isDefault.value);
  await storeManager.setConfig('printers', [...allPrinters, newPrinter]);

  router.back();
}


</script>

<style scoped>
</style>