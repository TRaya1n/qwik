import axios from "axios";
import djs from "discord.js";

interface AnimeQuoteOptions {
  author?: djs.APIEmbedAuthor;
  color?: djs.ColorResolvable;
  timestamp?: boolean;
  footer?: djs.APIEmbedFooter;
}

export async function getAnimeQuote(
  i: djs.Message | djs.ChatInputCommandInteraction | djs.TextChannel,
  data?: AnimeQuoteOptions,
) {
  const response = await axios({
    url: "https://animechan.xyz/api/random",
    method: "GET",
  });

  if (!response.data) {
    return new Error("Anime API error... response.data");
  }

  const anime = response.data.anime;
  const character = response.data.character;
  const quote = response.data.quote;

  const embed = new djs.EmbedBuilder().setColor(
    data?.color ? data.color : "Blurple",
  );

  if (data?.author) {
    embed.setAuthor({
      name: data.author.name,
      iconURL: data.author.icon_url,
    });
  }

  if (data?.timestamp) {
    embed.setTimestamp();
  }

  embed.setDescription(
    `- **Anime:**\n - ${anime}\n- **Character:**\n - ${character}\n- **Quote:**\n - ${quote}`,
  );

  if (i instanceof djs.Message) {
    i.reply({ embeds: [embed] });
  } else if (i instanceof djs.ChatInputCommandInteraction) {
    if (i.deferred) {
      i.editReply({ embeds: [embed] });
    } else {
      i.reply({ embeds: [embed] });
    }
  } else if (i instanceof djs.TextChannel) {
    i.send({ embeds: [embed] });
  }

  return {
    anime,
    character,
    quote,
  };
}
