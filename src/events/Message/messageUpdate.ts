import { Message, EmbedBuilder } from "discord.js";
import { logger as log } from "../../Utils/pino-logger";

export async function Event(oldMessage: Message, message: Message) {
  if (!message.guild) return;
  if (message.partial) message.fetch().catch(log.error);
  // const data = await AdminSchema.findOne({ guildId: message.guildId });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL(),
    })
    .setDescription(
      `**Before:**\n${s(oldMessage.content)}\n\n**After:**\n${s(
        message.content,
      )}`,
    )
    .setColor("Orange")
    .setFooter({
      text: `ID: ${message.id} | GID: ${message.guildId}`,
      iconURL: message.author.displayAvatarURL(),
    });

  if (message.attachments.size > 0) {
    embed.addFields({
      name: `Attachments:`,
      value: `\`-\` ${message.attachments
        .map(
          (attachment) =>
            `[${attachment.name.toLowerCase()}<${attachment.size}>](${
              attachment.url
            })`,
        )
        .join(`\n\`-\` `)}`,
    });
  }
  /*
  if (data && data.channel) {
    const channel = message.guild.channels.cache.get(data.channel);
    if (
      !channel
        ?.permissionsFor(message.client.user.id, true)
        ?.has("SendMessages")
    )
      return;

    if (channel && channel.isTextBased()) {
      return channel.send({ embeds: [embed] }).catch(log.error);
    }
  }*/
}

function s(str: String) {
  return str.length >= 2048 ? str.substring(2048) + "..." : str;
}