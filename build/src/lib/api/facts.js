"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFact = exports.getFactAPITypes = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const axios_1 = __importDefault(require("axios"));
exports.getFactAPITypes = ["useless"];
async function getFact(options) {
    if (options.type === "useless") {
        await UselessFact(options);
    }
}
exports.getFact = getFact;
async function UselessFact(options) {
    const response = await (0, axios_1.default)({
        url: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`,
        method: "GET",
    });
    const id = response.data.id;
    const text = response.data.text;
    const source = response.data.source;
    if (options.embed) {
        const embed = new discord_js_1.default.EmbedBuilder();
        if (options.data?.color) {
            embed.setColor(options.data.color);
        }
        if (options.data?.footer) {
            embed.setFooter({ text: `${id} | ${source}` });
        }
        if (options.data?.timestamp) {
            embed.setTimestamp();
        }
        if (options.data?.target) {
            embed.setAuthor({
                name: options.data.target.username,
                iconURL: options.data.target.displayAvatarURL(),
            });
        }
        embed.setDescription(`${text}`);
        if (options.message instanceof discord_js_1.default.Message) {
            options.message.reply({ embeds: [embed] });
        }
        else {
            if (options.message?.deferred) {
                options.message.editReply({ embeds: [embed] });
            }
            else {
                options.message?.reply({ embeds: [embed] });
            }
        }
    }
    return {
        id,
        text,
        source,
    };
}
