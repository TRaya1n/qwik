import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  GuildMember,
  EmbedBuilder,
  PermissionsString,
  PermissionFlagsBits,
  OAuth2Routes,
} from "discord.js";
import utils from "../utils/utils";
import { CommandsModerationBaseObject } from "../lib/types/types";
import { Result } from "@sapphire/framework";

export class Moderation extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
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

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("moderation")
        .setDescription("Moderation commnads")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
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
                .setDescription(
                  'The nickname, type "mod.nick" for auto nickname',
                )
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

  public async roleRemove(interaction: Subcommand.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const { options, guild } = interaction;
    const interactionMember = await guild?.members.fetch(interaction.user.id);
    if (
      interactionMember &&
      !this.checkPermissions(interactionMember, ["ManageRoles"])
    ) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
            )
            .setColor("Blurple"),
        ],
      });
    }

    const role = await guild?.roles.fetch(options.getRole("role", true).id);
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );

    if (!role) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **The given role is invalid.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **The given member is invalid.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (utils.comparePositions(interactionMember, member)) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **${member}, has a higher role than ${interaction.user.username}**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member.manageable) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **I don't have enough permissions to manage this member**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    try {
      await member.roles.remove(role);
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(true)} | **Removed ${role.name} from ${member}**`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      if (error.rawError.message === "Unknown Role") {
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(
                `${utils.emoji(false)} | **I can't remove this role from this member.**`,
              )
              .setColor("Orange"),
          ],
        });
      } else if (error.rawError.message === "Missing Permissions") {
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(
                `${utils.emoji(false)} | **I don't have enough permissions to remove this role.**`,
              )
              .setColor("Orange"),
          ],
        });
      }

      this.container.logger.error(error);
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **An error occurred while executing this command**`,
            )
            .setColor("Red"),
        ],
      });
    }
  }

  public async roleAdd(interaction: Subcommand.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const { options, guild } = interaction;
    const interactionMember = await guild?.members.fetch(interaction.user.id);

    if (
      interactionMember &&
      !this.checkPermissions(interactionMember, ["ManageRoles"])
    ) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
            )
            .setColor("Blurple"),
        ],
      });
    }

    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const role = await guild?.roles.fetch(options.getRole("role", true).id);

    if (!role) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **The given role is not valid.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **The given member is not valid.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (utils.comparePositions(interactionMember, member)) {
      // true = {member} has a higher role than {interactionMember}
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **${member}, has a higher role than ${interaction.user.username}.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member.manageable) {
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **I don't have enough permissions to manage this member**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    try {
      await member.roles.add(role);
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(true)} | **Added ${role.name} to ${member}**`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      if (error.rawError.message === "Unknown Role") {
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(
                `${utils.emoji(false)} | **I can't give this role to this member.**`,
              )
              .setColor("Orange"),
          ],
        });
      } else if (error.rawError.message === "Missing Permissions") {
        return interaction.editReply({
          embeds: [
            this.baseEmbed(interaction)
              .setDescription(
                `${utils.emoji(false)} | **I don't have enough permissions to give this role**`,
              )
              .setColor("Orange"),
          ],
        });
      }

      this.container.logger.error(error);
      return interaction.editReply({
        embeds: [
          this.baseEmbed(interaction)
            .setDescription(
              `${utils.emoji(false)} | **An error occurred while executing this command.**`,
            )
            .setColor("Red"),
        ],
      });
    }
  }

  public async ban(interaction: Subcommand.ChatInputCommandInteraction) {
    const { options, guild } = interaction;
    const embed = this.baseEmbed(interaction);
    const reason = options.getString("reason") || "No reason given";
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const result = await this.BaseForKickBanNickname(interaction, {
      checkIfFor: "bannable",
      member: member,
      requiredPermissionsToRun: "BanMembers",
    });

    if (result.stoped) return;

    try {
      member
        ?.send({
          embeds: [
            embed
              .setDescription(
                `**You have been banned from ${guild?.name}**\n**Reason:** ${reason}`,
              )
              .setColor("Red"),
          ],
        })
        .catch((error) => this.container.logger.error(error));

      await member?.ban({ reason });
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(true)} | **Banned @${member?.user.username}** | ${reason}`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      this.container.logger.fatal(error);
    }
  }

  public async kick(interaction: Subcommand.ChatInputCommandInteraction) {
    const { guild, options } = interaction;
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const reason = options.getString("reason") || "No reason given";
    const embed = this.baseEmbed(interaction);
    const result = await this.BaseForKickBanNickname(interaction, {
      checkIfFor: "kickable",
      member: member,
      requiredPermissionsToRun: "KickMembers",
    });

    if (result.stoped) {
      return;
    }

    try {
      member
        ?.send({
          embeds: [
            embed
              .setDescription(
                `**You have been kicked from ${guild?.name}** | ${reason}`,
              )
              .setColor("Orange"),
          ],
        })
        .catch((error) => this.container.logger.error(error));

      await member?.kick(reason);
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            `${utils.emoji(true)} | **Kicked @${member?.user.username}** | ${reason}`,
          ),
        ],
      });
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  public async nickname(interaction: Subcommand.ChatInputCommandInteraction) {
    const { guild, options } = interaction;
    const member = await guild?.members.fetch(
      interaction.options.getUser("member", true).id,
    );
    const nickname = options.getString("nickname");
    const embed = this.baseEmbed(interaction);
    const result = await this.BaseForKickBanNickname(interaction, {
      checkIfFor: "manageable",
      member: member,
      requiredPermissionsToRun: "ManageNicknames",
    });

    if (result.stoped) return;

    try {
      let GuildMemb;
      if (nickname === "mod.nick") {
        GuildMemb = await member?.setNickname(`Mod.${utils.randomString(10)}`);
      } else {
        GuildMemb = await member?.setNickname(nickname);
      }
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(true)} | **Changed @${member?.user.username}'s nickname to ${GuildMemb?.nickname}**`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  private async BaseForKickBanNickname(
    interaction: Subcommand.ChatInputCommandInteraction,
    input: CommandsModerationBaseObject,
  ) {
    await interaction.deferReply();
    const embed = this.baseEmbed(interaction);
    const interactionMember = await interaction.guild?.members.fetch(
      interaction.user.id,
    );
    if (
      !interactionMember?.permissions.has(
        PermissionFlagsBits[input.requiredPermissionsToRun],
      )
    ) {
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
            )
            .setColor("Orange"),
        ],
      });
      return { stoped: true, where: "InteractionMember" };
    }
    if (!input.member) {
      interaction.editReply({
        embeds: [
          embed.setDescription(
            `${utils.emoji(false)} | **The specified member is invalid**`,
          ),
        ],
      });
      return { stoped: true, where: "MemberIsInvalid" };
    }
    if (input.member.id === this.container.client.user?.id) {
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **I can't manage myself.**`,
            )
            .setColor("Orange"),
        ],
      });
      return { stoped: true, where: "MemberIsClient" };
    }
    if (
      input.member.roles.highest.comparePositionTo(
        interactionMember.roles.highest,
      ) >= 1
    ) {
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **${input.member}, has a higher role than ${interactionMember}.**`,
            )
            .setColor("Orange"),
        ],
      });
      return { stoped: true, where: "MemberHasHigherRole" };
    }
    if (!input.member[input.checkIfFor]) {
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **I don't have enough permissions to manage this member**`,
            )
            .setColor("Orange"),
        ],
      });
      return { stoped: true, where: `MemberIsNot${input.checkIfFor}` };
    }

    return { stoped: false };
  }

  private checkPermissions(
    member: GuildMember | undefined,
    permissions: PermissionsString[],
  ) {
    if (member && member.permissions.has(permissions)) {
      return true;
    }
    return false;
  }

  private baseEmbed(interaction: Subcommand.ChatInputCommandInteraction) {
    return new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
  }
}
