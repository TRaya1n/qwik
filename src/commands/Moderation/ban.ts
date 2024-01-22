import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { Qwik } from "../../Qwik";
import { errorEmbed } from "../../Utils/helpers";
import { SlashCommandProperties } from "../../Qwik/interfaces/QwikCommandOptions";

export const SlashCommand: SlashCommandProperties = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member of a guild")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => {
      option
        .setName("member")
        .setDescription("Member to ban")
        .setRequired(true);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("reason")
        .setDescription("Reason for baning this member")
        .setMinLength(5);
      return option;
    }),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("member");
    const reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(`${user?.id}`);
    const interactionMember = interaction.guild?.members.cache.get(
      interaction.user.id,
    );

    if (member && member.id) {
      if (member.id === interaction.guild?.ownerId) {
        const embed = errorEmbed(client, {
          name: "BanCommandError",
          origin: "BanGuildOwner",
          message: ":x: | **You cannot ban the owner of the guild**",
        });
        return interaction.editReply(embed);
      }

      if (
        interactionMember?.roles.highest.comparePositionTo(
          member.roles.highest,
        ) &&
        interactionMember.roles.highest.comparePositionTo(
          member.roles.highest,
        ) >= 1
      ) {
        const embed = errorEmbed(client, {
          name: "BanCommandError",
          origin: "MemberBanHigherRole",
          message: `:x: | **You cannot ban this member because they have a higher role than you**`,
        });
        return interaction.editReply(embed);
      }

      if (!member.bannable && !member.manageable) {
        const embed = errorEmbed(client, {
          name: "BanCommandError",
          origin: "BanMemberNotManageableByClient",
          message: `:x: | **I cannot ban this member**`,
        });
        return interaction.editReply({ embeds: [embed] });
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("collector-ban:yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("collector-ban:no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`Are you sure you want to ban this member? (${member})`)
        .setColor("Orange")
        .setTimestamp();

      interaction.editReply({ embeds: [embed], components: [row] });

      const collector = interaction.channel?.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
      });

      collector?.on("collect", async (i) => {
        await i.deferReply({ ephemeral: true });
        if (i.customId === "collector-ban:yes") {
          try {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: i.user.username,
                iconURL: i.user.displayAvatarURL(),
              })
              .setDescription(`✅ | **Banned ${member}**`)
              .setColor("Greyple")
              .setTimestamp();

            await member.ban({
              reason: reason ? reason : "No reason provided.",
            });

            interaction.editReply({ embeds: [embed], components: [] });
            i.editReply("Executing...");
            return collector.stop();
          } catch (error) {
            console.debug(error);
          }
        } else if (i.customId === "collector-ban:no") {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: i.user.username,
              iconURL: i.user.displayAvatarURL(),
            })
            .setDescription(":x: | **Canceled ban**")
            .setColor("Orange")
            .setTimestamp();
          interaction.editReply({ embeds: [embed], components: [] });
          i.editReply("Canceled");
          return collector?.stop();
        }
      });
    }
  },
};
