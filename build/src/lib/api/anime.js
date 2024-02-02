"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimeQuote = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = __importDefault(require("discord.js"));
async function getAnimeQuote(options) {
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
    if (options?.embed) {
        const embed = new discord_js_1.default.EmbedBuilder();
        if (options.target) {
            embed.setAuthor({
                name: options.target.username,
                iconURL: options.target.displayAvatarURL(),
            });
        }
        if (options.color) {
            embed.setColor(options.color);
        }
        if (options.timestamp) {
            embed.setTimestamp();
        }
        embed.setDescription(`- **Anime:**\n - ${anime}\n- **Character:**\n - ${character}\n- **Quote:**\n - ${quote}`);
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
        anime,
        character,
        quote,
    };
}
exports.getAnimeQuote = getAnimeQuote;
