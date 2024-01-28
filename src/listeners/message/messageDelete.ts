import { Events, Listener } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import utils from "../../utils/utils";
import { guilds } from "../../Schema/guild";

export class MessageDelete extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      event: Events.MessageDelete,
    });
  }

  public override async run(message: Message) {
    if (!message.inGuild()) return;
    const { guild, author } = message;

    const embed = new EmbedBuilder()
      .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
      .setColor("Blurple")
      .setFooter({ text: `GuildID:  ${guild.id} | MessageDeleted` })
      .setTimestamp();

    if (message.embeds[0] && message.embeds[0].description) {
      if (author.id === this.container.client.user?.id) return;
      embed.setDescription(
        `${utils.checkCharLimit(message.embeds[0].description, 4096)}`,
      );
    } else {
      embed.setDescription(`${utils.checkCharLimit(message.content, 4096)}`);
    }

    const data = await guilds.findOne({ id: guild?.id });
    if (data && data.log && data.log.message_logging) {
      if (data.log.message_logging.enabled) {
        const channel = guild?.channels.cache.get(
          data.log.message_logging.channel,
        );
        if (channel && channel.isTextBased()) {
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
