export default class Printer {

    name: string;
    ip: string;
    port: number;

    constructor(name: string, ip: string, port: number) {
        this.name = name;
        this.ip = ip;
        this.port = port;
    }

    toString(): string {
        return `${this.name} - ${this.ip}:${this.port}`;
    }

    static fromJson(json: any) {
        return new Printer(json.name, json.ip, json.port);
    }

    toJson() {
        return {
            name: this.name,
            ip: this.ip,
            port: this.port
        }
    }
}