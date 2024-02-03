"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoke = exports.JokeAPICategories = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = __importDefault(require("discord.js"));
exports.JokeAPICategories = [
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
 * @param {JokeAPIOptions} API
 * @param {JokeOptions} embed
 */
async function getJoke(i, data, embed) {
    let build = "https://v2.jokeapi.dev/joke/Any";
    let url;
    if (data && exports.JokeAPICategories.includes(data.category))
        build = `https://v2.jokeapi.dev/joke/${data.category}`;
    if (data && data.blacklist)
        url = `${build}?blacklistFlags=${data.blacklist.map((v) => v).join(",")}`;
    const response = await (0, axios_1.default)({
        url: url,
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
        const x9 = new discord_js_1.default.EmbedBuilder().setColor(embed.color ? embed.color : "Blurple");
        if (embed.timestamp) {
            x9.setTimestamp();
        }
        if (delivery && setup) {
            x9.setTitle(`${setup}`);
            x9.setDescription(`||${delivery}||`);
        }
        else {
            x9.setDescription(`${joke}`);
        }
        if (embed.author) {
            x9.setAuthor({
                name: embed.author.name,
                iconURL: embed.author.icon_url,
            });
        }
        if (embed.footer) {
            x9.setFooter({ text: embed.footer.text, iconURL: embed.footer.icon_url });
        }
        if (i instanceof discord_js_1.default.Message) {
            i.reply({ embeds: [x9] });
        }
        else if (i instanceof discord_js_1.default.ChatInputCommandInteraction) {
            if (i.deferred) {
                i.editReply({ embeds: [x9] });
            }
            else {
                i.reply({ embeds: [x9] });
            }
        }
        else if (i instanceof discord_js_1.default.TextChannel) {
            i.send({ embeds: [x9] });
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
