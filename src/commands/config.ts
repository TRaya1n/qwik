import { Subcommand } from "@sapphire/plugin-subcommands";
import { PermissionFlagsBits, ChannelType, EmbedBuilder } from "discord.js";
import { guilds } from "../Schema/guild";
import utils from "../utils/utils";

export class ConfigCommand extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
    super(context, {
      ...options,
      name: "config",
      subcommands: [
        {
          name: "logging",
          type: "group",
          entries: [{ name: "message", chatInputRun: "logging_message" }],
        },
      ],
    });
  }

  public registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("config")
        .setDescription("Config the bot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommandGroup((group) => {
          return group
            .setName("logging")
            .setDescription("Config logging settings.")
            .addSubcommand((command) => {
              return command
                .setName("message")
                .setDescription("Config message log settings.")
                .addBooleanOption((option) => {
                  return option
                    .setName("enabled")
                    .setDescription("Enable/Disable message logging module.")
                    .setRequired(true);
                })
                .addChannelOption((option) => {
                  return option
                    .setName("channel")
                    .setDescription("The channel to log message updates")
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true);
                });
            });
        });
    });
  }

  public async logging_message(
    interaction: Subcommand.ChatInputCommandInteraction,
  ) {
    const { options, guild } = interaction;
    const embed = this.baseEmbed(interaction);
    const status = options.getBoolean("enabled", true);
    const channel = options.getChannel("channel", true);
    await interaction.deferReply();
    const data = await guilds.findOne({ id: guild?.id });
    if (data) {
      const result = await this.configLogging(
        "message_logging",
        data,
        status,
        channel.id,
      );
      if (result) {
        return interaction.editReply({
          embeds: [
            embed
              .setDescription(
                `${utils.emoji(true)} | **${status ? "Enabled" : "Disabled"} message logging, channel: ${channel}**`,
              )
              .setColor("Blurple"),
          ],
        });
      }
    } else {
      await new guilds({ id: guild?.id }).save();
      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `${utils.emoji(false)} | **Looks like this server has never been configured, please re-run this command.**`,
            )
            .setColor("Blurple"),
        ],
      });
    }
  }

  // Logging functions;
  private async configLogging(
    objectName: string,
    data: any,
    status: boolean,
    channelId: string,
  ) {
    try {
      data.log[objectName].enabled = status;
      data.log[objectName].channel = channelId;
      await data.save();
      return true;
    } catch (error) {
      this.container.logger.error(error);
      return false;
    }
  }

  private baseEmbed(interaction: Subcommand.ChatInputCommandInteraction) {
    return new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();
  }
}
