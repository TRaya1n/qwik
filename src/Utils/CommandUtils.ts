import { GuildMember, User, EmbedBuilder } from "discord.js";
import { Qwik } from "../Qwik";

export function getCommand(param: getCommandOptions) {
  const command = param.client.messageCommands
    .filter((value) => value.name === param.name)
    .map((command) => command);

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTimestamp()
    .setDescription(`**${param.options.message}**`);

  if (command[0].description) {
    embed.addFields({
      name: "**Description:**",
      value: `\`-\` ${command[0].description}`,
    });
  }

  if (command[0].usage) {
    embed.addFields({
      name: "**Usage:**",
      value: `\`-\` ${command[0].usage}`,
    });
  }

  if (param.options.target instanceof GuildMember) {
    embed.setAuthor({
      name: param.options.target.user.username,
      iconURL: param.options.target.user.displayAvatarURL(),
    });
  } else if (param.options.target instanceof User) {
    embed.setAuthor({
      name: param.options.target.username,
      iconURL: param.options.target.displayAvatarURL(),
    });
  } else {
    embed.setAuthor({
      name: param.client.user?.username ? param.client.user.username : "Qwik",
      iconURL: param.client.user?.displayAvatarURL(),
    });
  }

  return embed;
}

interface getCommandOptions {
  name: String;
  client: Qwik;
  options: {
    embed: Boolean;
    target: GuildMember | User | null;
    message: String;
  };
}
