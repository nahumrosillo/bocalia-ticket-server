export default class Printer {

    type: string;
    name: string;
    ip: string;
    port: number;

    constructor(type: string, name: string, ip: string, port: number) {
        this.type = type;
        this.name = name;
        this.ip = ip;
        this.port = port;
    }

    toString(): string {
        return `${this.name} - ${this.ip}:${this.port} - ${this.type}`;
    }

    static fromJson(json: any) {
        return new Printer(json.type, json.name, json.ip, json.port);
    }

    toJson() {
        return {
            type: this.type,
            name: this.name,
            ip: this.ip,
            port: this.port
        }
    }
}