import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import NetworkReceiptPrinter from "@point-of-sale/network-receipt-printer";
import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import {updateElectronApp} from "update-electron-app";
import Printer from "./models/Printer";
import log from 'electron-log/main';

log.initialize();
updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const createWindow = () => {

    app.setName('Bocalia Impresora de tickets');

    menuApp();

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.webContents.openDevTools();
    }

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const menuApp = () => {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: `Acerca de ${app.getName()} v${app.getVersion()}`,
                },
                {
                    label: 'Reiniciar configuración',
                    click: async () => {
                        try {
                            const win = BrowserWindow.getFocusedWindow();
                            await win?.webContents.executeJavaScript(`
                                localStorage.clear();
                                indexedDB.databases().then(dbs => {
                                    dbs.forEach(db => {
                                        indexedDB.deleteDatabase(db.name);
                                    });
                                });
                            `);

                            app.exit(0);
                        } catch (err) {
                            console.error('Error resetting configuration:', err);
                        }
                    }
                },
                {type: 'separator'},
                {role: 'quit', label: `Salir de ${app.getName()}`}
            ],
        },
    ];


    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
};

ipcMain.handle('test-printer', async (event, {jsonPrinter}) => {
    log.info('test-printer called', jsonPrinter);
    const printer = Printer.fromJson(jsonPrinter);

    try {
        const receiptPrinter = new NetworkReceiptPrinter({
            host: printer.ip,
            port: printer.port,
        })

        receiptPrinter.addEventListener('connected', async () => {
            console.log('Connected to printer');
            log.info('Connected to printer')

            const encoder = new ReceiptPrinterEncoder({
                printerModel: printer.model, language: printer.language,
            });

            encoder
                .initialize()
                .text('Test de impresora')
                .newline()
                .text(printer.toString())
                .newline()
                .cut();

            const ticketBuffer = encoder.encode();
            console.log('Ticket buffer', ticketBuffer);
            log.info('Imprimiendo');
            await receiptPrinter.print(ticketBuffer);
            await receiptPrinter.disconnect();
        });

        receiptPrinter.addEventListener('disconnected', () => {
            console.log('Disconnected from printer');
            log.info('Disconnected from printer')
        });

        receiptPrinter.addEventListener('error', (error) => {
            log.info('Error en la conexión con la impresora:', error);
        });

        await receiptPrinter.connect();

        return {success: true};
    } catch (error) {
        log.error(error.message, error.stack)
        return {success: false, error: error.message};
    }
});