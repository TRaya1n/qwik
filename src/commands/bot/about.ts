import { Command } from "@sapphire/framework";
import { EmbedBuilder, embedLength } from "discord.js";

export class AboutCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("about")
        .setDescription(`About me!`)
        .addStringOption((option) => {
          return option
            .setName("module")
            .setDescription(`View information on a specific module!`)
            .addChoices(
              {
                name: "Moderation",
                value: "moderation",
              },
              {
                name: "Automod",
                value: "automod",
              },
            )
            .setRequired(false);
        })
        .addBooleanOption((option) => {
          return option
            .setName("hide")
            .setDescription("Hide the interaction response?")
            .setRequired(false);
        });
    });
  }

  public override chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const module = interaction.options.getString("module") || false;
    const ephemeral = interaction.options.getBoolean("hide") || false;

    if (!module) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setThumbnail(this.container.client.user?.displayAvatarURL()!)
        .setDescription(`About me`)
        .setColor("Blurple")
        .setTimestamp();

      interaction.reply({ embeds: [embed], ephemeral });
    } else {
      const embed = this.module(
        module,
        new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setThumbnail(this.container.client.user?.displayAvatarURL()!)
          .setColor("Blurple")
          .setTimestamp(),
      );
      interaction.reply({ embeds: [embed], ephemeral });
    }
  }

  public module(name: String, embed: EmbedBuilder) {
    if (name === "moderation") {
      return embed.setDescription("Moderation");
    } else if (name === "automod") {
      return embed.setDescription("automod");
    }

    return embed;
  }
}
