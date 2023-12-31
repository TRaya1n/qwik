import { EmbedBuilder, Message } from "discord.js";
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
          `**Click [here](https://docs.qwik.gg/commands/#all) for additional help with commands!**`,
        )
        .setColor("Greyple")
        .setTimestamp();

      return msg.edit({ content: null, embeds: [embed] });
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
