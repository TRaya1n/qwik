import { Events, Listener } from "@sapphire/framework";
import { EmbedBuilder, GuildBasedChannel, GuildChannel, TextChannel } from "discord.js";
import { guilds } from "../../Schema/guild";

export class ChannelUpdate extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options,
  ) {
    super(context, {
      ...options,
      event: Events.ChannelUpdate,
    });
  }

  public override async run(oldChannel: GuildChannel, channel: GuildChannel) {
    const { guild } = channel;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
      .setTimestamp()
      .setColor("Orange");

    if (oldChannel.name != channel.name) {
      sendToLogChannel(
        embed
          .setDescription(
            `- **Name**\n - ${oldChannel.name} -> **${channel.name}**`,
          )
          .setFooter({ text: `GuildID: ${guild.id} | ChannelNameChanged` }),
      );
    }


    async function sendToLogChannel(embed: EmbedBuilder) {
      const data = await guilds.findOne({ id: guild.id });
      if (
        data &&
        data.log &&
        data.log.channel_logging &&
        data.log.channel_logging.enabled
      ) {
        const channel = await guild.channels.fetch(
          data.log.channel_logging.channel,
        );
        if (channel && channel.isTextBased()) {
          channel.send({ embeds: [embed] });
        }
      }
    }
  }
}
