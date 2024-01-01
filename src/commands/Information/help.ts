import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Message,
} from "discord.js";
import { Qwik } from "../../Qwik";

export const MessageCommand = {
  name: "help",
  execute: async (client: Qwik, message: Message, args: any[]) => {
    const msg = await message.channel.send({
      content: `\`Loading help command...\``,
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username.toString(),
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**This help menu only shows __Message__ commands**`)
      .setColor("Greyple")
      .setTimestamp();

    msg.edit({ content: null, embeds: [embed] });

    if (args[0]) {
      message_help_(client, msg, args);
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username.toString(),
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
          `**Click [here](https://docs.qwik.gg/commands/?t=m&i=000&source=help_command_${message.author.id}_${message.guildId}) for additional help with commands!**`,
        )
        .setColor("Greyple")
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("show_more")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Show more"),
      );

      msg.edit({
        content: null,
        embeds: [embed],
        components: [row],
      });

      const collector = await message.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
      });

      collector.on("collect", async (interaction: ButtonInteraction) => {
        if (msg.deletable) {
          await msg.delete();
        }

        await interaction.deferReply();

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username.toString(),
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`**...more**`)
          .setColor("Greyple")
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("category-bot")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Bot"),
          new ButtonBuilder()
            .setCustomId("category-information")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Information"),
        );

        interaction.editReply({ embeds: [embed], components: [row] });
        collector.stop();
      });

      collector.on("end", (collected: string, reason: string) => {
        console.debug(collected, reason);
      });
    }
  },
};

function message_help_(client: Qwik, message: Message, args: any[]) {
  let command = client.messageCommands.get(args[0]);
  if (!command) command = client.aliases.get(args[0]);

  if (!command) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username.toString(),
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(`**No command found matching qw.**__${args[0]}__`)
      .setColor("Orange")
      .setTimestamp();
    return message.edit({ content: null, embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: message.author.username.toString(),
      iconURL: message.author.displayAvatarURL(),
    })
    .setDescription(`**This help menu only shows __Message__ commands**`)
    .setColor("Greyple")
    .setTimestamp();

  if (command.name) {
    embed.addFields({
      name: "Name",
      value: `${command.name}`,
    });
  }

  if (command.aliases && Array.isArray(command.aliases)) {
    const aliases = command.aliases.map((element: any) => {
      return element;
    });

    embed.addFields({
      name: "Aliases",
      value: `${aliases.join(", ")}`,
    });
  }

  message.edit({ content: null, embeds: [embed] });
}
