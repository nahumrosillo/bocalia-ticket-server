import {Storage} from "@ionic/storage";

export default interface IStorage {
    getStore(): Promise<Storage>,
    setConfig(key: string, value: any): Promise<void>,
    getConfig(key: string): Promise<any>

}