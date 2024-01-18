import { EmbedBuilder, WebhookClient, codeBlock } from "discord.js";
import { Qwik } from "../Qwik";

/**
 *
 * @param {sendErrorMessageOptions} param
 */
export function sendErrorMessage(param: sendErrorMessageOptions) {
  const webhook = new WebhookClient({
    url: process.env.ERROR_WEBHOOK ? process.env.ERROR_WEBHOOK : "",
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: param.client.user?.username ? param.client.user.username : "Qwik",
      iconURL: param.client.user?.displayAvatarURL(),
    })
    .setColor("Red")
    .setFooter({ text: "Error handled" })
    .setTimestamp();

  if (param.error instanceof Error) {
    embed.setDescription(
      `**Error#name:**\n${codeBlock(
        param.error.name,
      )}\n\n**Error#message:**\n${codeBlock(
        param.error.message,
      )}\n\n**Error#stack:**\n${codeBlock(
        param.error.stack ? param.error.stack : " ",
      )}`,
    );
  } else {
    embed.setDescription(`**Error:**\n${codeBlock(param.error)}`);
  }

  webhook.send({ embeds: [embed] });
}

interface sendErrorMessageOptions {
  client: Qwik;
  error: Error | any;
}
