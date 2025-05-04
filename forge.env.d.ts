/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

export {};

declare global {
    interface Window {
        electronAPI: {
            testPrinter: (type, ip, port) => Promise<any>;
        };
    }
}