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
                  'The nickname, type "mod.qwik.nick" for auto nickname',
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
          content: `${utils.emoji(false)} | **You don't have enough permissions to use this command`,
          ephemeral: true,
        });
      }
    }

    await interaction.deferReply();
    const { options, guild, user } = interaction;

    // base embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTimestamp();

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
        .setDescription(`${utils.emoji(false)} | **I can't ban this member**`)
        .setColor("Orange");
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      let DMsent = true;
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
        .catch(() => {
          let DMsent = false;
        });
      const u = await member.ban({ reason });
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(true)} | **Banned ${u.user.username}** | ${reason}`,
            )
            .setColor("Blurple"),
        ],
      });
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  public async kick(interaction: Subcommand.ChatInputCommandInteraction) {
    const { guild, options, user } = interaction;
    await interaction.deferReply();
    const interactionMember = await guild?.members.fetch(user.id);
    const member = await guild?.members.fetch(
      options.getUser("member", true).id,
    );
    const reason = options.getString("reason") || "No reason given";
    if (!member?.moderatable || !member?.manageable) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`:x: | **hmm, Looks like i can't kick this member!**`)
        .setColor("Orange")
        .setTimestamp();
      return interaction.editReply({ embeds: [embed] });
    }
    if (
      member.roles.highest.comparePositionTo(
        interactionMember?.roles.highest || "",
      ) >= 1
    ) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(
          `:x: | **Uh-oh, You cannot kick someone who has a higher role than you!**`,
        )
        .setColor("Orange")
        .setTimestamp();
      return interaction.editReply({ embeds: [embed] });
    }
    try {
      let DMsent = true;
      const userEmbed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `**You've been kicked from ${guild?.name} for ${reason != "No reason given" ? reason : "{No reason given by the moderator}"}**\n> **Moderator:** ${user.username}`,
        )
        .setColor("Red")
        .setTimestamp();
      member.send({ embeds: [userEmbed] }).catch((error) => {
        let DMsent = false;
      });
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(
          `✅ | **Kicked ${member}**\n**Reason:** ${reason}\n**DM sent?** ${DMsent}`,
        )
        .setColor("DarkGreen")
        .setTimestamp();
      await member.kick(reason);
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  public async nickname(interaction: Subcommand.ChatInputCommandInteraction) {
    const { guild, user } = interaction;
    const member = await guild?.members.fetch(
      interaction.options.getUser("member")?.id!,
    );
    const ephemeral = interaction.options.getBoolean("hide") || false;
    if (!member?.moderatable) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(
          `:x: | **Uh-oh, I can't change the nickname of this member!**`,
        )
        .setColor("Orange")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral });
    }
    const nickname = interaction.options.getString("nickname");
    const value = await this.changeNickname(member, nickname);
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setColor("Blurple")
      .setTimestamp();
    if (value) {
      embed.setDescription(
        `**Changed ${member?.user.username}'s nickname to ${member?.nickname}**`,
      );
      interaction.reply({ embeds: [embed], ephemeral });
    }
  }

  private async changeNickname(
    member: GuildMember | undefined,
    nickname: string | null,
  ) {
    if (nickname === "mod.qwik.nick") {
      await member?.setNickname(
        `Moderated Nickname ${Math.floor(100).toString(3)}`,
        "Nickname command executed",
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
    } else {
      return false;
    }
  }
}
