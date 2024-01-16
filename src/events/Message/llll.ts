import { EmbedBuilder, Message } from "discord.js";
import { Qwik } from "../../Qwik";
import { logger } from "../../Utils/pino-logger";
/*
export async function Event(message: Message, client: Qwik) {
  if (!message.guild) return;
  if (message.author.bot) return;

  const data = { disableInviteLinks: true } //AdminSchema.findOne({ guildId: message.guildId });

  if (data && data.disableInviteLinks === true) {
    const regexp = new RegExp(
      /(https?:\/\/|http?:\/\/)?(www.)?(discord.gg|discord.io|discord.me|discord.li|discordapp.com\/invite|discord.com\/invite)\/[^\s\/]+?(?=\b)/g,
    );

    if (regexp.test(message.content)) {
      logger.message(`[FILTER] Detected an invite link.`);
      logger.message("[FILTER] Checking for permissions.");

      if (!message.member?.permissions.has("ManageChannels" || "ManageGuild"))
        return;

      logger.message("[FILTER] Checking if the message is deletable.");
      if (message.deletable) {
        logger.message(`[FILTER] Deleting message...`);

        let deleted: any = true;
        await message.delete().catch((error) => {
          logger.info(error);
          deleted = "false (possibly already deleted)";
        });

        logger.message(
          `[FILTER] Sending message ${message.id}/${message.guildId}`,
        );

        const embed = new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(
            `Invite link detected.\n> **Sent By:**\n\`-\` ${message.author} (${message.author.id})\n> **Message Deleted:**\n\`-\` ${deleted}`,
          )
          .setColor("Red")
          .setTimestamp();
        return message.channel.send({ embeds: [embed] });
      }
    }
  }
}
*/
