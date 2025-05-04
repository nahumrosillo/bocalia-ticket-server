// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    testPrinter: (type: string, ip: string, port: string): Promise<any> => ipcRenderer.invoke('test-printer', {
        type,
        ip,
        port
    })
});