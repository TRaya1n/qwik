import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Message,
  PermissionFlagsBits,
  Embed,
} from "discord.js";
import { Qwik } from "../../Qwik";
import {
  CommandProperties,
  SlashCommandProperties,
} from "../../Qwik/interfaces/QwikCommandOptions";
import { getCommand } from "../../Utils/CommandUtils";
import { errorEmbed } from "../../Utils/helpers";

export const SlashCommand: SlashCommandProperties = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(`Kick a member of a guild`)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .addUserOption((option) => {
      option
        .setName("member")
        .setDescription("the member to kick!")
        .setRequired(true);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("reason")
        .setDescription("reason for kicking this member")
        .setMinLength(5)
        .setRequired(false);
      return option;
    }),
  execute: async (client: Qwik, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("member");
    const reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(`${user?.id}`);

    if (member && member.id) {
      if (member.id === interaction.guild?.ownerId) {
        return interaction.editReply(
          errorEmbed(client, {
            name: "KickCommandError",
            origin: "KickGuildOwner",
            message: `:x: | **You cannot kick the server owner.**`,
          }),
        );
      }

      if (!member.kickable) {
        interaction.editReply(
          errorEmbed(client, {
            name: "KickCommandError",
            origin: "KickMemberNotKickableByClient",
            message: `:x: | **I cannot kick this member.**`,
          }),
        );
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("collector-kick:yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("collector-kick:no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Are you sure you want to kick this member? (${member})`,
        )
        .setColor("Orange")
        .setTimestamp();

      interaction.editReply({ embeds: [embed], components: [row] });

      const collector = interaction.channel?.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
      });

      collector?.on("collect", async (i) => {
        await i.deferReply({ ephemeral: true });

        if (i.customId === "collector-kick:yes") {
          try {
            await member.kick(reason ? reason : "No reason provided [qwik]");
            const embed = new EmbedBuilder()
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setDescription(`✅ | **Kicked ${user}**`)
              .setColor("Greyple")
              .setTimestamp();
            interaction.editReply({ embeds: [embed], components: [] });
            i.editReply("Executing....");
            return collector.stop();
          } catch (error) {
            console.debug(error);
          }
        } else if (i.customId === "collector-kick:no") {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`:x: | **Canceled kicking this member**`)
            .setColor("Orange")
            .setTimestamp();
          interaction.editReply({ embeds: [embed], components: [] });
          i.editReply("Canceled.");
          return collector.stop();
        }
      });
    }
  },
};

export const MessageCommand: CommandProperties = {
  name: "kick",
  aliases: [],
  category: "moderation",
  description: "Kick a member in a guild",
  permissions: {
    user: ["KickMembers"],
    client: ["KickMembers"],
  },
  execute: async (client: Qwik, message: Message, args: any[]) => {
    const user = message.mentions.users.first() || args[0];
    const reason = args.splice(1).join(" ");

    if (!user) {
      const embed = getCommand({
        name: "kick",
        client,
        options: {
          embed: true,
          target: message.member,
          message: "Argument user is missing",
        },
      });
      return message.reply({ embeds: [embed] });
    }

    const member = message.guild?.members.cache.get(`${user?.id}`);

    if (member && member.id) {
      if (member.id === message.guild?.ownerId) {
        return message.reply(
          errorEmbed(client, {
            name: "KickCommandError",
            origin: "KickGuildOwner",
            message: ":x: | **You cannot kick the server owner.**",
          }),
        );
      }

      if (!member.kickable) {
        return message.reply(
          errorEmbed(client, {
            name: "KickCommandError",
            origin: "KickMemberNotKickableByClient",
            message: `:x: | **I cannot kick this member.**`,
          }),
        );
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("collector-kick:yes")
          .setStyle(ButtonStyle.Success)
          .setLabel("Yes"),
        new ButtonBuilder()
          .setCustomId("collector-kick:no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger),
      );

      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(`Are you sure you want to kick this member?`)
        .setColor("Orange")
        .setTimestamp();

      const msg = await message.channel.send({
        embeds: [embed],
        content: `${message.author}`,
        components: [row],
      });

      const collector = msg.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === message.author.id,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "collector-kick:yes") {
          try {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
              })
              .setDescription(`✅ | **Kicked ${member}**`)
              .setColor("Greyple")
              .setTimestamp();
            await member.kick(reason ? reason : "No reason provided [Qwik]");
            msg.edit({ embeds: [embed], components: [] });
            interaction.reply({
              content: `✅ | **Kicking member...**`,
              ephemeral: true,
            });
            return collector.stop();
          } catch (error) {
            console.debug(error);
          }
        } else if (interaction.customId === "collector-kick:no") {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(`✅ | **Canceled kick**`)
            .setColor("Orange")
            .setTimestamp();
          msg.edit({ embeds: [embed], components: [] });
          interaction.reply({
            content: `✅ | **Canceled kicking this member**`,
            ephemeral: true,
          });
          return collector.stop();
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time" && msg.editable) {
          msg.edit({
            embeds: [embed],
            components: [row],
          });
        }
      });
    }
  },
};
