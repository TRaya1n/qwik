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
      event: Events.ChannelCreate
    });
  }

  public override async run(channel: GuildChannel) {
    const { guild } = channel;
    if (channel.partial)
      await channel.fetch().catch(this.container.logger.error);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ forceStatic: true })!,
      })
      .setDescription(`- **Name**\n - ${channel.name} (${channel.id})`)
      .setColor("Orange")
      .setFooter({ text: `GuildID: ${guild.id} | ChannelCreated` })
      .setTimestamp();

    const data = await guilds.findOne({ id: guild.id });
    if (data && data.log?.channel_logging) {
      if (data.log.channel_logging.enabled) {
        const logchannel = await guild.channels.fetch(
          data.log.channel_logging.channel,
        );
        if (logchannel && logchannel.isTextBased()) {
          logchannel.send({ embeds: [embed] });
        }
      }
    }
  }
}
