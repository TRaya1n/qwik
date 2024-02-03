import { SapphireClient } from "@sapphire/framework";
import { misc } from "../../Schema/misc";
import { getJoke } from "../../lib";
import { TextChannel } from "discord.js";

/**
 * @param {string} id
 * @param {SapphireClient} client
 */
export async function AutoJoke(id: string, client: SapphireClient) {
  const data = await misc.findOne({ id });
  console.log(data);
  if (data && data.auto_joke && data.auto_joke.enabled) {
    if (data.auto_joke.channelId) {
      const channel = await client.channels.fetch(data.auto_joke.channelId);
      if (channel && channel instanceof TextChannel) {
        setInterval(() => {
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
        }, data.auto_joke?.every);
      }
    }
  }
}
