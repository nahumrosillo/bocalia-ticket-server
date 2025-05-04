export default class Printer {

    position: number;
    type: string;
    name: string;
    ip: string;
    port: number;
    model: string;
    language: string;
    isDefault: boolean;

    constructor(position: number, type: string, name: string, ip: string, port: number, model: string, language: string, isDefault: boolean) {
        this.position = position;
        this.type = type;
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.model = model;
        this.language = language;
        this.isDefault = isDefault;
    }

    toString(): string {
        return `#${this.position} - ${this.name} - ${this.ip}:${this.port} - ${this.type} - ${this.model} - ${this.language}`;
    }

    static fromJson(json: any) {
        return new Printer(json.position, json.type, json.name, json.ip, json.port, json.model, json.language, json.isDefault);
    }

    toJson() {
        return {
            position: this.position,
            type: this.type,
            name: this.name,
            ip: this.ip,
            port: this.port,
            model: this.model,
            language: this.language,
            isDefault: this.isDefault,
        }
    }
}