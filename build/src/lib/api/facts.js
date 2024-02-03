"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFact = exports.FactTypes = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const axios_1 = __importDefault(require("axios"));
exports.FactTypes = ["useless"];
/**
 *
 * @param {djs.Message|djs.ChatInputCommandInteraction|djs.TextChannel} i
 * @param {FactAPIOptions} data
 */
async function getFact(i, data) {
    if (data.type === "useless") {
        await UselessFact(i, data);
    }
}
exports.getFact = getFact;
async function UselessFact(i, data) {
    const response = await (0, axios_1.default)({
        url: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`,
        method: "GET",
    });
    const id = response.data.id;
    const text = response.data.text;
    const source = response.data.source;
    const embed = new discord_js_1.default.EmbedBuilder().setColor(data.color ? data.color : "Blurple");
    if (data.footer) {
        embed.setFooter({ text: data.footer.text });
    }
    if (data.timestamp) {
        embed.setTimestamp();
    }
    if (data.author) {
        embed.setAuthor({
            name: data.author.name,
            iconURL: data.author.icon_url,
        });
        embed.setDescription(`${text}`);
        if (i instanceof discord_js_1.default.Message) {
            i.reply({ embeds: [embed] });
        }
        else if (i instanceof discord_js_1.default.ChatInputCommandInteraction) {
            if (i.deferred) {
                i.editReply({ embeds: [embed] });
            }
            else {
                i.reply({ embeds: [embed] });
            }
        }
        else if (i instanceof discord_js_1.default.TextChannel) {
            i.send({ embeds: [embed] });
        }
    }
    return {
        id,
        text,
        source,
    };
}
