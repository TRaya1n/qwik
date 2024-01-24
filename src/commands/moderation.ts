import { Subcommand } from "@sapphire/plugin-subcommands";
import {
  GuildMember,
  EmbedBuilder,
  PermissionsString,
  MembershipScreeningFieldType,
  PermissionFlagsBits,
  GuildFeature,
} from "discord.js";
import { setFlagsFromString } from "v8";

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
                .setDescription("The reason for kicking this member")
                .setMaxLength(35)
                .setRequired(false);
            });
        });
    });
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
}
