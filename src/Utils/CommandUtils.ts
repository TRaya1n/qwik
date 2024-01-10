import { AnyThreadChannel, EmbedBuilder, GuildMember } from "discord.js";
import { Qwik } from "../Qwik";
import { CommandProperties } from "../Qwik/interfaces/QwikCommandOptions";

interface getCommandPropertiesOptions {
  embed?: boolean | false;
  member?: GuildMember | null;
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

  console.debug(command, command[0].name);

  if (command) {
    if (embed && member instanceof GuildMember) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
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
}
