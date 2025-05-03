import {Drivers, Storage} from "@ionic/storage";
import IStorage from "./IStorage";


export default {
    install(app: any) {
        app.provide('StoreManager',
            new IStorageImplementer()
        )
    }
}

class IStorageImplementer implements IStorage {
    getStore() {
        const store = new Storage({
            name: '__bocalia_tickets',
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
        });

        return store.create();
    }

    async setConfig(key: string, value: any) {
        const store = await this.getStore();
        await store.set(key, value);
    }

    async getConfig(key: string): Promise<any> {
        const store = await this.getStore();
        return store.get(key);
    }
}