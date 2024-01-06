import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Message,
  codeBlock,
} from "discord.js";
import { Qwik } from "../../Qwik";

export const MessageCommand = {
  name: "help",
  aliases: [],
  category: "information",
  description: "See all the comands, description & aliases!",
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

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("collector-show_more")
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
          .setDescription(
            `*Here you can see a list of my features!* - Click the buttons to view the category commands.\n> **[Bot](${link(
              "bot",
            )}) - General bot commands**\n> **[Information](${link(
              "information",
            )}) - Information commands**`,
          )
          .setColor("Greyple")
          .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("Information-help.ts-category_bot")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Bot"),
          new ButtonBuilder()
            .setCustomId("Information-help.ts-category_information")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Information"),
          new ButtonBuilder()
            .setCustomId("Information-help.ts-category_moderation")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Moderation"),
        );

        interaction.editReply({ embeds: [embed], components: [row] });
        collector.stop();
      });

      collector.on("end", (collected: string, reason: string) => {
        return;
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

function searchCategory(client: Qwik, category: String) {
  const r = client.messageCommands
    .filter((commands: any) => {
      return commands.category === category;
    })
    .map((element: any) => {
      `${codeBlock(
        "js",
        `${element.name}: {\n Aliases: [${
          element.aliases ? element.aliases.join(", ") : null
        }]\n Description: "${
          element.description ? element.description : null
        }"\n}`,
      )}`;
    })
    .join("\n");
    // prevent errors(;):
  return r ? r : "No commands found in the 'Moderation' category";
}

function link(path: string) {
  return `https://qwik.gg/commands/?search=${path}&force=true&utm_source=help_command`;
}

export async function Buttons(
  interaction: ButtonInteraction,
  client: Qwik,
  customId: string,
) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user?.username,
      iconURL: interaction.user?.displayAvatarURL(),
    })
    .setColor("Greyple")
    .setTimestamp();

  if (customId[2] === "category_bot") {
    embed.setDescription(`${searchCategory(client, "bot")}`);
    return interaction.editReply({ embeds: [embed] });
  } else if (customId[2] === "category_information") {
    embed.setDescription(`${searchCategory(client, "information")}`);
    interaction.editReply({ embeds: [embed] });
  } else if (customId[2] === "category_moderation") {
    embed.setDescription(`${searchCategory(client, "moderation")}`);
    interaction.editReply({ embeds: [embed] });
  }
}
