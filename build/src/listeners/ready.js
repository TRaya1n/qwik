"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
const misc_1 = require("../Schema/misc");
const AutoJoke_1 = require("../utils/works/AutoJoke");
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
        setInterval(async () => {
            const guilds = await misc_1.misc.find();
            for (const guild of guilds) {
                (0, AutoJoke_1.AutoJoke)(guild.id, this.container.client);
            }
        }, 1200000); // 20 minutes
    }
}
exports.ReadyListener = ReadyListener;
