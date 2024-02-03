import { SapphireClient } from "@sapphire/framework";
import { misc } from "../../Schema/misc";
import { CronJob } from "cron";
import { getJoke } from "../../lib";
import { TextChannel } from "discord.js";

export async function AutoSendJoke(client: SapphireClient) {
  const guilds = await misc.find();
  for (const data of guilds) {
    console.log(data);
    if (data.auto_joke && !data.auto_joke.enabled) return;
    if (!data.auto_joke || !data.auto_joke.channelId) return;
    const channel = await client.channels.fetch(data.auto_joke?.channelId);
    if (!channel) return;
    if (channel instanceof TextChannel) {
      getJoke(
        { category: "Any" },
        {
          data: {
            message: channel,
          },
          embed_options: {
            color: "Blurple",
            timestamp: true,
          },
        },
      );
    }
  }
}
