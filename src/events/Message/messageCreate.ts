import { Message, EmbedBuilder, PermissionsBitField } from "discord.js";
import { Qwik } from "../../Qwik";
import { GuildSchema } from "../../models/Schema/Guild";

export async function Event(message: Message, client: Qwik) {
  const data = await GuildSchema.findOne({ guildId: message.guildId });

  if (data && data.automod?.anti_invites === true) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setColor("Orange")
      .setTimestamp();

    if (
      message.member?.permissions.has(
        "ManageGuild" || "ManageChannels" || "ManageRoles",
      )
    ) {
      return;
    }

    if (
      /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
        message.content,
      )
    ) {
      if (data.automod.actions === "DELETE") {
        message.deletable ? message.delete() : false;
        embed.setDescription(
          `**${message.author}, Please don't send invite links.**\n> **Action:**\n\`-\` Message Delete`,
        );
        return message.channel.send({ embeds: [embed] });
      } else if (data.automod.actions === "KICK") {
        if (message.member?.kickable) {
          message.deletable ? message.delete() : false;
          await message.member.kick("[automod]: Sent a invite link");
          embed.setDescription(
            `**${message.author}, Please don't send invite links.**\n> **Action:**\n\`-\` Kicked ${message.author}`,
          );
          return message.channel.send({ embeds: [embed] });
        } else {
          message.deletable ? message.delete() : false;
          embed.setDescription(
            `**${message.author}, Please don't send invite links.**\n> **Action:**\n\`-\` Failed to kick ${message.author}`,
          );
          message.channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
