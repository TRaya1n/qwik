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
    interaction.editReply({ content: `\`Executing command...\`` });

    try {
      const messages = await interaction.channel?.messages
        .fetch({
          limit: 20,
          cache: false,
        })
        .catch(console.debug);

        await deleteMessagesSafely(interaction);

    interaction.editReply({ content: `\`Executed command.\`` });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`**Cleared 20 messages sent by me!**`)
      .setColor("Orange")
      .setFooter({ text: `Executed by ${interaction.user.username}` })
      .setTimestamp();

    interaction.channel?.send({ embeds: [embed] });
  },
};


async function deleteMessagesSafely(interaction: ChatInputCommandInteraction) {
  const { client } = interaction;
  try {
    const messages = await interaction.channel?.messages.fetch({
    limit: 20,
    cache: false
  });

  messages?.filter((message) => message.author.id === client.user?.id)
  .map(message=>message)
  .forEach((message) => {
    if (message.deletable) {
      message.delete();
    }
  })
} catch (error) {
  console.debug(error);
  return error;
}
}