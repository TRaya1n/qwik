import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  PermissionsBitField,
  SlashCommandBuilder,
  chatInputApplicationCommandMention,
  messageLink,
} from "discord.js";
import { Qwik } from "../../Qwik";
import {
  CommandProperties,
  SlashCommandProperties,
} from "../../Qwik/interfaces/QwikCommandOptions";
import { logger } from "../../Utils/pino-logger";
import { errorEmbed } from "../../Utils/helpers";

export const SlashCommand: SlashCommandProperties = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages sent by Qwik!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addIntegerOption((option) => {
      return option
        .setName("amount")
        .setDescription("Amount of messages to clear (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true);
    }),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });
    const amount = interaction.options.getInteger("amount", true);

    await deleteMessagesSafely(interaction, amount);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**Purged ${amount} messages sent by me!**`)
      .setColor("Orange")
      .setFooter({ text: `Executed by ${interaction.user.username}` })
      .setTimestamp();

    setTimeout(() => {
      interaction.channel?.send({ embeds: [embed] });
    }, 2000);

    interaction.editReply({ content: `**Purged ${amount} messages**` });
  },
};

async function deleteMessagesSafely(
  interaction: ChatInputCommandInteraction | Message,
  amount: any,
) {
  const { client } = interaction;
  try {
    const messages = await interaction.channel?.messages
      .fetch({ limit: amount, cache: false })
      .catch(logger.error);

    messages
      ?.filter((message) => message.author.id === client.user?.id)
      .map((message) => message)
      .forEach((message) => {
        if (message.deletable) {
          message.delete().catch((error) => {
            if (error.rawError.message === "Unknown Message") {
              if (interaction instanceof ChatInputCommandInteraction) {
                interaction.editReply(`Error: ${error.rawError.message}`);
              } else {
                interaction.reply(`Error: ${error.rawError.message}`);
              }
            }
          });
        }
      });
  } catch (error) {
    console.debug(error, "catch");
    if (error.rawError.message === "Unknown Message") {
      if (interaction instanceof ChatInputCommandInteraction) {
        interaction.editReply(`Error: ${error.rawError.message}`);
      } else {
        interaction.reply(`Error: ${error.rawError.message}`);
      }
    }
  }
}

export const MessageCommand: CommandProperties = {
  name: "clear",
  aliases: [],
  description: "Purge messages sent by Qwik!",
  category: "moderation",
  permissions: {
    user: ["ManageMessages"],
    client: ["ManageMessages"],
  },
  execute: async (client: Qwik, message: Message, args: any[]) => {
    const amount = !isNaN(args[0]) ? args[0] : false;

    if (!amount) {
      return message.channel.send(
        errorEmbed(client, {
          name: "ClearCommandError",
          origin: "AmountArgumentIsNull",
          message: `:x: | **Please specify an amount of messages to clear**`,
        }),
      );
    }

    await deleteMessagesSafely(message, 20);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**Purged ${amount} messages sent by me**`)
      .setColor("Orange")
      .setTimestamp();

    setTimeout(() => {
      message.channel.send({ embeds: [embed] });
    }, 2000);
  },
};
