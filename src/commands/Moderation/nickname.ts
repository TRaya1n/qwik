import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Message,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Qwik } from "../../Qwik";
import { CommandProperties } from "../../Qwik/interfaces/QwikCommandOptions";
import { getCommand } from "../../Utils/CommandUtils";
import { errorEmbed } from "../../Utils/helpers";

export const MessageCommand: CommandProperties = {
  name: "nickname",
  aliases: ["nick"],
  description: "Change a members nickname!",
  usage: "qw.nickname <user>",
  category: "moderation",
  permissions: {
    user: ["ManageNicknames"],
    client: ["ManageNicknames"],
  },
  execute: async (client: Qwik, message: Message, args: string[]) => {
    if (!message.guild) return;

    const member =
      message.mentions.members?.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!member) {
      const embed = getCommand({
        name: "nickname",
        client: client,
        options: {
          embed: true,
          target: message.member,
          message: "Please mention a valid member",
        },
      });

      message.channel.send({ embeds: [embed] });
      return;
    }

    if (
      message.member?.roles.highest.comparePositionTo(member.roles.highest) &&
      message.member.roles.highest.comparePositionTo(member.roles.highest) >= 1
    ) {
      const embed = errorEmbed(client, {
        name: "MemberHasAHigherRole",
        origin: "NicknameCommandError",
        message: ":x: | You cannot change the nickname of this member! ",
      });
      return message.channel.send(embed);
    }

    if (!member.manageable) {
      const embed = errorEmbed(client, {
        name: "BotPermissions",
        origin: "NicknameCommandError",
        message: ":x: | I cannot change the nickname of this member!",
      });
      return message.channel.send(embed);
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("collector-auto_nickname")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Moderate Nickname"),
      new ButtonBuilder()
        .setCustomId("collector-nickname")
        .setStyle(ButtonStyle.Success)
        .setLabel("Change Nickname"),
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `**Change ${member.user}'s nickname?**\nChoose one of the buttons below, **"Moderate Nickname"** will automatically change their nickname, **"Change Nickname"** will prompt you to change their nickname.`,
      )
      .setColor("Blurple")
      .setTimestamp();

    const msg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const filter = (i: ButtonInteraction) => i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (interaction: ButtonInteraction) => {
      if (interaction.customId === "collector-auto_nickname") {
        const randomString =
          "Moderated Nickname " + Math.random().toString(5).slice(2, 7);
        await member.setNickname(randomString);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(
            `**Changed ${member.user}'s nickname to:** ${member.nickname}`,
          )
          .setColor("Orange")
          .setTimestamp();

        interaction.reply({
          content: "**✅ | Nickname Changed**",
          ephemeral: true,
        });
        msg.edit({ embeds: [embed], components: [] });
        return collector.stop();
      } else if (interaction.customId === "collector-nickname") {
        const modal = new ModalBuilder()
          .setCustomId("modal-nickname-" + member.id)
          .setTitle("Nickname")
          .addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("nickname-input")
                .setLabel("Nickname")
                .setPlaceholder("Some cool nickname here")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(32)
                .setRequired(true),
            ),
          );

        await interaction.showModal(modal);
      }
    });
  },
};
