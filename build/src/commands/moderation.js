"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moderation = void 0;
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const discord_js_1 = require("discord.js");
const utils_1 = __importDefault(require("../utils/utils"));
class Moderation extends plugin_subcommands_1.Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: "moderation",
            subcommands: [
                { name: "nickname", chatInputRun: "nickname" },
                { name: "kick", chatInputRun: "kick" },
                { name: "ban", chatInputRun: "ban" },
                {
                    name: "role",
                    type: "group",
                    entries: [
                        { name: "add", chatInputRun: "roleAdd" },
                        { name: "remove", chatInputRun: "roleRemove" },
                    ],
                },
            ],
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("moderation")
                .setDescription("Moderation commnads")
                .setDMPermission(false)
                .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
                .addSubcommand((option) => {
                return option
                    .setName("nickname")
                    .setDescription("Manage a members nickname!")
                    .addUserOption((option) => {
                    return option
                        .setName("member")
                        .setDescription("Mention a member to change the nickname")
                        .setRequired(true);
                })
                    .addStringOption((option) => {
                    return option
                        .setName("nickname")
                        .setDescription('The nickname, type "mod.nick" for auto nickname')
                        .setRequired(true)
                        .setMaxLength(32)
                        .setMinLength(1);
                })
                    .addBooleanOption((option) => {
                    return option
                        .setName("hide")
                        .setDescription("Hide the interaction response?")
                        .setRequired(false);
                });
            })
                .addSubcommand((option) => {
                return option
                    .setName("kick")
                    .setDescription("Kick a member from this server!")
                    .addUserOption((option) => {
                    return option
                        .setName("member")
                        .setDescription("The member you want to kick.")
                        .setRequired(true);
                })
                    .addStringOption((option) => {
                    return option
                        .setName("reason")
                        .setDescription("The reason for kicking this member.")
                        .setMaxLength(35);
                });
            })
                .addSubcommand((option) => {
                return option
                    .setName("ban")
                    .setDescription("Ban a member from this server.")
                    .addUserOption((option) => {
                    return option
                        .setName("member")
                        .setDescription("The member to ban.")
                        .setRequired(true);
                })
                    .addStringOption((option) => {
                    return option
                        .setName("reason")
                        .setDescription("The reason for banning this member.");
                });
            })
                .addSubcommandGroup((group) => {
                return group
                    .setName("role")
                    .setDescription("Moderation role commands")
                    .addSubcommand((command) => {
                    return command
                        .setName("add")
                        .setDescription("Add a role to a member.")
                        .addUserOption((option) => {
                        return option
                            .setName("member")
                            .setDescription("The member to give the role to.")
                            .setRequired(true);
                    })
                        .addRoleOption((option) => {
                        return option
                            .setName("role")
                            .setDescription("The role to give.")
                            .setRequired(true);
                    });
                })
                    .addSubcommand((command) => {
                    return command
                        .setName("remove")
                        .setDescription("Remove a role from a member.")
                        .addUserOption((option) => {
                        return option
                            .setName("member")
                            .setDescription("The member to remove this role from.")
                            .setRequired(true);
                    })
                        .addRoleOption((option) => {
                        return option
                            .setName("role")
                            .setDescription("The role to remove from this member.")
                            .setRequired(true);
                    });
                });
            });
        });
    }
    async roleRemove(interaction) {
        await interaction.deferReply();
        const { options, guild } = interaction;
        const interactionMember = await guild?.members.fetch(interaction.user.id);
        if (interactionMember &&
            !this.checkPermissions(interactionMember, ["ManageRoles"])) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **You don't have enough permissions to use this command.**`)
                        .setColor("Blurple"),
                ],
            });
        }
        const role = await guild?.roles.fetch(options.getRole("role", true).id);
        const member = await guild?.members.fetch(options.getUser("member", true).id);
        if (!role) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **The given role is invalid.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **The given member is invalid.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (utils_1.default.comparePositions(interactionMember, member)) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **${member}, has a higher role than ${interaction.user.username}**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member.manageable) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to manage this member**`)
                        .setColor("Orange"),
                ],
            });
        }
        try {
            await member.roles.remove(role);
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(true)} | **Removed ${role.name} from ${member}**`)
                        .setColor("Blurple"),
                ],
            });
        }
        catch (error) {
            if (error.rawError.message === "Unknown Role") {
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(false)} | **I can't remove this role from this member.**`)
                            .setColor("Orange"),
                    ],
                });
            }
            else if (error.rawError.message === "Missing Permissions") {
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to remove this role.**`)
                            .setColor("Orange"),
                    ],
                });
            }
            this.container.logger.error(error);
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **An error occurred while executing this command**`)
                        .setColor("Red"),
                ],
            });
        }
    }
    async roleAdd(interaction) {
        await interaction.deferReply();
        const { options, guild } = interaction;
        const interactionMember = await guild?.members.fetch(interaction.user.id);
        if (interactionMember &&
            !this.checkPermissions(interactionMember, ["ManageRoles"])) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **You don't have enough permissions to use this command.**`)
                        .setColor("Blurple"),
                ],
            });
        }
        const member = await guild?.members.fetch(options.getUser("member", true).id);
        const role = await guild?.roles.fetch(options.getRole("role", true).id);
        if (!role) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **The given role is not valid.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **The given member is not valid.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (utils_1.default.comparePositions(interactionMember, member)) {
            // true = {member} has a higher role than {interactionMember}
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **${member}, has a higher role than ${interaction.user.username}.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member.manageable) {
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to manage this member**`)
                        .setColor("Orange"),
                ],
            });
        }
        try {
            await member.roles.add(role);
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(true)} | **Added ${role.name} to ${member}**`)
                        .setColor("Blurple"),
                ],
            });
        }
        catch (error) {
            if (error.rawError.message === "Unknown Role") {
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(false)} | **I can't give this role to this member.**`)
                            .setColor("Orange"),
                    ],
                });
            }
            else if (error.rawError.message === "Missing Permissions") {
                return interaction.editReply({
                    embeds: [
                        this.baseEmbed(interaction)
                            .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to give this role**`)
                            .setColor("Orange"),
                    ],
                });
            }
            this.container.logger.error(error);
            return interaction.editReply({
                embeds: [
                    this.baseEmbed(interaction)
                        .setDescription(`${utils_1.default.emoji(false)} | **An error occurred while executing this command.**`)
                        .setColor("Red"),
                ],
            });
        }
    }
    async ban(interaction) {
        if (interaction.member instanceof discord_js_1.GuildMember) {
            const results = this.checkPermissions(interaction.member, ["BanMembers"]);
            if (!results) {
                return interaction.reply({
                    content: `${utils_1.default.emoji(false)} | **You don't have enough permissions to use this command.**`,
                    ephemeral: true,
                });
            }
        }
        await interaction.deferReply();
        const { options, guild, user } = interaction;
        const embed = this.baseEmbed(interaction);
        const reason = options.getString("reason") || "No reason given";
        const member = await guild?.members.fetch(options.getUser("member", true).id);
        const interactionMember = await guild?.members.fetch(user.id);
        if (!member) {
            embed
                .setDescription(`${utils_1.default.emoji(false)} | **The specified member is not valid.**`)
                .setColor("Orange");
            return interaction.editReply({ embeds: [embed] });
        }
        if (member.id === this.container.client.id) {
            embed
                .setDescription(`${utils_1.default.emoji(false)} | **I can't ban myself.**`)
                .setColor("Blurple");
            return interaction.editReply({ embeds: [embed] });
        }
        if (member.id === guild?.ownerId) {
            embed
                .setDescription(`${utils_1.default.emoji(false)} | **Can't ban the guild owner**`)
                .setColor("Orange");
            return interaction.editReply({ embeds: [embed] });
        }
        if (interactionMember?.roles &&
            member.roles.highest.comparePositionTo(interactionMember.roles.highest) >=
                1) {
            embed
                .setDescription(`${utils_1.default.emoji(false)} | **The specified member has a higher role than you.**`)
                .setColor("Orange");
            return interaction.editReply({ embeds: [embed] });
        }
        if (!member.manageable) {
            embed
                .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to ban this member**`)
                .setColor("Orange");
            return interaction.editReply({ embeds: [embed] });
        }
        try {
            member
                .send({
                embeds: [
                    embed
                        .setDescription(`**You have been banned from ${guild?.name}**\n**Reason:** ${reason}`)
                        .setColor("Red"),
                ],
            })
                .catch(this.container.logger.error);
            const u = await member.ban({ reason });
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(true)} | **Banned @${u.user.username}** | ${reason}`)
                        .setColor("Blurple"),
                ],
            });
        }
        catch (error) {
            this.container.logger.fatal(error);
        }
    }
    async kick(interaction) {
        if (interaction.member instanceof discord_js_1.GuildMember) {
            const results = this.checkPermissions(interaction.member, [
                "KickMembers",
            ]);
            if (!results) {
                interaction.reply({
                    content: `${utils_1.default.emoji(false)} | **You don't have enough permissions to use this command.**`,
                    ephemeral: true,
                });
            }
        }
        await interaction.deferReply();
        const { guild, options } = interaction;
        const member = await guild?.members.fetch(options.getUser("member", true).id);
        const interactionMember = await guild?.members.fetch(interaction.user.id);
        const reason = options.getString("reason") || "No reason given";
        const embed = this.baseEmbed(interaction);
        if (!member) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **The specified member is not valid.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (member.id === this.container.client.user?.id) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **I can't kick myself**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (member.id === guild?.ownerId) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **Can't kick the guild owner.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member.kickable) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to kick this member.**`)
                        .setColor("Orange"),
                ],
            });
        }
        if (interactionMember &&
            member.roles.highest.comparePositionTo(interactionMember.roles.highest) >=
                1) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **The specified member has a higher role than you.**`)
                        .setColor("Orange"),
                ],
            });
        }
        try {
            member
                .send({
                embeds: [
                    embed
                        .setDescription(`**You have been kicked from ${guild?.name}** | ${reason}`)
                        .setColor("Orange"),
                ],
            })
                .catch(this.container.logger.error);
            const u = await member.kick(reason);
            return interaction.editReply({
                embeds: [
                    embed.setDescription(`${utils_1.default.emoji(true)} | **Kicked @${u.user.username}** | ${reason}`),
                ],
            });
        }
        catch (error) {
            this.container.logger.error(error);
        }
    }
    async nickname(interaction) {
        if (interaction.member instanceof discord_js_1.GuildMember) {
            const results = this.checkPermissions(interaction.member, [
                "KickMembers",
            ]);
            if (!results) {
                return interaction.reply({
                    content: `${utils_1.default.emoji(false)} | **You don't have enough permissions to use this command.**`,
                    ephemeral: true,
                });
            }
        }
        await interaction.deferReply();
        const { guild, options } = interaction;
        const member = await guild?.members.fetch(interaction.options.getUser("member", true).id);
        const nickname = options.getString("nickname");
        const embed = this.baseEmbed(interaction);
        if (!member) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **The specified member is not valid.`)
                        .setColor("Orange"),
                ],
            });
        }
        if (!member.manageable) {
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`${utils_1.default.emoji(false)} | **I don't have enough permissions to manage this member**`)
                        .setColor("Orange"),
                ],
            });
        }
        await this.changeNickname(member, nickname);
        interaction.editReply({
            embeds: [
                embed
                    .setDescription(`${utils_1.default.emoji(true)} | **Changed @${member.user.username}'s nickname to ${member.nickname}`)
                    .setColor("Blurple"),
            ],
        });
    }
    async changeNickname(member, nickname) {
        if (nickname === "mod.nick") {
            await member?.setNickname(`Moderated Nickname ${Math.floor(100).toString(3)}`);
            return true;
        }
        else {
            await member?.setNickname(nickname);
            return true;
        }
    }
    checkPermissions(member, permissions) {
        if (member && member.permissions.has(permissions)) {
            return true;
        }
        return false;
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
exports.Moderation = Moderation;
