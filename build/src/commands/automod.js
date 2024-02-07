"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMod = void 0;
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const discord_js_1 = require("discord.js");
const guild_1 = require("../Schema/guild");
const utils_1 = __importDefault(require("../utils/utils"));
class AutoMod extends plugin_subcommands_1.Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "invite",
                    chatInputRun: "invite",
                },
                {
                    name: "link",
                    chatInputRun: "link",
                },
            ],
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("automod")
                .setDescription("Auto moderation commands.")
                .setDMPermission(false)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild)
                .addSubcommand((command) => {
                return command
                    .setName("invite")
                    .setDescription("Config anti invite")
                    .addBooleanOption((option) => {
                    return option
                        .setName("enabled")
                        .setDescription("Enable/Disable anti invite module.")
                        .setRequired(true);
                })
                    .addStringOption((option) => {
                    return option
                        .setName("action")
                        .setDescription("Action to use.")
                        .addChoices({ name: "Delete", value: "delete" }, { name: "Kick", value: "kick" }, { name: "Ban", value: "ban" });
                });
            })
                .addSubcommand((command) => {
                return command
                    .setName("link")
                    .setDescription("Config anti links")
                    .addBooleanOption((option) => {
                    return option
                        .setName("enabled")
                        .setDescription("Enable/Disable anti link module.")
                        .setRequired(true);
                })
                    .addStringOption((option) => {
                    return option
                        .setName("action")
                        .setDescription("Action to use")
                        .addChoices({
                        name: "Delete",
                        value: "delete",
                    }, {
                        name: "Kick",
                        value: "kick",
                    }, {
                        name: "Ban",
                        value: "ban",
                    });
                });
            });
        });
    }
    async link(interaction) {
        const embed = this.baseEmbed(interaction);
        const { options, guild } = interaction;
        const status = options.getBoolean('enabled', true);
        const action = options.getString('action') || "delete";
        await interaction.deferReply();
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data) {
            const result = await this.config('anti_link', data, status, action);
            if (result) {
                interaction.editReply({
                    embeds: [
                        embed.setDescription(`${utils_1.default.emoji(true)} | **${status ? 'Enabled' : 'Disabled'} anti link settings.**`).setColor('Blurple')
                    ]
                });
            }
            else {
                await new guild_1.guilds({ id: guild?.id }).save();
                interaction.editReply({
                    embeds: [
                        embed.setDescription(`${utils_1.default.emoji(false)} | **Looks like this server has never been configured, please re-run this command.`).setColor('Blurple')
                    ]
                });
            }
        }
    }
    async invite(interaction) {
        const embed = this.baseEmbed(interaction);
        const { options, guild } = interaction;
        const status = options.getBoolean("enabled", true);
        const action = options.getString("action") || "delete";
        await interaction.deferReply();
        const data = await guild_1.guilds.findOne({ id: guild?.id });
        if (data) {
            const result = await this.config("anti_invite", data, status, action);
            if (result) {
                interaction.editReply({
                    embeds: [
                        embed
                            .setDescription(`${utils_1.default.emoji(true)} | **${status ? "Enabled" : "Disabled"} anti invite settings.**`)
                            .setColor("Blurple"),
                    ],
                });
            }
        }
        else {
            await new guild_1.guilds({
                id: guild?.id,
            }).save();
            interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **Looks like this server has never been configured, please re-run this command.**`)
                        .setColor("Blurple"),
                ],
            });
        }
    }
    async config(objectName, data, status, action) {
        try {
            data.automod[objectName].enabled = status;
            data.automod[objectName].action = action;
            data.save();
            return true;
        }
        catch (error) {
            this.container.logger.error(error);
            return false;
        }
    }
    baseEmbed(int) {
        return new discord_js_1.EmbedBuilder()
            .setAuthor({
            name: int.user.username,
            iconURL: int.user.displayAvatarURL(),
        })
            .setTimestamp();
    }
}
exports.AutoMod = AutoMod;
