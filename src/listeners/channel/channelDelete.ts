import { Events, Listener } from "@sapphire/framework";
import { EmbedBuilder, GuildChannel } from "discord.js";
import { guilds } from "../../Schema/guild";

export class ChannelDelete extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      event: Events.ChannelDelete,
    });
  }

  public override async run(channel: GuildChannel) {
    const { guild } = channel;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ forceStatic: true })!,
      })
      .setDescription(`- **Name:**\n - ${channel.name} (${channel.id})`)
      .setFooter({ text: `GuildID: ${guild.id} | ChannelDeleted` })
      .setColor("Red")
      .setTimestamp();

    const data = await guilds.findOne({ id: guild.id });
    if (
      data &&
      data.log &&
      data.log.message_logging &&
      data.log.message_logging.enabled
    ) {
      const logchannel = await guild.channels.fetch(
        data.log.message_logging.channel,
      );
      if (logchannel && logchannel.isTextBased()) {
        logchannel.send({ embeds: [embed] });
      }
    }
  }
}
