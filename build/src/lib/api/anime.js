"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimeQuote = exports.AnimeImageSearch = exports.AnimeWaifu = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = __importStar(require("discord.js"));
class AnimeWaifu {
    /**
     * @link https://waifu.it/
     */
    constructor() { }
    /**
     * @param {djs.Message|djs.ChatInputCommandInteraction} i
     * @returns {djs.EmbedBuilder|undefined}
     */
    async getFact(i) {
        const response = await (0, axios_1.default)({
            url: `https://waifu.it/api/v4/fact`,
            headers: { Authorization: process.env.WAIFU_API_KEY },
        });
        const _id = response.data._id;
        const fact = response.data.fact;
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`${fact}`)
            .setFooter({ text: `Id: ${_id}` })
            .setTimestamp();
        return embed;
    }
}
exports.AnimeWaifu = AnimeWaifu;
async function AnimeImageSearch(i, data) {
    const response = await (0, axios_1.default)({
        url: `https://api.trace.moe/search?cutBorders&url=${data.url}`,
    });
    if (!response.data) {
        new Error("#AnimeImageSearch | Error");
    }
    const highest = response.data.result.shift();
    const embed = new discord_js_1.default.EmbedBuilder()
        .setColor(data.color ? data.color : "Blurple")
        .setImage(highest.image)
        .setDescription(`**Anime:** ${highest.filename}\n**Episode:** ${highest.episode ? highest.episode : "Unknown.."}\n**Video:** [View it here.](${highest.video})`);
    if (data.author) {
        embed.setAuthor({
            name: data.author.name,
            iconURL: data.author.icon_url,
        });
    }
    if (data.timestamp) {
        embed.setTimestamp();
    }
    if (data.footer) {
        embed.setFooter({ text: data.footer.text });
    }
    if (i instanceof discord_js_1.default.ChatInputCommandInteraction) {
        if (i.deferred) {
            i.editReply({ embeds: [embed] });
        }
        else {
            i.reply({ embeds: [embed] });
        }
    }
    else if (i instanceof discord_js_1.default.Message) {
        i.reply({ embeds: [embed] });
    }
    else if (i instanceof discord_js_1.default.TextChannel) {
        i.send({ embeds: [embed] });
    }
}
exports.AnimeImageSearch = AnimeImageSearch;
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
