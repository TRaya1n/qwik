import { QwikEventOptions } from "./interfaces/QwikEventOptions";
import { readdirSync } from "fs";
import { resolve } from "path";
import { Qwik } from ".";

class QwikEvent {
  public constructor(options: QwikEventOptions) {
    this.init(options.client, options.path);
  }

  private init(client: Qwik, path: any) {
    const start = Date.now();

    const folders = readdirSync(path);
    for (const folder of folders) {
      const files = readdirSync(`${path}/${folder}/`);
      for (const file of files) {
        const f = require(resolve(path, folder, file));
        if (file.replace(".ts", "").match("ready")) {
          client.once(file.replace(".ts", ""), (...args) =>
            f.Event(...args, start),
          );
        } else {
          client.on(file.replace(".ts", ""), (...args) => f.Event(...args));
        }
      }
    }

    console.log(`Loaded event files! (in ${Date.now() - start}ms)`);
  }
}

export { QwikEvent };
