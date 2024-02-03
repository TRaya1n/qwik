import djs from "discord.js";
import axios from "axios";

export const FactTypes = ["useless"];

interface FactAPIOptions {
  type: string;
  author?: djs.APIEmbedAuthor;
  color?: djs.ColorResolvable;
  timestamp?: boolean;
  footer?: djs.APIEmbedFooter;
}

/**
 *
 * @param {djs.Message|djs.ChatInputCommandInteraction|djs.TextChannel} i
 * @param {FactAPIOptions} data
 */
export async function getFact(
  i: djs.Message | djs.ChatInputCommandInteraction | djs.TextChannel,
  data: FactAPIOptions,
) {
  if (data.type === "useless") {
    await UselessFact(i, data);
  }
}

async function UselessFact(
  i: djs.Message | djs.ChatInputCommandInteraction | djs.TextChannel,
  data: FactAPIOptions,
) {
  const response = await axios({
    url: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`,
    method: "GET",
  });

  const id = response.data.id;
  const text = response.data.text;
  const source = response.data.source;

  const embed = new djs.EmbedBuilder().setColor(
    data.color ? data.color : "Blurple",
  );

  if (data.footer) {
    embed.setFooter({ text: data.footer.text });
  }

  if (data.timestamp) {
    embed.setTimestamp();
  }

  if (data.author) {
    embed.setAuthor({
      name: data.author.name,
      iconURL: data.author.icon_url,
    });

    embed.setDescription(`${text}`);

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
  }

  return {
    id,
    text,
    source,
  };
}
