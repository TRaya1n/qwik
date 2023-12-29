import { Client, Events } from "discord.js";
import { QwikEventOptions } from "./interfaces/QwikEventOptions";
import { readdirSync } from "fs";
import { resolve } from "path";

class QwikEvent {
    public constructor(options: QwikEventOptions) {
        this.init(options.client, options.path)
    }


    private init(client: Client, path: any) {
        const folders = readdirSync(path);
        for (const folder of folders) {
            const files = readdirSync(`${path}/${folder}/`);
            for (const file of files) {
                const f = require(resolve(path, folder, file));
                client.on(file.replace('.ts', ''), (...args) => f.Event(...args));
            }
        }
    }
}

export { 
    QwikEvent
}