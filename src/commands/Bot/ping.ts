import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
} from "discord.js";
import { Qwik } from "../../Qwik/index";

export const SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns bot ping!"),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    interaction.editReply({ content: `\`Loading data...\`` });

    if (client.ws.ping === -1) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user?.username}`,
          iconURL: client.user?.displayAvatarURL(),
        })
        .setDescription(
          `**The bot was recently restarted, please wait a few minutes before trying again!**`,
        )
        .setColor("Orange")
        .setTimestamp();

      interaction.editReply({ content: null, embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user?.username}`,
        iconURL: client.user?.displayAvatarURL(),
      })
      .setDescription(`**Ping:** ${client.ws.ping}ms`)
      .setColor("Greyple")
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("Bot-ping.ts-show_more")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🛠️"),
    );

    if (interaction.user.id === "1125852865534107678") {
      return interaction.editReply({
        content: null,
        embeds: [embed],
        components: [row],
      });
    } else {
      return interaction.editReply({ content: null, embeds: [embed] });
    }
  },
};

export const MessageCommand = {
  name: "ping",
  aliases: [],
  category: "bot",
  description: `Returns bot ping!`,
  execute: async (client: Qwik, message: Message) => {
    const msg = await message.channel.send({ content: `\`Loading data...\`` });

    if (client.ws.ping === -1) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `**The bot was recently restarted, please wait a few minutes before trying again.**`,
        )
        .setColor("Orange")
        .setTimestamp();

      msg.edit({ content: null, embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**Ping:** ${client.ws.ping}ms`)
      .setColor("Greyple")
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("Bot-ping.ts-show_more")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🛠️"),
    );

    if (msg.author.id === "1125852865534107678") {
      return msg.edit({ content: null, embeds: [embed], components: [row] });
    } else {
      return msg.edit({ content: null, embeds: [embed], components: [row] });
    }
  },
};

export async function Buttons(
  interaction: ButtonInteraction,
  client: Qwik,
  customId: any[],
) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.user.id.includes("1125852865534107678")) {
    return interaction.editReply({
      content: `**You can't execute this button**`,
    });
  }

  if (customId[2] === "show_more") {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription("**Developer informations**")
      .setColor("Greyple")
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
}
