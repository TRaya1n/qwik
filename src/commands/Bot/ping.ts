import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Message,
} from "discord.js";
import { Qwik } from "../../Qwik/index";
import {
  CommandProperties,
  SlashCommandProperties,
} from "../../Qwik/interfaces/QwikCommandOptions";

export const SlashCommand: SlashCommandProperties = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns bot ping!"),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

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

      interaction.editReply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user?.username}`,
        iconURL: client.user?.displayAvatarURL(),
      })
      .setDescription(`**Ping:** ${client.ws.ping}ms`)
      .setColor("Greyple")
      .setTimestamp();

    return interaction.editReply({ content: null, embeds: [embed] });
  },
};

export const MessageCommand: CommandProperties = {
  name: "ping",
  aliases: [],
  category: "bot",
  description: `Returns bot ping!`,
  execute: async (client: Qwik, message: Message) => {
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

      message.channel.send({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**Ping:** ${client.ws.ping}ms`)
      .setColor("Greyple")
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
