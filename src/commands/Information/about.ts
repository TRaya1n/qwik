import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { Qwik } from "../../Qwik";
import { models } from "../../models/index";

export const SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("View information about the bot!"),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const data = await models.Client.findOne({ pass: client.user?.id });

    const embedDescription: string = `**Welcome, ${interaction.user}!**\n**Qwik** is a **multipurpose** **Discord** bot with features like **AutoModeration, Logging, Suggestion & Other Fun Commands**\n\n**Ping:** ${client.ws.ping}ms\n**Developer:** module.export\n**Commands used:**\n- [💬]: ${data?.messageCommandsRanAllTime}\n- [/]: ${data?.chatInputCommandsRanAllTime}`;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(
        interaction.client.user.displayAvatarURL({
          size: 1024,
          extension: "png",
        }),
      )
      .setDescription(embedDescription)
      .setColor("Blurple")
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("🩵")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("collector-show_more"),
    );

    interaction.editReply({ embeds: [embed], components: [row] });

    const collector = interaction.channel?.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    });

    collector?.on("collect", async (i) => {
      if (i.customId === "collector-show_more") {
        const embedDescriptionMore: string = `**Auto Moderation:**\n\`-\` qw.anti [module] [mode]\n\`-\` [module]: The module you want to enable/disable.\n\`-\` [mode]: Enable or disable.\n- modules: invite\n- modes: on/off\n\n**Logging:**\n\`-\` qw.log [module] [mode] [channel]\n\`-\` [module]: The module to enable/disable\n\`-\` [mode]: Enable or disable this module\n\`-\` [channel]: The channel to set this module\n- modules: message, channel & server\n- modes: on/off\n- channel: a channel id/mention`;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: i.user.username,
            iconURL: i.user.displayAvatarURL(),
          })
          .setThumbnail(
            interaction.client.user.displayAvatarURL({
              size: 1024,
              extension: "png",
            }),
          )
          .setDescription(embedDescriptionMore)
          .setColor("Blurple")
          .setTimestamp();

        interaction.editReply({ embeds: [embed], components: [] });
        return collector.stop();
      }
    });
  },
};
