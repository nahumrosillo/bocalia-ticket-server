export default class PrinterEncoder {


    printerModel: string;
    language: string;

    constructor(printerModel: string, language: string) {
        this.printerModel = printerModel;
        this.language = language;
    }

    toJson() {
        return {
            printerModel: this.printerModel,
            language: this.language
        }
    }

    static fromJson(json: any) {
        return new PrinterEncoder(json.printerModel, json.language);
    }

    toString() {
        return `${this.printerModel} - ${this.language}`;
    }

    
}