import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { Qwik } from "../../Qwik";

export const SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(`Kick a member of a guild`)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .addUserOption((option) => {
      option
        .setName("member")
        .setDescription("the member to kick!")
        .setRequired(true);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("reason")
        .setDescription("reason for kicking this member")
        .setMinLength(5)
        .setRequired(false);
      return option;
    }),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("member");
    const reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(`${user?.id}`);

    if (member && member.id) {
      if (member.id === interaction.guild?.ownerId) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`:x: | **You can't kick the guild owner**`)
          .setColor("Orange")
          .setTimestamp();
        interaction.editReply({ embeds: [embed] });
        return;
      }

      if (!member.kickable) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`:x: | **This member is not kick-able.**`)
          .setColor("Orange")
          .setTimestamp();
        interaction.editReply({ embeds: [embed] });
        return;
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("collector-kick:yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("collector-kick:no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Are you sure you want to kick this member? (${member})`,
        )
        .setColor("Orange")
        .setTimestamp();

      interaction.editReply({ embeds: [embed], components: [row] });

      const collector = interaction.channel?.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
      });

      collector?.on("collect", async (i) => {
        await i.deferReply({ ephemeral: true });

        if (i.customId === "collector-kick:yes") {
          try {
            await member.kick(reason ? reason : "No reason provided [qwik]");
            const embed = new EmbedBuilder()
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setDescription(`✅ | **Kicked ${user}**`)
              .setColor("Greyple")
              .setTimestamp();
            interaction.editReply({ embeds: [embed], components: [] });
            i.editReply("Executing....");
            return collector.stop();
          } catch (error) {
            console.debug(error);
          }
        } else if (i.customId === "collector-kick:no") {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`:x: | **Canceled kicking this member**`)
            .setColor("Orange")
            .setTimestamp();
          interaction.editReply({ embeds: [embed], components: [] });
          i.editReply("Canceled.");
          return collector.stop();
        }
      });
    }
  },
};
