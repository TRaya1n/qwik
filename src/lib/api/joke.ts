import axios from "axios";
import djs from "discord.js";

export const JokeAPICategories = [
  "Any",
  "Programming",
  "Miscellaneous",
  "Dark",
  "Pun",
  "Spooky",
  "Christmas",
];

type JokeAPIBlacklistString =
  | "nsfw"
  | "religious"
  | "political"
  | "racist"
  | "sexist"
  | "explicit";

interface JokeAPIOptions {
  category: string;
  blacklist: JokeAPIBlacklistString[];
}

interface JokeOptions {
  color?: djs.ColorResolvable;
  timestamp?: true;
  footer?: djs.APIEmbedFooter;
  author?: djs.APIEmbedAuthor;
}

/**
 *
 * @param {JokeAPIOptions} API
 * @param {JokeOptions} embed
 */
export async function getJoke(
  i: djs.Message | djs.ChatInputCommandInteraction | djs.TextChannel,
  data?: JokeAPIOptions,
  embed?: JokeOptions,
) {
  let build = "https://v2.jokeapi.dev/joke/Any";
  let url;

  if (data && JokeAPICategories.includes(data.category))
    build = `https://v2.jokeapi.dev/joke/${data.category}`;
  if (data && data.blacklist)
    url = `${build}?blacklistFlags=${data.blacklist.map((v) => v).join(",")}`;

  const response = await axios({
    url: url,
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
    const x9 = new djs.EmbedBuilder().setColor(
      embed.color ? embed.color : "Blurple",
    );

    if (embed.timestamp) {
      x9.setTimestamp();
    }

    if (delivery && setup) {
      x9.setTitle(`${setup}`);
      x9.setDescription(`||${delivery}||`);
    } else {
      x9.setDescription(`${joke}`);
    }

    if (embed.author) {
      x9.setAuthor({
        name: embed.author.name,
        iconURL: embed.author.icon_url,
      });
    }

    if (embed.footer) {
      x9.setFooter({ text: embed.footer.text, iconURL: embed.footer.icon_url });
    }

    if (i instanceof djs.Message) {
      i.reply({ embeds: [x9] });
    } else if (i instanceof djs.ChatInputCommandInteraction) {
      if (i.deferred) {
        i.editReply({ embeds: [x9] });
      } else {
        i.reply({ embeds: [x9] });
      }
    } else if (i instanceof djs.TextChannel) {
      i.send({ embeds: [x9] });
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
