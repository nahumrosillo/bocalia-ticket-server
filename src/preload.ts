// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import {contextBridge, ipcRenderer} from 'electron';
import Printer from "@/models/Printer";

contextBridge.exposeInMainWorld('electronAPI', {
    testPrinter: (jsonPrinter: Printer): Promise<any> => ipcRenderer.invoke('test-printer', {
        jsonPrinter
    })
});