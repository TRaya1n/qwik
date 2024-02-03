"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunCommands = void 0;
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const index_1 = require("../lib/index");
const discord_js_1 = require("discord.js");
class FunCommands extends plugin_subcommands_1.Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            subcommands: [
                { name: "8ball", chatInputRun: "eightball" },
                { name: "joke", chatInputRun: "joke" },
                { name: "facts", chatInputRun: "facts" },
                {
                    name: "anime",
                    type: "group",
                    entries: [{ name: "quote", chatInputRun: "quote" }],
                },
            ],
        });
    }
    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("fun")
                .setDescription("Some fun commands!")
                .addSubcommand((command) => {
                return command
                    .setName("8ball")
                    .setDescription("Ask a question, i will awnser")
                    .addStringOption((option) => {
                    return option
                        .setName("question")
                        .setDescription("The question you want to ask.")
                        .setRequired(true)
                        .setMinLength(5);
                })
                    .addBooleanOption((command) => {
                    return command
                        .setName("hide")
                        .setDescription("Hide the response?");
                });
            })
                .addSubcommand((command) => {
                return command
                    .setName("joke")
                    .setDescription("Get a random joke!")
                    .addStringOption((option) => {
                    option.setName("category").setDescription("Select a category");
                    index_1.JokeAPICategories.forEach((value) => option.addChoices({ name: `${value}`, value: `${value}` }));
                    return option;
                });
            })
                .addSubcommand((command) => {
                return command
                    .setName("facts")
                    .setDescription("Get a random fact!")
                    .addStringOption((option) => {
                    option.setName("type").setDescription("Select a type of fact!");
                    index_1.FactTypes.forEach((value) => option.addChoices({ name: value, value }));
                    return option;
                });
            })
                .addSubcommandGroup((group) => {
                return group
                    .setName("anime")
                    .setDescription("Anime fun commands!")
                    .addSubcommand((command) => {
                    return command
                        .setName("quote")
                        .setDescription("Get a anime quote.");
                });
            });
        });
    }
    eightball(interaction) {
        const question = interaction.options.getString("question", true);
        const ephemeral = interaction.options.getBoolean("hide") || false;
        (0, index_1.EightBall)(question, {
            embed: true,
            embed_options: {
                color: "Blurple",
                timestamp: true,
            },
            target: interaction.user,
            message: interaction,
            message_options: {
                ephemeral,
            },
        });
    }
    async joke(interaction) {
        const category = interaction.options.getString("category");
        await (0, index_1.getJoke)(interaction, {
            blacklist: ["nsfw", "racist", "sexist"],
            category: category ? category : "Any",
        }, {
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL(),
            },
            timestamp: true,
            footer: { text: "Powered by: https://v2.jokeapi.dev | @lib/v2" },
        });
    }
    async facts(interaction) {
        await (0, index_1.getFact)(interaction, {
            type: interaction.options.getString("type") || "useless",
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL(),
            },
            timestamp: true,
            footer: { text: `Powered by: https://shorturl.at/bjvSW | @lib/v2` },
        });
    }
    async quote(interaction) {
        await (0, index_1.getAnimeQuote)({
            embed: true,
            message: interaction,
            target: interaction.user,
            color: "Blurple",
            timestamp: true,
        });
    }
    baseEmbed(interaction) {
        return new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setTimestamp();
    }
}
exports.FunCommands = FunCommands;
