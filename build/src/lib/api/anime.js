"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimeQuote = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = __importDefault(require("discord.js"));
async function getAnimeQuote(i, data) {
    const response = await (0, axios_1.default)({
        url: "https://animechan.xyz/api/random",
        method: "GET",
    });
    if (!response.data) {
        return new Error("Anime API error... response.data");
    }
    const anime = response.data.anime;
    const character = response.data.character;
    const quote = response.data.quote;
    const embed = new discord_js_1.default.EmbedBuilder().setColor(data?.color ? data.color : "Blurple");
    if (data?.author) {
        embed.setAuthor({
            name: data.author.name,
            iconURL: data.author.icon_url,
        });
    }
    if (data?.timestamp) {
        embed.setTimestamp();
    }
    embed.setDescription(`- **Anime:**\n - ${anime}\n- **Character:**\n - ${character}\n- **Quote:**\n - ${quote}`);
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
    return {
        anime,
        character,
        quote,
    };
}
exports.getAnimeQuote = getAnimeQuote;
