import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Qwik } from "../../Qwik";

export async function Event(interaction: ModalSubmitInteraction, client: Qwik) {
  const { guild, user } = interaction;
  if (!interaction.isModalSubmit()) return;

  const customId = interaction.customId.split("-");

  if (customId[1] === "nickname") {
    const memberId = interaction.customId.split("-")[2];
    const member = await interaction.guild?.members.fetch(memberId);

    if (!member?.manageable) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(":x: | **I cannot change the nickname of this member**")
        .setColor("Orange")
        .setTimestamp();
      interaction.reply({
        content: ":x: | **Failed to change the nickname of this member**",
        ephemeral: true,
      });
      return interaction.message?.edit({ embeds: [embed], components: [] });
    }

    await member?.setNickname(
      interaction.fields.getTextInputValue("nickname-input"),
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `**Changed ${member?.user}'s nickname to:** ${member?.nickname}`,
      )
      .setColor("Orange")
      .setTimestamp();

    interaction.reply({
      content: "**✅ | Nickname Changed**",
      ephemeral: true,
    });
    return interaction.message?.edit({ embeds: [embed], components: [] });
  }
}
