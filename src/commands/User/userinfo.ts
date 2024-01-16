import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  GuildMember,
  Message,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Qwik } from "../../Qwik";
import moment from "moment";
import { CommandProperties } from "../../Qwik/interfaces/QwikCommandOptions";
import { getCommandProperties } from "../../Utils/CommandUtils";

export const MessageCommand: CommandProperties = {
  name: "userinfo",
  aliases: ["whois"],
  category: "user",
  description: `Get information on a specific member`,
  usage: "qw.userinfo @user",
  execute: async (client: Qwik, message: Message, args: any[]) => {
    const user = message.mentions.users.first() || args[0];

    if (!user) {
      const embed: any = getCommandProperties(client, "userinfo", {
        embed: true,
        member: user,
      });
      return message.reply({ embeds: [embed] });
    }

    const member = message.guild?.members.cache.get(user.id);

    if (member) {
      const informationDescription: string = `**Username:**\n\`-\` ${
        member.user.username
      }\n**CreatedAt:**\n\`-\` ${moment(
        member.user.createdAt,
      )}\n**JoinedAt:**\n\`-\` ${moment(
        member.joinedAt,
      )}\n**AvatarURL:**\n\`-\` [Click Here](${member.displayAvatarURL()})`;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.displayAvatarURL(),
        })
        .setDescription(informationDescription)
        .setColor("Greyple")
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }
  },
};

export const ContextMenu = {
  data: new ContextMenuCommandBuilder()
    .setName("User Information")
    .setType(ApplicationCommandType.User),
  execute: async (
    client: Qwik,
    interaction: UserContextMenuCommandInteraction,
  ) => {
    await interaction.deferReply({ ephemeral: true });

    if (interaction.guild) {
      const member = await interaction.guild.members.fetch(
        interaction.targetId,
      );
      if (member instanceof GuildMember) {
        const informationDescription: string = `**Username:**\n\`-\` ${
          member.user.username
        } (${member.id})\n**CreatedAt:**\n\`-\` ${moment(
          member.user.createdAt,
        ).format("DD/MM/YY")}\n**JoinedAt:**\n\`-\` ${moment(
          member.joinedAt,
        ).format(
          "DD/MM/YY",
        )}\n**AvatarURL:**\n\`-\` [Click Here](${member.user.displayAvatarURL()})`;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: member.user.username,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(informationDescription)
          .setColor("Greyple")
          .setTimestamp();
        return interaction.editReply({ embeds: [embed] });
      }
    } else {
      const user = interaction.targetUser;

      const informationDescription: string = `**Username:**\n\`-\` ${
        user.username
      } (${user.id})\n**CreatedAt:**\n\`-\` ${moment(user.createdAt).format(
        "DD/MM/YY",
      )}\n**AvatarURL:**\n\`-\` [Click Here](${user.avatarURL({
        extension: "png",
      })})`;

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(informationDescription)
        .setColor("Greyple")
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }
  },
};
