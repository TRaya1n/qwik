"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoJoke = void 0;
const misc_1 = require("../../Schema/misc");
const lib_1 = require("../../lib");
const discord_js_1 = require("discord.js");
/**
 * @param {string} id
 * @param {SapphireClient} client
 */
async function AutoJoke(id, client) {
    const data = await misc_1.misc.findOne({ id });
    console.log(data);
    if (data && data.auto_joke && data.auto_joke.enabled) {
        if (data.auto_joke.channelId) {
            const channel = await client.channels.fetch(data.auto_joke.channelId);
            if (channel && channel instanceof discord_js_1.TextChannel) {
                setInterval(() => {
                    (0, lib_1.getJoke)({ category: "Any" }, {
                        data: {
                            message: channel,
                        },
                        embed_options: {
                            color: "Blurple",
                            timestamp: true,
                        },
                    });
                }, data.auto_joke?.every);
            }
        }
    }
}
exports.AutoJoke = AutoJoke;
