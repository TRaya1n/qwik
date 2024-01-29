import { Events, Listener } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import utils from "../../utils/utils";
import { guilds } from "../../Schema/guild";

export class MessageUpdate extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      event: Events.MessageUpdate,
    });
  }

  public override async run(oldMessage: Message, message: Message) {
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    if (message.partial)
      await message.fetch().catch(this.container.logger.error);
    if (oldMessage.partial)
      await oldMessage.fetch().catch(this.container.logger.error);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`> **[Jump to message](${message.url})**`)
      .addFields(
        {
          name: "**New:**",
          value: `${utils.checkCharLimit(message.content, 1024)}`,
        },
        {
          name: "**Old:**",
          value: `${utils.checkCharLimit(message.content, 1024)}`,
        },
      )
      .setColor("Orange")
      .setFooter({ text: `GuildID: ${message.guildId} | MessageUpdated` })
      .setTimestamp();

    const data = await guilds.findOne({ id: message.guildId });
    if (data && data.log && data.log.message_logging) {
      if (data.log.message_logging.enabled) {
        const channel = await message.guild.channels.fetch(
          data.log.message_logging.channel,
        );
        if (channel && channel.isTextBased()) {
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
