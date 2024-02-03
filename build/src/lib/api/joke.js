"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoke = exports.APICategories = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = __importDefault(require("discord.js"));
exports.APICategories = [
    "Any",
    "Programming",
    "Miscellaneous",
    "Dark",
    "Pun",
    "Spooky",
    "Christmas",
];
/**
 *
 * @param {getJokeAPIOptions} API
 * @param {getJokeEmbedOptions} embed
 */
async function getJoke(API, embed) {
    let url = "https://v2.jokeapi.dev/joke/Any";
    if (API && API.category && exports.APICategories.includes(API.category))
        url = `https://v2.jokeapi.dev/joke/${API.category}`;
    const response = await (0, axios_1.default)({
        url: url + "?blacklistFlags=nsfw,racist,sexist", // blacklist will be an getJokeAPIOption in @lib/api v2
        method: "GET",
    });
    if (response.data.error) {
        return new Error(response.data.error);
    }
    let setup;
    let delivery;
    let joke;
    if (response.data.setup)
        setup = response.data.setup;
    if (response.data.delivery)
        delivery = response.data.delivery;
    if (response.data.joke)
        joke = response.data.joke;
    if (embed) {
        const x9 = new discord_js_1.default.EmbedBuilder();
        if (embed.embed_options?.timestamp) {
            x9.setTimestamp();
        }
        if (embed.embed_options?.color) {
            x9.setColor(embed.embed_options.color);
        }
        if (delivery && setup) {
            x9.setTitle(`${setup}`);
            x9.setDescription(`||${delivery}||`);
        }
        else {
            x9.setDescription(`${joke}`);
        }
        if (embed.data.target) {
            x9.setAuthor({
                name: embed.data.target.username,
                iconURL: embed.data.target.displayAvatarURL(),
            });
        }
        if (embed.data.message instanceof discord_js_1.default.Message) {
            embed.data.message.reply({ embeds: [x9] });
        }
        else if (embed.data.message instanceof discord_js_1.default.TextChannel) {
            embed.data.message.send({ embeds: [x9] });
        }
        else if (embed.data.message instanceof discord_js_1.default.ChatInputCommandInteraction) {
            if (embed.data.message.deferred) {
                embed.data.message.editReply({ embeds: [x9] });
            }
            else {
                embed.data.message.reply({ embeds: [x9] });
            }
        }
    }
    if (delivery && setup) {
        return {
            d: delivery,
            s: setup,
        };
    }
    else {
        return {
            j: joke,
        };
    }
}
exports.getJoke = getJoke;
