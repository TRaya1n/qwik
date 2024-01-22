import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Qwik } from "../../Qwik";
import {
  CommandProperties,
  SlashCommandProperties,
} from "../../Qwik/interfaces/QwikCommandOptions";

export const SlashCommand: SlashCommandProperties = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("See how long the bot has been up for!"),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user?.username.toString(),
        iconURL: interaction.user?.displayAvatarURL(),
      })
      .setDescription(`**Uptime:** ${client.uptimeQwik()}`)
      .setColor("Greyple")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};

export const MessageCommand: CommandProperties = {
  name: "uptime",
  category: "bot",
  description: `See how long the bot hass been up for!`,
  execute: async (client: Qwik, message: Message) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username.toString(),
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**Uptime:** ${client.uptimeQwik()}`)
      .setColor("Greyple")
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
};
