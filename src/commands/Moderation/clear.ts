import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Qwik } from "../../Qwik";

export const SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages sent by the bot!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    await deleteMessagesSafely(interaction);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**Cleared 20 messages sent by me!**`)
      .setColor("Orange")
      .setFooter({ text: `Executed by ${interaction.user.username}` })
      .setTimestamp();

    setTimeout(() => {
      interaction.channel?.send({ embeds: [embed] });
    }, 2000);

    interaction.editReply({ content: `**Cleared 20 messages**` });
  },
};

async function deleteMessagesSafely(interaction: ChatInputCommandInteraction) {
  const { client } = interaction;
  try {
    const messages = await interaction.channel?.messages
      .fetch({
        limit: 20,
        cache: false,
      })
      .catch((error) => {
        console.debug(error, ".catch");
      });

    messages
      ?.filter((message) => message.author.id === client.user?.id)
      .map((message) => message)
      .forEach((message) => {
        if (message.deletable) {
          message.delete().catch((error) => {
            if (error.rawError.message === "Unknown Message") {
              interaction.editReply(`Error: ${error.rawError.message}`);
            }
          });
        }
      });
  } catch (error) {
    console.debug(error, "catch");
    if (error.rawError.message === "Unknown Message") {
      interaction.editReply(`Error: ${error.rawError.message}`);
    }
  }
}
