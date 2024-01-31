import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  GuildMember,
  EmbedBuilder,
  PermissionsString,
  PermissionFlagsBits,
} from "discord.js";
import utils from "../utils/utils";

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
        });
    });
  }

  public async ban(interaction: Subcommand.ChatInputCommandInteraction) {
    if (interaction.member instanceof GuildMember) {
      const results = this.checkPermissions(interaction.member, ["BanMembers"]);
      if (!results) {
        return interaction.reply({
          content: `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply();
    const { options, guild, user } = interaction;
    const embed = this.baseEmbed(interaction);

    const reason = options.getString("reason") || "No reason given";
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const interactionMember = await guild?.members.fetch(user.id);

    if (!member) {
      embed
        .setDescription(
          `${utils.emoji(false)} | **The specified member is not valid.**`,
        )
        .setColor("Orange");
      return interaction.editReply({ embeds: [embed] });
    }

    if (member.id === this.container.client.id) {
      embed
        .setDescription(`${utils.emoji(false)} | **I can't ban myself.**`)
        .setColor("Blurple");
      return interaction.editReply({ embeds: [embed] });
    }

    if (member.id === guild?.ownerId) {
      embed
        .setDescription(`${utils.emoji(false)} | **Can't ban the guild owner**`)
        .setColor("Orange");
      return interaction.editReply({ embeds: [embed] });
    }

    if (
      interactionMember?.roles &&
      member.roles.highest.comparePositionTo(interactionMember.roles.highest) >=
        1
    ) {
      embed
        .setDescription(
          `${utils.emoji(false)} | **The specified member has a higher role than you.**`,
        )
        .setColor("Orange");
      return interaction.editReply({ embeds: [embed] });
    }

    if (!member.manageable) {
      embed
        .setDescription(
          `${utils.emoji(false)} | **I don't have enough permissions to ban this member**`,
        )
        .setColor("Orange");
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      member
        .send({
          embeds: [
            embed
              .setDescription(
                `**You have been banned from ${guild?.name}**\n**Reason:** ${reason}`,
              )
              .setColor("Red"),
          ],
        })
        .catch(this.container.logger.error);
      const u = await member.ban({ reason });
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(true)} | **Banned @${u.user.username}** | ${reason}`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      this.container.logger.fatal(error);
    }
  }

  public async kick(interaction: Subcommand.ChatInputCommandInteraction) {
    if (interaction.member instanceof GuildMember) {
      const results = this.checkPermissions(interaction.member, [
        "KickMembers",
      ]);
      if (!results) {
        interaction.reply({
          content: `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply();

    const { guild, options } = interaction;
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const interactionMember = await guild?.members.fetch(interaction.user.id);
    const reason = options.getString("reason") || "No reason given";
    const embed = this.baseEmbed(interaction);

    if (!member) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **The specified member is not valid.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (member.id === this.container.client.user?.id) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(`${utils.emoji(false)} | **I can't kick myself**`)
            .setColor("Orange"),
        ],
      });
    }

    if (member.id === guild?.ownerId) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **Can't kick the guild owner.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member.kickable) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **I don't have enough permissions to kick this member.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (
      interactionMember &&
      member.roles.highest.comparePositionTo(interactionMember.roles.highest) >=
        1
    ) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **The specified member has a higher role than you.**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    try {
      member
        .send({
          embeds: [
            embed
              .setDescription(
                `**You have been kicked from ${guild?.name}** | ${reason}`,
              )
              .setColor("Orange"),
          ],
        })
        .catch(this.container.logger.error);

      const u = await member.kick(reason);
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            `${utils.emoji(true)} | **Kicked @${u.user.username}** | ${reason}`,
          ),
        ],
      });
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  public async nickname(interaction: Subcommand.ChatInputCommandInteraction) {
    if (interaction.member instanceof GuildMember) {
      const results = this.checkPermissions(interaction.member, [
        "KickMembers",
      ]);
      if (!results) {
        return interaction.reply({
          content: `${utils.emoji(false)} | **You don't have enough permissions to use this command.**`,
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply();
    const { guild, options } = interaction;
    const member = await guild?.members.fetch(
      interaction.options.getUser("member", true).id,
    );
    const nickname = options.getString("nickname");
    const embed = this.baseEmbed(interaction);

    if (!member) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **The specified member is not valid.`,
            )
            .setColor("Orange"),
        ],
      });
    }

    if (!member.manageable) {
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **I don't have enough permissions to manage this member**`,
            )
            .setColor("Orange"),
        ],
      });
    }

    await this.changeNickname(member, nickname);
    interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${utils.emoji(true)} | **Changed @${member.user.username}'s nickname to ${member.nickname}`,
          )
          .setColor("Blurple"),
      ],
    });
  }

  private async changeNickname(
    member: GuildMember | undefined,
    nickname: string | null,
  ) {
    if (nickname === "mod.nick") {
      await member?.setNickname(
        `Moderated Nickname ${Math.floor(100).toString(3)}`,
      );
      return true;
    } else {
      await member?.setNickname(nickname);
      return true;
    }
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
