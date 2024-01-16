import { AnyThreadChannel, EmbedBuilder, GuildMember, User } from "discord.js";
import { Qwik } from "../Qwik";
import { CommandProperties } from "../Qwik/interfaces/QwikCommandOptions";

interface getCommandPropertiesOptions {
  embed?: boolean | false;
  member?: GuildMember | User | null;
}

/**
 *
 * @param client {Qwik}
 * @param commandName {String}
 * @param Options {getCommandPropertiesOptions}
 */
export function getCommandProperties(
  client: Qwik,
  commandName: string,
  { embed, member }: getCommandPropertiesOptions,
) {
  const command: any = client.messageCommands
    .filter((value) => value.name === commandName)
    .map((c) => c);

  if (command) {
    const embed = new EmbedBuilder();
    if (embed && member instanceof GuildMember) {
      embed.setAuthor({
        name: member.user.username,
        iconURL: member.displayAvatarURL(),
      });
    } else if (member instanceof User) {
      embed.setAuthor({
        name: member.username,
        iconURL: member.displayAvatarURL(),
      });
    }
    embed
      .setDescription(`**> ${command[0].name}**`)
      .addFields(
        {
          name: "Description",
          value: `> **${
            command[0].description
              ? command[0].description
              : "No descriprion was given for this command"
          }**`,
        },
        {
          name: "Usage",
          value: `> **${
            command[0].usage
              ? command[0].usage
              : "No usage was given for this command"
          }**`,
        },
      )
      .setColor("Greyple")
      .setTimestamp();
    return embed;
  }

  if (!embed) {
    return {
      name: command[0].name,
      command,
    };
  }
}
