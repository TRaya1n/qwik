import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  InviteGuild,
  Message,
} from "discord.js";
import { CommandProperties } from "../../Qwik/interfaces/QwikCommandOptions";
import { Qwik } from "../../Qwik";
import { GuildSchema } from "../../models/Schema/Guild";
import { getCommandProperties } from "../../Utils/CommandUtils";
import { logger } from "../../Utils/pino-logger";

export const MessageCommand: CommandProperties = {
  name: "anti",
  aliases: [],
  category: "admin",
  description: "Configure guild anti filters!",
  usage: "qw.anti ...options",
  permissions: {
    user: ["ManageGuild"],
    client: ["ViewChannel", "ManageMessages"],
  },
  execute: async (client: Qwik, message: Message, args: any[]) => {
    const data = await GuildSchema.findOne({ guildId: message.guildId });

    if (!data) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          ":x: | **Please run this command again.**\n> **Reason:**\n`-` Server not found in the database (new)",
        )
        .setColor("Orange")
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
      return await new GuildSchema({ guildId: message.guildId }).save();
    }

    const type = args[0];
    const mode = args[1];

    if (!["invite"].includes(type)) {
      const embed = new EmbedBuilder()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setDescription(`:x: | **Type argument is invalid, type argument has to be one of these:** \`invite\``)
      .setColor('Orange')
      .setTimestamp();
     return message.channel.send({ embeds: [embed] });
    }

    if (!["on", "off"].includes(mode)) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `:x: | **Mode argument is invalid, mode argument has to be on/off.**`,
        )
        .setColor("Orange")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    if (type === "invite") {
      anti_invites(data, message, mode);
    }
  },
};

function anti_invites(data: any, message: Message, mode: any) {
  let success = true;
  const modeToBool = mode === "on" ? true : false;
  data.automod.anti_invites = modeToBool;
  data.save().catch((error: any) => {
    logger.error(error);
    success = false;
  });
  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.username,
      iconURL: message.author.displayAvatarURL(),
    })
    .setDescription(`✅ | **Turned ${mode} anti invite links**`)
    .setColor("Greyple")
    .setTimestamp();

  if (mode === "on") {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`Admin-anti.ts-action_delete-${message.author.id}`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Delete"),
      new ButtonBuilder()
        .setCustomId(`Admin-anti.ts-action_kick-${message.author.id}`)
        .setStyle(ButtonStyle.Primary)
        .setLabel("Kick"),
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `✅ | **Turned ${mode} anti invite links, please select a action.**`,
      )
      .setColor("Greyple")
      .setTimestamp();

    return message.channel.send({ embeds: [embed], components: [row] });
  }

  return message.channel.send({ embeds: [embed] });
}

export async function Buttons(
  interation: ButtonInteraction,
  client: Qwik,
  customId: any[],
) {
  if (interation.user.id === customId[3]) {
    const data: any = await GuildSchema.findOne({
      guildId: interation.guildId,
    });

    await interation.deferReply({ ephemeral: true });

    if (customId[2] === "action_kick") {
      data.automod.actions = "KICK";
      await data.save();
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interation.user.username,
          iconURL: interation.user.displayAvatarURL(),
        })
        .setDescription(
          `✅ | **Changed action to kick, from now on i will kick anyone who sends a invite link!**`,
        )
        .setColor("Orange")
        .setTimestamp();
      interation.message.edit({ content: 'Action: KICK', components: [] });
      return interation.editReply({ embeds: [embed] });
    } else if (customId[2] === "action_delete") {
      data.automod.actions = "DELETE";
      await data.save();
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interation.user.username,
          iconURL: interation.user.displayAvatarURL(),
        })
        .setDescription(
          `✅ | **Changed action to delete, from now on i will delete the messages containing invite links**`,
        )
        .setColor("Orange")
        .setTimestamp();
      interation.message.edit({ content: 'Action: DELETE', components: [] });
      return interation.editReply({ embeds: [embed] });
    }
  } else {
    return interation.reply({
      content: `:x: | **You can't run this button**`,
      ephemeral: true 
    });
  }
}
