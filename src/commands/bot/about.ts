import { Command } from "@sapphire/framework";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { bot_config, emojis } from "../../config";

export class AboutCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => {
      return builder.setName("about").setDescription(`About me!`);
    });
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("about-me")
        .setEmoji({ id: emojis.folder.id })
        .setStyle(ButtonStyle.Primary),
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `# Qwik\n*Qwik is a multipurpose Discord bot, with feature's like Automod, moderation, logging & suggestions.*\n\n**Ping:** \`${this.container.client.ws.ping}ms\`\n**Developer(s):** \`${bot_config.developerNames.map((user) => user).join(", ")}\``,
      )
      .setColor("Blurple")
      .setTimestamp();

    return interaction.reply({ embeds: [embed], components: [buttons] });
  }
}
