import axios from "axios";
import djs from "discord.js";

export const APICategories = [
  "Any",
  "Programming",
  "Miscellaneous",
  "Dark",
  "Pun",
  "Spooky",
  "Christmas",
];

interface getJokeAPIOptions {
  category?: string | null;
}

interface getJokeEmbedOptions {
  embed_options?: {
    color: djs.ColorResolvable;
    timestamp?: true;
  };

  data: {
    target: djs.User;
    message: djs.Message | djs.ChatInputCommandInteraction;
  };
}

/**
 *
 * @param {getJokeAPIOptions} API
 * @param {getJokeEmbedOptions} embed
 */
export async function getJoke(
  API?: getJokeAPIOptions,
  embed?: getJokeEmbedOptions,
) {
  let url = "https://v2.jokeapi.dev/joke/Any";
  if (API && API.category && APICategories.includes(API.category))
    url = `https://v2.jokeapi.dev/joke/${API.category}`;

  const response = await axios({
    url: url + "?blacklistFlags=nsfw,racist,sexist", // blacklist will be an getJokeAPIOption in @lib/api v2
    method: "GET",
  });

  if (response.data.error) {
    return new Error(response.data.error);
  }

  let setup;
  let delivery;
  let joke;

  if (response.data.setup) setup = response.data.setup;
  if (response.data.delivery) delivery = response.data.delivery;
  if (response.data.joke) joke = response.data.joke;

  if (embed) {
    const x9 = new djs.EmbedBuilder();
    if (embed.embed_options?.timestamp) {
      x9.setTimestamp();
    }
    if (embed.embed_options?.color) {
      x9.setColor(embed.embed_options.color);
    }

    if (delivery && setup) {
      x9.setTitle(`${setup}`);
      x9.setDescription(`||${delivery}||`);
    } else {
      x9.setDescription(`${joke}`);
    }

    if (embed.data.target) {
      x9.setAuthor({
        name: embed.data.target.username,
        iconURL: embed.data.target.displayAvatarURL(),
      });
    }

    if (embed.data.message instanceof djs.Message) {
      embed.data.message.reply({ embeds: [x9] });
    } else {
      if (embed.data.message.deferred) {
        embed.data.message.editReply({ embeds: [x9] });
      } else {
        embed.data.message.reply({ embeds: [x9] });
      }
    }
  }

  if (delivery && setup) {
    return {
      d: delivery,
      s: setup,
    };
  } else {
    return {
      j: joke,
    };
  }
}
