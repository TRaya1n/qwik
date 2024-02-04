import axios from "axios";
import djs, { EmbedBuilder } from "discord.js";

export class AnimeWaifu {
  /**
   * @link https://waifu.it/
   */
  constructor() {}

  /**
   * @param {djs.Message|djs.ChatInputCommandInteraction} i
   * @returns {djs.EmbedBuilder|undefined}
   */
  public async getFact(i: djs.Message | djs.ChatInputCommandInteraction) {
    const response = await axios({
      url: `https://waifu.it/api/v4/fact`,
      headers: { Authorization: process.env.WAIFU_API_KEY },
    });

    const _id = response.data._id;
    const fact = response.data.fact;
    const embed = new EmbedBuilder()
      .setDescription(`${fact}`)
      .setFooter({ text: `Id: ${_id}` })
      .setTimestamp();
    return embed;
  }
}

interface AnimeImageSearchAPIOptions {
  url: string;
  author?: djs.APIEmbedAuthor;
  color?: djs.ColorResolvable;
  timestamp?: boolean;
  footer?: djs.APIEmbedFooter;
}

interface AnimeAPIResultObject {
  filename: string;
  episode: number;
  image: string;
  video: string;
}

export async function AnimeImageSearch(
  i: djs.Message | djs.ChatInputCommandInteraction | djs.TextChannel,
  data: AnimeImageSearchAPIOptions,
) {
  const response = await axios({
    url: `https://api.trace.moe/search?cutBorders&url=${data.url}`,
  });

  if (!response.data) {
    new Error("#AnimeImageSearch | Error");
  }

  const highest: AnimeAPIResultObject = response.data.result.shift();
  const embed = new djs.EmbedBuilder()
    .setColor(data.color ? data.color : "Blurple")
    .setImage(highest.image)
    .setDescription(
      `**Anime:** ${highest.filename}\n**Episode:** ${highest.episode ? highest.episode : "Unknown.."}\n**Video:** [View it here.](${highest.video})`,
    );

  if (data.author) {
    embed.setAuthor({
      name: data.author.name,
      iconURL: data.author.icon_url,
    });
  }

  if (data.timestamp) {
    embed.setTimestamp();
  }

  if (data.footer) {
    embed.setFooter({ text: data.footer.text });
  }

  if (i instanceof djs.ChatInputCommandInteraction) {
    if (i.deferred) {
      i.editReply({ embeds: [embed] });
    } else {
      i.reply({ embeds: [embed] });
    }
  } else if (i instanceof djs.Message) {
    i.reply({ embeds: [embed] });
  } else if (i instanceof djs.TextChannel) {
    i.send({ embeds: [embed] });
  }
}

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
