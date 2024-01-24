import { Command, RegisterBehavior } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("ping")
        .setDescription("Qwiks ping!")
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
    const ephemeral = interaction.options.getBoolean("hide") || false;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `\`-\` **My ping is:** ${this.container.client.ws.ping}ms`,
      )
      .setColor("NotQuiteBlack")
      .setTimestamp();
    interaction.reply({ embeds: [embed], ephemeral });
  }
}
