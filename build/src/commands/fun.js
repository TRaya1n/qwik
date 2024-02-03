"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunCommands = void 0;
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const index_1 = require("../lib/index");
const discord_js_1 = require("discord.js");
const misc_1 = __importDefault(require("../Schema/misc"));
const utils_1 = __importDefault(require("../utils/utils"));
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
                {
                    name: "config",
                    type: "group",
                    entries: [{ name: "auto_joke", chatInputRun: "_auto_joke" }],
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
                    index_1.APICategories.forEach((value) => option.addChoices({ name: `${value}`, value: `${value}` }));
                    return option;
                });
            })
                .addSubcommand((command) => {
                return command
                    .setName("facts")
                    .setDescription("Get a random fact!")
                    .addStringOption((option) => {
                    option.setName("type").setDescription("Select a type of fact!");
                    index_1.getFactAPITypes.forEach((value) => option.addChoices({ name: value, value }));
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
            })
                .addSubcommandGroup((group) => {
                return group
                    .setName("config")
                    .setDescription("Config fun commands.")
                    .addSubcommand((command) => {
                    return command
                        .setName("auto_joke")
                        .setDescription("Auto send a joke to a channel!")
                        .addBooleanOption((option) => {
                        return option
                            .setName("enabled")
                            .setDescription("Do you want to enable or disable?")
                            .setRequired(true);
                    })
                        .addChannelOption((option) => {
                        return option
                            .setName("channel")
                            .setDescription("The channel to send the joke to.")
                            .addChannelTypes(discord_js_1.ChannelType.GuildText)
                            .setRequired(true);
                    })
                        .addStringOption((option) => {
                        return option
                            .setName("every")
                            .setDescription("How often should i send a joke?")
                            .addChoices({ name: "5m", value: "300000" }, { name: "10m", value: "600000" })
                            .setRequired(true);
                    });
                });
            });
        });
    }
    async _auto_joke(interaction) {
        const { options, guild } = interaction;
        await interaction.deferReply();
        const channel = options.getChannel("channel", true);
        const every = Number(options.getString("every", true));
        console.log(every);
        const status = options.getBoolean("enabled", true);
        const data = await misc_1.default.misc.findOne({ id: guild?.id });
        if (data) {
            if (status) {
                data.auto_joke.enabled = status;
                data.auto_joke.channelId = channel.id;
                data.auto_joke.every = every;
                await data.save();
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(true)} | **Enabled auto joke in ${channel}, i will send a joke in the channel every: ${every}**`)
                            .setColor("Blurple"),
                    ],
                });
            }
            else {
                data.auto_joke.enabled = status;
                data.auto_joke.channelId = null;
                data.auto_joke.every = 300000;
                await data.save();
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(true)} | **Disabled auto joke.**`)
                            .setColor("Blurple"),
                    ],
                });
            }
        }
        else {
            await new misc_1.default.misc({ id: guild?.id }).save();
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **Looks like this server does not exist on my database... please run this command again.**`)
                        .setColor("Blurple"),
                ],
            });
        }
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
        await (0, index_1.getJoke)({ category }, {
            embed_options: { color: "Blurple", timestamp: true },
            data: { target: interaction.user, message: interaction },
        });
    }
    async facts(interaction) {
        await (0, index_1.getFact)({
            type: interaction.options.getString(`type`) || "useless",
            embed: true,
            message: interaction,
            data: {
                target: interaction.user,
                color: "Blurple",
                footer: true,
                timestamp: true,
            },
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
