import { Subcommand } from "@sapphire/plugin-subcommands";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { guilds } from "../Schema/guild";
import utils from "../utils/utils";

export class AutoMod extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options,
  ) {
    super(context, {
      ...options,
      subcommands: [
        {
          name: "invite",
          chatInputRun: "invite",
        },
        {
          name: "link",
          chatInputRun: "link",
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("automod")
        .setDescription("Auto moderation commands.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((command) => {
          return command
            .setName("invite")
            .setDescription("Config anti invite")
            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Enable/Disable anti invite module.")
                .setRequired(true);
            })
            .addStringOption((option) => {
              return option
                .setName("action")
                .setDescription("Action to use.")
                .addChoices(
                  { name: "Delete", value: "delete" },
                  { name: "Kick", value: "kick" },
                  { name: "Ban", value: "ban" },
                );
            });
        })
        .addSubcommand((command) => {
          return command
            .setName("link")
            .setDescription("Config anti links")
            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Enable/Disable anti link module.")
                .setRequired(true);
            })
            .addStringOption((option) => {
              return option
                .setName("action")
                .setDescription("Action to use")
                .addChoices(
                  {
                    name: "Delete",
                    value: "delete",
                  },
                  {
                    name: "Kick",
                    value: "kick",
                  },
                  {
                    name: "Ban",
                    value: "ban",
                  },
                );
            });
        });
    });
  }

  public async link(interaction: Subcommand.ChatInputCommandInteraction) {
    const embed = this.baseEmbed(interaction);
    const { options, guild } = interaction;
    const status = options.getBoolean('enabled', true);
    const action = options.getString('action') || "delete";
    await interaction.deferReply();
    const data = await guilds.findOne({ id: guild?.id });
    if (data) {
      const result = await this.config('anti_link', data, status, action);
      if (result) {
        interaction.editReply({ 
          embeds: [
            embed.setDescription(`${utils.emoji(true)} | **${status ? 'Enabled' : 'Disabled'} anti link settings.**`).setColor('Blurple')
          ]
        })
      } else {
        await new guilds({ id: guild?.id }).save();
        interaction.editReply({
          embeds: [
            embed.setDescription(`${utils.emoji(false)} | **Looks like this server has never been configured, please re-run this command.`).setColor
            ('Blurple')
          ]
        })
      }
    }
  }

  public async invite(interaction: Subcommand.ChatInputCommandInteraction) {
    const embed = this.baseEmbed(interaction);
    const { options, guild } = interaction;
    const status = options.getBoolean("enabled", true);
    const action = options.getString("action") || "delete";
    await interaction.deferReply();
    const data = await guilds.findOne({ id: guild?.id });
    if (data) {
      const result = await this.config("anti_invite", data, status, action);
      if (result) {
        interaction.editReply({
          embeds: [
            embed
              .setDescription(
                `${utils.emoji(true)} | **${status ? "Enabled" : "Disabled"} anti invite settings.**`,
              )
              .setColor("Blurple"),
          ],
        });
      }
    } else {
      await new guilds({
        id: guild?.id,
      }).save();
      interaction.editReply({
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

  private async config(
    objectName: string,
    data: any,
    status: boolean,
    action: string,
  ) {
    try {
      data.automod[objectName].enabled = status;
      data.automod[objectName].action = action;
      data.save();
      return true;
    } catch (error) {
      this.container.logger.error(error);
      return false;
    }
  }

  private baseEmbed(int: Subcommand.ChatInputCommandInteraction) {
    return new EmbedBuilder()
      .setAuthor({
        name: int.user.username,
        iconURL: int.user.displayAvatarURL(),
      })
      .setTimestamp();
  }
}
