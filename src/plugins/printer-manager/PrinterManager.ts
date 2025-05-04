


export default {
    install(app: any) {
        app.provide('PrinterManager',
            new IStorageImplementer()
        )
    }
}

class IStorageImplementer {
}