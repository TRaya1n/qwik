"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
const joke_1 = require("../utils/auto/joke");
class ReadyListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: "ready",
        });
    }
    async run() {
        this.container.logger.info(`${this.container.client.user?.username}, is ready!`);
        setInterval(() => {
            (0, joke_1.AutoSendJoke)(this.container.client);
        }, 3600000);
    }
}
exports.ReadyListener = ReadyListener;
