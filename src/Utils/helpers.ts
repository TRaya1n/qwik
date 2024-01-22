import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionResponse,
  WebhookClient,
  codeBlock,
} from "discord.js";
import { Qwik } from "../Qwik";
import { MessageOptions } from "child_process";

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

export function errorEmbed(client: Qwik, error: CustomError | Error) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user?.username ? client.user.username : "Qwik",
      iconURL: client.user?.displayAvatarURL(),
    })
    .setColor("Red")
    .setTimestamp();

  if (error instanceof Error) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Github")
        .setURL("https://github.com/TRaya1n/qwik/issues"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Support")
        .setURL("https://discord.gg/xxxx"),
    );
    embed
      .setDescription(
        `**Please report this error to the developers using one of the buttons below!**`,
      )
      .addFields(
        {
          name: "Error Name:",
          value: `${error.name}`,
        },
        {
          name: "Error Message:",
          value: `${codeBlock(error.message)}`,
        },
      );

    return { embeds: [embed], components: [row] } as any;
  } else {
    embed.addFields({
      name: `**${error.origin ? error.origin : "Error"}:**`,
      value: `- **Name:** ${error.name}\n- **Message:**\n${error.message}`,
    });

    return { embeds: [embed] } as any;
  }
}

// interfaces (2):

interface CustomError {
  name: String;
  origin: String | null;
  message: String;
}

interface sendErrorMessageOptions {
  client: Qwik;
  error: Error | any;
}
