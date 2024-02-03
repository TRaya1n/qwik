"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSendJoke = void 0;
const misc_1 = require("../../Schema/misc");
const lib_1 = require("../../lib");
const discord_js_1 = require("discord.js");
async function AutoSendJoke(client) {
    const guilds = await misc_1.misc.find();
    for (const data of guilds) {
        console.log(data);
        if (data.auto_joke && !data.auto_joke.enabled)
            return;
        if (!data.auto_joke || !data.auto_joke.channelId)
            return;
        const channel = await client.channels.fetch(data.auto_joke?.channelId);
        if (!channel)
            return;
        if (channel instanceof discord_js_1.TextChannel) {
            (0, lib_1.getJoke)({ category: "Any" }, {
                data: {
                    message: channel,
                },
                embed_options: {
                    color: "Blurple",
                    timestamp: true,
                },
            });
        }
    }
}
exports.AutoSendJoke = AutoSendJoke;
