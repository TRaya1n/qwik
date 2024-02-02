"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const discord_js_1 = require("discord.js");
const guild_1 = require("../Schema/guild");
const utils_1 = __importDefault(require("../utils/utils"));
class ConfigCommand extends plugin_subcommands_1.Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "config",
            subcommands: [
                { name: "view", chatInputRun: "view" },
                {
                    name: "logging",
                    type: "group",
                    entries: [
                        { name: "message", chatInputRun: "logging_message" },
                        { name: "channel", chatInputRun: "logging_channel" },
                    ],
                },
            ],
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("config")
                .setDescription("Config the bot.")
                .setDMPermission(false)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild)
                .addSubcommand((command) => {
                return command
                    .setName("view")
                    .setDescription("View all the configurations.");
            })
                .addSubcommandGroup((group) => {
                return group
                    .setName("logging")
                    .setDescription("Config logging settings.")
                    .addSubcommand((command) => {
                    return command
                        .setName("message")
                        .setDescription("Configure message logging settings.")
                        .addBooleanOption((option) => {
                        return option
                            .setName("enabled")
                            .setDescription("Enable/Disable message logging module.")
                            .setRequired(true);
                    })
                        .addChannelOption((option) => {
                        return option
                            .setName("channel")
                            .setDescription("The channel to log message updates")
                            .addChannelTypes(discord_js_1.ChannelType.GuildText)
                            .setRequired(true);
                    });
                })
                    .addSubcommand((command) => {
                    return command
                        .setName("channel")
                        .setDescription("Configure channel logging settings.")
                        .addBooleanOption((option) => {
                        return option
                            .setName("enabled")
                            .setDescription("Enable/Disable channel logging module.")
                            .setRequired(true);
                    })
                        .addChannelOption((option) => {
                        return option
                            .setName("channel")
                            .setDescription("The channel to log channel updates")
                            .addChannelTypes(discord_js_1.ChannelType.GuildText)
                            .setRequired(true);
                    });
                });
            });
        });
    }
    async view(interaction) {
        const { guild } = interaction;
        await interaction.deferReply();
        const embed = this.baseEmbed(interaction);
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data) {
            // Loggings
            const message = data.log
                ? data.log.message_logging?.enabled
                    ? utils_1.default.eod(true)
                    : utils_1.default.eod(false)
                : utils_1.default.eod(false);
            const channel = data.log
                ? data.log.channel_logging?.enabled
                    ? utils_1.default.eod(true)
                    : utils_1.default.eod(false)
                : utils_1.default.eod(false);
            // Automods
            const anti_invite = data.automod
                ? data.automod.anti_invite?.enabled
                    ? utils_1.default.eod(true)
                    : utils_1.default.eod(false)
                : utils_1.default.eod(false);
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`# Logging configurations\n- **Message:**\n - ${message}\n- **Channel:**\n - ${channel}\n# Automod configurations\n- **Anti-invite**\n - ${anti_invite}`)
                        .setColor("Blurple"),
                ],
            });
        }
        else {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **There is no configurations found for this server.**`)
                        .setColor("Blurple"),
                ],
            });
        }
    }
    async logging_message(interaction) {
        const { options, guild, user } = interaction;
        const embed = this.baseEmbed(interaction);
        const status = options.getBoolean("enabled", true);
        const channel = options.getChannel("channel", true);
        await interaction.deferReply();
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data) {
            const result = await this.configLogging("message_logging", data, status, channel.id);
            if (result) {
                const c = await guild?.channels.fetch(channel.id);
                this.sendConfigedMessage(c, embed
                    .setDescription(`${utils_1.default.emoji(true)} | **${status ? `Enabled message logging in this channel. by ${user}` : `Disabled message logging in this channel, by ${user}`}**`)
                    .setColor("Blurple"));
                return interaction.editReply({
                    embeds: [
                        embed
                            .setDescription(`${utils_1.default.emoji(true)} | **${status ? "Enabled" : "Disabled"} message logging, channel: ${channel}**`)
                            .setColor("Blurple"),
                    ],
                });
            }
            else {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setDescription(`${utils_1.default.emoji(false)} | **An error occurred while executing this command, this is probably an issue on my end, please report this message to a developer.`)
                            .setColor("Red"),
                    ],
                });
            }
        }
        else {
            await new guild_1.guilds({ id: guild?.id }).save();
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **Looks like this server has never been configured, please re-run this command.**`)
                        .setColor("Blurple"),
                ],
            });
        }
    }
    async logging_channel(interaction) {
        const { options, guild, user } = interaction;
        const embed = this.baseEmbed(interaction);
        const status = options.getBoolean("enabled", true);
        const channel = options.getChannel("channel", true);
        await interaction.deferReply();
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data) {
            const result = await this.configLogging("channel_logging", data, status, channel.id);
            if (result) {
                const c = await guild?.channels.fetch(channel.id);
                this.sendConfigedMessage(c, embed
                    .setDescription(`${utils_1.default.emoji(true)} | **${status ? `Enabled channel logging in this channel, by: ${user}` : `Disabled channel logging in this channel, by ${user}`}**`)
                    .setColor("Blurple"));
                return interaction.editReply({
                    embeds: [
                        embed
                            .setDescription(`${utils_1.default.emoji(true)} | **${status ? "Enabled" : "Disabled"} channel logging, channel: ${channel}**`)
                            .setColor("Blurple"),
                    ],
                });
            }
            else {
                return interaction.editReply({
                    embeds: [
                        embed
                            .setDescription(`${utils_1.default.emoji(false)} | **An error occurred while executing this command, this is probably an issue on my end, please report this message to a developer.**`)
                            .setColor("Red"),
                    ],
                });
            }
        }
        else {
            await new guild_1.guilds({
                id: guild?.id,
            }).save();
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **Looks like this server has never been configured, please re-run this command.**`)
                        .setColor("Blurple"),
                ],
            });
        }
    }
    // Logging functions;
    async configLogging(objectName, data, status, channelId) {
        try {
            data.log[objectName].enabled = status;
            data.log[objectName].channel = channelId;
            await data.save();
            return true;
        }
        catch (error) {
            this.container.logger.error(error);
            return false;
        }
    }
    sendConfigedMessage(channel, embed) {
        if (channel?.isTextBased()) {
            channel.send({ embeds: [embed] }).catch();
        }
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
exports.ConfigCommand = ConfigCommand;
