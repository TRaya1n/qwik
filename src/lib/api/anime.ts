import axios from "axios";
import djs from "discord.js";

interface getAnimeQuoteOptions {
  embed: boolean;
  target: djs.User;
  message: djs.Message | djs.ChatInputCommandInteraction;
  color: djs.ColorResolvable;
  timestamp?: boolean;
}

export async function getAnimeQuote(options?: getAnimeQuoteOptions) {
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

  if (options?.embed) {
    const embed = new djs.EmbedBuilder();

    if (options.target) {
      embed.setAuthor({
        name: options.target.username,
        iconURL: options.target.displayAvatarURL(),
      });
    }

    if (options.color) {
      embed.setColor(options.color);
    }

    if (options.timestamp) {
      embed.setTimestamp();
    }

    embed.setDescription(
      `- **Anime:**\n - ${anime}\n- **Character:**\n - ${character}\n- **Quote:**\n - ${quote}`,
    );

    if (options.message instanceof djs.Message) {
      options.message.reply({ embeds: [embed] });
    } else {
      if (options.message.deferred) {
        options.message.editReply({ embeds: [embed] });
      } else {
        options.message.reply({ embeds: [embed] });
      }
    }
  }

  return {
    anime,
    character,
    quote,
  };
}
